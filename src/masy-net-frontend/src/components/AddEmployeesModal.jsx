import React, { useState } from "react";

const AddEmployeesModal = ({ onClose, onBuild}) => {

  const [form, setForm] = useState({
      name: "",
      email: "",
      phone: "",
      department: "",
      currentpositionlevel: "Entry",
      currentposition: "",
      startDate: "",
      responsibilities: "",
    });
  
    const handleChange = (e) => {
      setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async(e) => {
      e.preventDefault();
      await onBuild(form);
      onClose();
    }
  
  return (
    <div>
      {/* Add Employee */}
          <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-white">Add Employee</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Name"
                name="name"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 focus:outline-none focus:border-white/40 text-white"
                value={form.name}
                onChange={handleChange}
              />
              <input
                type="email"
                placeholder="Email"
                name="email"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 focus:outline-none focus:border-white/40 text-white"
                value={form.email}
                onChange={handleChange}
              />
              <input
                type="text"
                placeholder="Phone"
                name="phone"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 focus:outline-none focus:border-white/40 text-white"
                value={form.phone}
                onChange={handleChange}
              />
              <input
                type="text"
                placeholder="Department"
                name="department"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 focus:outline-none focus:border-white/40 text-white"
                value={form.department}
                onChange={handleChange}
              />
              <select
              name="currentpositionlevel"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 focus:outline-none focus:border-white/40 text-white"
                value={form.currentpositionlevel}
                onChange={handleChange}
              >
                <option value="Entry">Entry</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Manager">Manager</option>
              </select>   
              <input
                type="text"
                placeholder="Position"
                name="currentposition"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 focus:outline-none focus:border-white/40 text-white"
                value={form.currentposition}
                onChange={handleChange}
              />
              <div className="relative">
                <input
                  name="startDate"
                  type="date"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 focus:outline-none focus:border-white/40 text-white"
                  value={form.startDate}
                  onChange={handleChange}
                  style={{
                    colorScheme: 'dark'
                  }}
                />
                <label className="absolute -top-2 left-3 text-xs text-white/70 bg-richBlack px-1">
                  Start Date
                </label>
              </div>
              <input
                type="text"
                placeholder="Responsibilities"
                name="responsibilities"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 focus:outline-none focus:border-white/40 text-white"
                value={form.responsibilities}
                onChange={handleChange}
              />
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
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
  )


};


export default AddEmployeesModal
