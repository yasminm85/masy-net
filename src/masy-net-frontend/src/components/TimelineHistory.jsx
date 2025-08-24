import React, { useEffect, useState } from "react";
import { Calendar, FileText, Briefcase } from "lucide-react";
import { AuthDesc } from "../context/AuthContext";
import { Icon } from '@iconify/react';
import { createBackendActor } from "../../utils/actorClient";


const TimelineHistory = ({ employeeId, onClose }) => {
  const [history, setHistory] = useState([]);
  const {identity} = AuthDesc();

  useEffect(() => {
    const loadData = async () => {
      try {
        const actor = await createBackendActor(identity);
        const result = await actor.getPositionHistory(employeeId);
        setHistory(result?.[0] || result || []);
      } catch (err) {
        console.error("Error fetching position history:", err);
      }
    };

    loadData();
  }, [employeeId]);

  const displayPositionLevel = (positionLevel) => {
    if (typeof positionLevel === 'string') {
      return positionLevel;
    }
    if (positionLevel && typeof positionLevel === 'object') {
      return Object.keys(positionLevel)[0];
    }
    return 'Unknown';
  };

  const calculateDuration = (startDate, endDate) => {
    try {
      const start = new Date(startDate);
      const end = endDate && endDate.length > 0 ? new Date(endDate) : new Date(); 
      const startTotalMonths = start.getFullYear() * 12 + start.getMonth();
      const endTotalMonths = end.getFullYear() * 12 + end.getMonth();
      const monthCount = endTotalMonths - startTotalMonths;
      const years = Math.floor(monthCount / 12);
      const months = monthCount % 12;
      
      if (years > 0 && months > 0) {
        return `${years} year${years > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''}`;
      } else if (years > 0) {
        return `${years} year${years > 1 ? 's' : ''}`;
      } else if (months > 0) {
        return `${months} month${months > 1 ? 's' : ''}`;
      } else {
        return "Less than 1 month";
      }
    } catch (error) {
      console.error("Error calculating duration:", error);
      return "Unknown duration";
    }
  };

  const getStatus = (endDate) => {
    if (!endDate || endDate.length === 0) {
      return {
        text: "Ongoing",
        color: "bg-green-500/20 text-green-300"
      };
    } else {
      return {
        text: "End",
        color: "bg-gray-500/20 text-gray-300"
      };
    }
  };

  const handleSigned = async (index) => {
    try {
        const actor = await createBackendActor(identity);

        const principal = identity.getPrincipal();

        const result = await actor.signContract(employeeId, index, principal);
        if (result) {
          alert("Contract signed successfully!");
          const updated = await actor.getPositionHistory(employeeId);
          setHistory(updated?.[0] || updated || []);
        } else {
          alert("Failed to sign contract");
        }
      } catch (err) {
        console.error("Error signing contract:", err);
      }
  }

  return (
    <div className="min-h-screen bg-richBlack text-whiteSmoke px-4 py-10">
      <div className="relative bg-richBlack rounded-xl w-full max-w-4xl max-h-[80vh] p-6 overflow-y-auto">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-2">Timeline History Position</h1>
        <p className="text-coolGray mb-8">
          Job Timeline History
        </p>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 w-1 h-full bg-gradient-to-b from-electricPurple/40 to-neonCyan/40 rounded-full"></div>

          {/* Timeline */}
          <div className="space-y-8">
            {history.map((item, index) => (
              <div key={index} className="flex items-start relative">
                <div className="relative z-10 w-12 h-12 bg-gradient-to-br from-electricPurple/50 to-neonCyan/50 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 shadow-lg">
                  <Briefcase size={20} />
                </div>

                {/* card */}
                <div className="ml-6 flex-1">
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-lg hover:shadow-electricPurple/20 transition">
                    <h3 className="text-xl font-semibold">{item.spec_position} - {displayPositionLevel(item.position)}</h3>

                    {/* Date & duration */}
                    <div className="flex items-center flex-wrap gap-4 text-silverGray mt-2">
                      <span className="flex items-center gap-2">
                        <Calendar size={16} /> 
                        {item.startDate} - {(item.endDate && item.endDate.length > 0) ? item.endDate : "Now"}
                      </span>
                      <span className="px-3 py-1 text-sm bg-neonCyan/10 text-neonCyan rounded-full">
                        {calculateDuration(item.startDate, item.endDate)}
                      </span>
                    </div>

                    {/* desc */}
                    <div className="flex items-start gap-2 text-coolGray mt-3">
                      <FileText size={16} className="mt-1 flex-shrink-0" />
                      <p>{(item.responsibilities && item.responsibilities.length > 0) ? item.responsibilities : "-"}</p>
                    </div>

                    {/* status */}
                    <div className="mt-4">
                      <span className={`px-3 py-1 text-sm rounded-full ${getStatus(item.endDate).color}`}>
                        {getStatus(item.endDate).text}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                  {!item.isSigned ? (
                    <button
                      type="button"
                      onClick={() => handleSigned(index)}
                      className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10"
                    >Sign Contract</button>
                    ) : (
                    <span className="px-3 py-1 mt-3 inline-block rounded-lg bg-blue-600/30 text-blue-300">
                        <Icon icon="mdi:check" width="24" height="24" /> Signed By {item.signedBy ? String(item.signedBy) : "N/A"}
                    </span>
                  )}
                  </div>
                </div>
              </div>
            ))}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineHistory;