// src/components/EmployeesManagement.jsx
import React, { useState } from "react";

const EmployeesManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tableHeaders = [
    "Name",
    "Email",
    "Phone",
    "EmployeeID",
    "Department",
    "Position",
    "Position Level",
    "Action",
  ];

  const employees = [
    {
      name: "Abdul",
      email: "abdul@jimel.com",
      phone: "+62 812-3456-7890",
      id: "001",
      department: "Engineering",
      position: "Frontend Dev",
      level: "Senior",
    },
  ];

  return (
    <div className="min-h-screen bg-richBlack text-whiteSmoke px-4 py-10">

      {/* header */}
      <div id="management" className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold">Employees Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-white/10 backdrop-blur-md px-5 py-2 rounded-lg font-bold text-white hover:bg-white/20 transition-all border border-white/20"
        >
          + Add Employee
        </button>
      </div>

      {/* Tabel */}
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
                <td className="px-6 py-4">{emp.id}</td>
                <td className="px-6 py-4">{emp.department}</td>
                <td className="px-6 py-4">{emp.position}</td>
                <td className="px-6 py-4">{emp.level}</td>
                <td className="px-6 py-4 space-y-2">
                  <button className="w-full bg-white/5 px-4 py-2 rounded-lg font-medium border border-white/20 text-white hover:bg-white/20 transition">
                    View History Position
                  </button>
                  <button className="w-full bg-white/5 px-4 py-2 rounded-lg font-medium border border-white/20 text-white hover:bg-white/20 transition">
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
              <span className="text-white/70">EmployeeID:</span> {emp.id}
            </p>
            <p>
              <span className="text-white/70">Department:</span>{" "}
              {emp.department}
            </p>
            <p>
              <span className="text-white/70">Position:</span> {emp.position}
            </p>
            <p>
              <span className="text-white/70">Position Level:</span> {emp.level}
            </p>
            <div className="mt-4 space-y-2">
              <button className="w-full bg-white/5 px-4 py-2 rounded-lg font-medium border border-white/20 text-white hover:bg-white/20 transition">
                View History Position
              </button>
              <button className="w-full bg-white/5 px-4 py-2 rounded-lg font-medium border border-white/20 text-white hover:bg-white/20 transition">
                Add New Contract
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Tambah Employee */}
          <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-white">Add Employee</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 focus:outline-none focus:border-white/40 text-white"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 focus:outline-none focus:border-white/40 text-white"
              />
              <input
                type="text"
                placeholder="Phone"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 focus:outline-none focus:border-white/40 text-white"
              />
              <input
                type="text"
                placeholder="Employee ID"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 focus:outline-none focus:border-white/40 text-white"
              />
              <input
                type="text"
                placeholder="Department"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 focus:outline-none focus:border-white/40 text-white"
              />
              <input
                type="text"
                placeholder="Position"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 focus:outline-none focus:border-white/40 text-white"
              />
              <input
                type="text"
                placeholder="Position Level"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 focus:outline-none focus:border-white/40 text-white"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-white/20 text-white font-bold hover:bg-white/30"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesManagement;
