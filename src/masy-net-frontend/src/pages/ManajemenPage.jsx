import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthDesc } from "../context/AuthContext";
import AddEmployeesModal from "../components/AddEmployeesModal";
import TimelineHistory from "../components/TimelineHistory";
import AddContract from "../components/AddContract";
import { createBackendActor } from "../../utils/actorClient";
import Sidebar from "../components/Sidebar";

const EmployeesManagement = () => {
  const { identity, loading: authLoading } = AuthDesc();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    currentpositionlevel: "Entry",
    currentposition: "",
    startDate: "",
    responsibilities: ""
  });

  const [formContract, setFormContract] = useState({
    spec_position: "",
    position: "",
    startDate: "",
    endDate: "",
    responsibilities: "",
    signedBy: "",       
    signedAt: "",
    contracthash: "",
    signature: "",
    isSigned: false
  });

  useEffect(() => {
    if (authLoading) return;
    if (!identity) {
      navigate('/');
      return;
    }
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const actor = await createBackendActor(identity);
        const list = await actor.listEmployees();
        setEmployees(list);
      } catch (err) {
        console.error("Error fetching employees:", err);
        if (err.message?.includes('authentication') || err.message?.includes('identity')) {
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [identity, authLoading, navigate]);

  const handleCreate = async (form) => {
    setLoading(true);

    try {
      const actor = await createBackendActor(identity);
      await actor.addEmployees(
        form.name,                                          
        form.email,                                         
        form.phone,                                         
        form.department,                                    
        { [form.currentpositionlevel]: null },              
        form.currentposition,                               
        form.startDate,
        form.responsibilities ? [form.responsibilities] : []                                      
      );

      alert("Employee added!");
      setForm({
        name: "",
        email: "",
        phone: "",
        department: "",
        currentpositionlevel: "Entry",
        currentposition: "",
        startDate: "",
        responsibilities: ""
      });
      setIsModalOpen(false);
      const list = await actor.listEmployees();
      setEmployees(list);
    } catch (err) {
      console.error("Error adding employee:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleContract = async (form, employeeId) => {
    setLoading(true);

    try {
      const actor = await createBackendActor(identity);

      const contractData = {
        spec_position: form.spec_position,
        position: { [form.position]: null },
        startDate: form.startDate,
        endDate: form.endDate ? [form.endDate] : [], 
        responsibilities: form.responsibilities ? [form.responsibilities] : [],
        signedBy: [],      
        signedAt: [],
        contracthash: [],
        signature: [],
        isSigned: false
      };

      const result = await actor.addContract(employeeId, contractData);

      alert("Contract added!");
      setFormContract({
        spec_position: "",
        position: "Entry",
        startDate: "",
        endDate: "",
        responsibilities: "",
        signedBy: "",       
        signedAt: "",
        contracthash: "",
        signature: "",
        isSigned: false
      });
      setIsContractModalOpen(false);
      const list = await actor.listEmployees();
      setEmployees(list);
    } catch (err) {
      console.error("Error adding contract:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleHistory = (id) => {
    setSelectedEmployeeId(id);
    setIsHistoryModalOpen(true);
  }

  const handleContractId = (id) => {
    setSelectedEmployeeId(id);
    setIsContractModalOpen(true);
  }

  const displayPositionLevel = (positionLevel) => {
    if (typeof positionLevel === 'string') {
      return positionLevel;
    }
    if (positionLevel && typeof positionLevel === 'object') {
      return Object.keys(positionLevel)[0];
    }
    return 'Unknown';
  };

  const tableHeaders = [
    "Name",
    "Email",
    "Phone",
    "EmployeeID",
    "Department",
    "Position Level",
    "Position",
    "Action",
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-richBlack text-whiteSmoke flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-richBlack text-whiteSmoke">
      {/*  Sidebar  */}
      <div className="lg:hidden">
        <Sidebar />
      </div>

      <div className="lg:flex">
        <div className="hidden lg:block fixed left-0 top-0 h-full z-40">
          <Sidebar />
        </div>

        <div className="flex-1 lg:ml-16 xl:ml-72 px-4 lg:px-6 py-10 transition-all duration-300">
          {/* Header */}
          <div id="management" className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold">Employees Management</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white/10 backdrop-blur-md px-5 py-2 rounded-lg font-bold text-white hover:bg-white/20 transition-all border border-white/20"
            >
              + Add Employee
            </button>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-white/10 backdrop-blur-md bg-white/5 shadow-lg">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/10">
                <tr>
                  {tableHeaders.map((header, idx) => (
                    <th
                      key={idx}
                      className="px-6 py-4 font-semibold text-white/80 uppercase text-sm tracking-wider border-b border-white/10"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition text-sm">
                    <td className="px-6 py-4">{emp.name}</td>
                    <td className="px-6 py-4">{emp.email}</td>
                    <td className="px-6 py-4">{emp.phone}</td>
                    <td className="px-6 py-4">{emp.EmployeeID.toString()}</td>
                    <td className="px-6 py-4">{emp.department}</td>
                    <td className="px-6 py-4">{displayPositionLevel(emp.currentpositionlevel)}</td>
                    <td className="px-6 py-4">{emp.currentposition}</td>
                    <td className="px-6 py-4 space-y-2">
                      <button 
                        onClick={() => handleHistory(emp.EmployeeID)} 
                        className="w-full bg-white/5 px-4 py-2 rounded-lg font-medium border border-white/20 text-white hover:bg-white/20 transition"
                      >
                        View History Position
                      </button>
                      <button 
                        onClick={() => handleContractId(emp.EmployeeID)} 
                        className="w-full bg-white/5 px-4 py-2 rounded-lg font-medium border border-white/20 text-white hover:bg-white/20 transition"
                      >
                        Add New Contract
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Mode */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {employees.map((emp, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-xl p-4 shadow-lg backdrop-blur-md"
              >
                <p>
                  <span className="text-white/70">Name:</span> {emp.name}
                </p>
                <p>
                  <span className="text-white/70">Email:</span> {emp.email}
                </p>
                <p>
                  <span className="text-white/70">Phone:</span> {emp.phone}
                </p>
                <p>
                  <span className="text-white/70">EmployeeID:</span> {emp.EmployeeID.toString()}
                </p>
                <p>
                  <span className="text-white/70">Department:</span>
                  {emp.department}
                </p>
                <p>
                  <span className="text-white/70">Position:</span> {emp.currentposition}
                </p>
                <p>
                  <span className="text-white/70">Position Level:</span> {displayPositionLevel(emp.currentpositionlevel)}
                </p>
                <div className="mt-4 space-y-2">
                  <button 
                    onClick={() => handleHistory(emp.EmployeeID)} 
                    className="w-full bg-white/5 px-4 py-2 rounded-lg font-medium border border-white/20 text-white hover:bg-white/20 transition"
                  >
                    View History Position
                  </button>
                  <button 
                    onClick={() => handleContractId(emp.EmployeeID)} 
                    className="w-full bg-white/5 px-4 py-2 rounded-lg font-medium border border-white/20 text-white hover:bg-white/20 transition"
                  >
                    Add New Contract
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <AddEmployeesModal 
            onClose={() => setIsModalOpen(false)}
            onBuild={handleCreate}
          />
        </div>
      )}

      {isHistoryModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <TimelineHistory 
            employeeId={selectedEmployeeId}
            onClose={() => setIsHistoryModalOpen(false)}
          />
        </div>
      )}

      {isContractModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <AddContract
            employeeId={selectedEmployeeId}
            onClose={() => setIsContractModalOpen(false)}
            onBuildContract={handleContract}
          />
        </div>
      )}
    </div>
  );
};

export default EmployeesManagement;