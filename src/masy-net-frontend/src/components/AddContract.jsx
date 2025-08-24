import React, { useState } from "react";

const AddContract = ({ onClose, onBuildContract, employeeId}) => {

  const [form, setForm] = useState({
      spec_position: "",
      position: "Entry",
      startDate: "",
      endDate: "",
      responsibilities: "",
    });
  
    const handleChange = (e) => {
      setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmitContract = async(e) => {
      e.preventDefault();
      await onBuildContract(form, employeeId);
      onClose();
    }
  
  return (
    <div>
      {/* Add Contract */}
          <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-white">Add Employee</h2>
            <form className="space-y-4" onSubmit={handleSubmitContract}>
            <input
                type="text"
                placeholder="Position Now"
                name="spec_position"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 focus:outline-none focus:border-white/40 text-white"
                value={form.spec_position}
                onChange={handleChange}
              />
              <select
              name="position"
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 focus:outline-none focus:border-white/40 text-white"
                value={form.position}
                onChange={handleChange}
              >
                <option value="Entry">Entry</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
                <option value="Manager">Manager</option>
              </select>   
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
              <div className="relative">
                <input
                  name="endDate"
                  type="date"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 focus:outline-none focus:border-white/40 text-white"
                  value={form.endDate}
                  onChange={handleChange}
                  style={{
                    colorScheme: 'dark'
                  }}
                />
                <label className="absolute -top-2 left-3 text-xs text-white/70 bg-richBlack px-1">
                  End Date
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


export default AddContract
