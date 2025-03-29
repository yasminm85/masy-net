use ic_cdk_macros::*;
use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;
use candid::CandidType;
use ic_cdk::api::management_canister::http_request::{
    http_request, CanisterHttpRequestArgument, HttpHeader,
    HttpMethod, HttpResponse, TransformContext
};
use serde_json;

#[derive(Serialize, Deserialize, Clone, CandidType)]
struct Employee {
    nik: String,
    name: String,
    email: String,
    position: String,
    salary_usd: f64,
    currency: String,
}

#[derive(Serialize, Deserialize, CandidType, Default)]
struct EmployeesStorage {
    employees: BTreeMap<String, Employee>,
    exchange_rates: BTreeMap<String, f64>,
}

#[derive(CandidType, Deserialize)]
enum ApiResult {
    Ok(String),  
    Err(String)  
}

#[derive(CandidType, Deserialize)]
struct TransformArgs {
    response: HttpResponse,
    context: Vec<u8>,
}

impl From<Result<String, String>> for ApiResult {
    fn from(result: Result<String, String>) -> Self {
        match result {
            Ok(message) => ApiResult::Ok(message),
            Err(error) => ApiResult::Err(error)
        }
    }
}

thread_local! {
    static STORAGE: std::cell::RefCell<EmployeesStorage> = std::cell::RefCell::default();
}

#[update]
fn add_employee(
    nik: String,
    name: String,
    email: String,
    position: String,
    salary_usd: f64,
    currency: String,
) -> String {
    let nik_clone = nik.clone();
    
    if nik.len() != 16 || !nik.chars().all(char::is_numeric) {
        return "NIK Must 16 Digits".to_string();
    }

    STORAGE.with(|storage| {
        let mut storage = storage.borrow_mut();
        
        if storage.employees.contains_key(&nik_clone) {
            return "NIK Exist".to_string();
        }

        storage.employees.insert(nik_clone, Employee {
            nik,
            name,
            email,
            position,
            salary_usd,
            currency,
        });

        "Employee successfully stored".to_string()
    })
}

#[query]
fn get_all_employees() -> Vec<Employee> {
    STORAGE.with(|storage| {
        storage.borrow()
            .employees
            .values()
            .cloned()
            .collect()
    })
}

#[update]
async fn fetch_exchange_rates() -> ApiResult {
    let url = "https://api.exchangerate-api.com/v4/latest/USD".to_string();
    
    let request = CanisterHttpRequestArgument {
        url,
        method: HttpMethod::GET,
        headers: vec![
            HttpHeader { 
                name: "Accept".to_string(), 
                value: "application/json".to_string() 
            },
        ],
        body: None,
        max_response_bytes: Some(1_000_000),
        transform: Some(TransformContext::from_name(
            "transform_exchange_data".to_string(),
            vec![],
        )),
    };

    match http_request(request, 30_000_000_000).await {
        Ok((response,)) => {
            ic_cdk::print("Received API response");
            process_exchange_rate_response(response)
        }
        Err(e) => {
            ic_cdk::print(format!("HTTP request failed: {:?}", e));
            Err(format!("API request failed: {:?}", e))
        }
    }.into()
}

#[query(name = "transform_exchange_data")]
fn transform_exchange_data(args: TransformArgs) -> HttpResponse {
    HttpResponse {
        status: args.response.status,
        headers: vec![HttpHeader {
            name: "Content-Type".to_string(),
            value: "application/json".to_string(),
        }],
        body: args.response.body,
    }
}

fn process_exchange_rate_response(response: HttpResponse) -> Result<String, String> {
    let body = String::from_utf8(response.body)
        .map_err(|e| format!("UTF-8 error: {}", e))?;

    ic_cdk::print(format!("Raw API response: {}", body));

    #[derive(Deserialize)]
    struct ApiResponse {
        provider: String,
        terms: String,
        base: String,
        date: String,
        rates: BTreeMap<String, f64>,
    }

    let api_response: ApiResponse = serde_json::from_str(&body)
        .map_err(|e| format!("JSON parse error: {}", e))?;

    let rates_count = api_response.rates.len();
    
    STORAGE.with(|storage| {
        let mut storage = storage.borrow_mut();
        storage.exchange_rates = api_response.rates;
    });

    Ok(format!(
        "Rates updated for {} currencies (source: {}, date: {})",
        rates_count,
        api_response.provider,
        api_response.date
    ))
}

#[query]
fn calculate_salary(nik: String) -> ApiResult {
    let result = STORAGE.with(|storage| {
        let storage = storage.borrow();
        let employee = storage.employees.get(&nik).ok_or("Employee not found")?;
        let rate = storage.exchange_rates.get(&employee.currency).ok_or("Currency rate not available")?;

        let local_salary = employee.salary_usd * rate;
        Ok(format!(
            "{}: Salary {} {} = {:.2} USD (Rate: 1 USD = {} {})",
            employee.name,
            local_salary,
            employee.currency,
            employee.salary_usd,
            rate,
            employee.currency
        ))
    });
    
    result.into()
}