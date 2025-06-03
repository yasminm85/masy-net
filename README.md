# Masy-net

[Masy-net](https://wiocp-dyaaa-aaaad-qg7rq-cai.icp0.io/) is a decentralized data storage application built on the Internet Computer Protocol (ICP) that also provides real-time currency conversion information. Users can securely log in using Internet Identity (II), a passwordless authentication system, to access its features.

**✨ Key Features**:
- 🔐 Passwordless Login via Internet Identity (II)
- 🚀 On-chain Data Storage on the ICP
- 📊 Currency Conversion with exchange rates using HTTPS outcalls

## 🛠️ How It Works
### 1. Internet Identity Authentication
- User can login with Internet Identity (II)
### 2. Data Storage on ICP
- User can add new employee data and stored in canister's memory
### 3. Currency Conversion via HTTPS Outcalls
- The canister sends an authenticated request to [ExchangeRate-API](https://billing.currencyfreaks.com/login)
 
## 👾 Code Snippets
### Internet Identity Login
AuthContext.jsx
const login = async (onSuccessRedirect = "/management") => {
    try {
      if (!authClient) {
        console.error("Auth client not initialized");
        return false;
      }

      const identityProvider = import.meta.env.VITE_DFX_NETWORK === "ic"
        ? "https://identity.ic0.app"
        : `http://${import.meta.env.VITE_CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`;

      return new Promise((resolve) => {
        authClient.login({
          identityProvider,
          onSuccess: () => {
            setIsAuthenticated(true);
            const identity = authClient.getIdentity();
            setPrincipal(identity.getPrincipal());
            resolve(true);
            
            
            window.location.href = onSuccessRedirect;
          },
          onError: (error) => {
            console.error("Login failed:", error);
            resolve(false);
          },
          maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000)
        });
      });
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };
### 💱 Currency Conversion (HTTPS Outcall)
lib.rs
#[update]
async fn fetch_exchange_rates() -> ApiResult {
    let url = "https://api.exchangerate-api.com/v4/latest/USD";
    
    let request = CanisterHttpRequestArgument {
        url: url.to_string(),
        method: HttpMethod::GET,
        headers: vec![HttpHeader {
            name: "Content-Type".to_string(),
            value: "application/json".to_string(),
        }],
        body: None,
        max_response_bytes: Some(2_000_000),
        transform: None,
    };

    let result = match http_request(request, 2_000_000_000).await {
        Ok((response,)) => {
            process_exchange_rate_response(response)
        }
        Err((code, msg)) => Err(format!("HTTP error: {:?}, message: {}", code, msg)),
    };
    
    result.into()
}
### 💾 Data Storage in Canister
lib.rs
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

## 🚀 Getting Started
Prerequisites
[DFX SDK](https://internetcomputer.org/docs/building-apps/getting-started/install)
Rust (backend)
React + Vite (frontend)
Tailwind (css)

Installation

```bash
# Clone repositori
git clone https://github.com/yasminm85/masy-net.git

# Directory
cd masy-net

# Instal dependencies
npm install  

# Deploy to local ICP replica
dfx start --background
dfx deploy   
