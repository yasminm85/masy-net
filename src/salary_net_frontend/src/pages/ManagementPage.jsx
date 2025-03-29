import { useState, useEffect } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "../../../declarations/salary_net_backend";
import { useAuth } from "../context/AuthContext";

const ManagementPage = () => {
  const { principal, logout } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [convertedSalary, setConvertedSalary] = useState("");
  const [formData, setFormData] = useState({
    nik: "",
    name: "",
    email: "",
    position: "",
    salary_usd: "",
    currency: "IDR"
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const createBackendActor = async () => {
    try {
      const authClient = await AuthClient.create();
      
      if (!await authClient.isAuthenticated()) {
        setMessage({ text: "Must Login", type: "error" });
        return null;
      }

      const identity = authClient.getIdentity();
      const agent = new HttpAgent({ 
        identity,
        host: "https://ic0.app"
      });

      if (import.meta.env.VITE_DFX_NETWORK !== "ic") {
        await agent.fetchRootKey();
      }

      return Actor.createActor(idlFactory, {
        agent,
        canisterId: import.meta.env.VITE_CANISTER_ID_SALARY_NET_BACKEND,
      });
    } catch (error) {
      console.error("Error creating actor:", error);
      setMessage({ text: "Failed connect canister", type: "error" });
      return null;
    }
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const actor = await createBackendActor();
      if (!actor) return;
  
      const employees = await actor.get_all_employees();
      setEmployees(employees);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      setMessage({ text: "Failed to attach data", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fetchExchangeRates = async () => {
    try {
      const actor = await createBackendActor();
      if (!actor) return;
      
      const result = await actor.fetch_exchange_rates();
      if ("err" in result) {
        setMessage({ text: `Failed updated rates: ${result.err}`, type: "error" });
      } else {
        setMessage({ text: "Rates updated successfully", type: "success" });
      }
    } catch (error) {
      console.error("Failed to fetch rates:", error);
    }
  };
//ganti bentar
  const calculateSalary = async (nik) => {
    try {
      const actor = await createBackendActor();
      if (!actor) return;
      
      const result = await actor.calculate_salary(nik);
      if ("err" in result) {
        setMessage({ text: result.err, type: "error" });
      } else {
        setConvertedSalary(result.ok);
      }
    } catch (error) {
      console.error("Failed to calculate salary:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchExchangeRates(); 
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const actor = await createBackendActor();
      if (!actor) return;

      const result = await actor.add_employee(
        formData.nik,
        formData.name,
        formData.email,
        formData.position,
        parseFloat(formData.salary_usd),
        formData.currency
      );

      setMessage({ text: result, type: "success" });
      setFormData({
        nik: "",
        name: "",
        email: "",
        position: "",
        salary_usd: "",
        currency: "IDR"
      });
      setShowAddForm(false);
      await fetchEmployees();
    } catch (error) {
      console.error("Error detail:", error);
      setMessage({ 
        text: `Failed to add data: ${error.message || "Unknown error"}`, 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleViewSalary = (employee) => {
    setSelectedEmployee(employee);
    calculateSalary(employee.nik);
    setShowSalaryModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Employee Information</h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>

        {message.text && (
          <div className={`mb-4 p-3 rounded-lg ${
            message.type === "success" 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800"
          }`}>
            {message.text}
          </div>
        )}

        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            {showAddForm ? "Close Form" : "Add Employee"}
          </button>
          <button
            onClick={fetchExchangeRates}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Currency rate update
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Add Data</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NIK (16 digit)</label>
                <input
                  type="text"
                  name="nik"
                  value={formData.nik}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                  disabled={loading}
                  pattern="\d{16}"
                  title="Enter 16 digit"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary (USD)</label>
                <input
                  type="number"
                  name="salary_usd"
                  value={formData.salary_usd}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                  disabled={loading}
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Currency</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  disabled={loading}
                >
                  <option value="IDR">IDR (Rupiah)</option>
                  <option value="EUR">EUR (Euro)</option>
                  <option value="USD">USD (Dolar AS)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className={`px-4 py-2 rounded-md text-white ${
                  loading 
                    ? "bg-blue-400 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700"
                } flex items-center gap-2`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : "Save Data"}
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 border-b text-left">NIK</th>
                <th className="py-3 px-4 border-b text-left">Name</th>
                <th className="py-3 px-4 border-b text-left">Email</th>
                <th className="py-3 px-4 border-b text-left">Position</th>
                <th className="py-3 px-4 border-b text-left">Salary (USD)</th>
                <th className="py-3 px-4 border-b text-left">Convertion</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <tr key={employee.nik} className="hover:bg-gray-50">
                    <td className="py-3 px-4 border-b">{employee.nik}</td>
                    <td className="py-3 px-4 border-b">{employee.name}</td>
                    <td className="py-3 px-4 border-b">{employee.email}</td>
                    <td className="py-3 px-4 border-b">{employee.position}</td>
                    <td className="py-3 px-4 border-b">${employee.salary_usd.toFixed(2)}</td>
                    <td className="py-3 px-4 border-b">
                      <button
                        onClick={() => handleViewSalary(employee)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Convertion Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-4 text-center text-gray-500">
                    {loading ? "Data Load..." : "Data Empty"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showSalaryModal && selectedEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">
                Salary Convertion {selectedEmployee.name}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600">Minumum Wage:</p>
                  <p className="font-medium">${selectedEmployee.salary_usd.toFixed(2)} USD</p>
                </div>
                
                <div>
                  <p className="text-gray-600">Currency:</p>
                  <p className="font-medium">{selectedEmployee.currency}</p>
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-gray-600">Result:</p>
                  <p className="text-lg font-bold text-green-600">
                    {convertedSalary || "Menghitung..."}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowSalaryModal(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagementPage;