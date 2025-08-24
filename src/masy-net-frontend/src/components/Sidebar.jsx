import { LogOut, Users, Shield, Menu, X } from "lucide-react";
import { AuthDesc } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Sidebar = () => {
  const { logout } = AuthDesc();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setShowLogoutConfirm(false);
    }
  }

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  }

  const management = () => {
    navigate('/management')
  }

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  }

  return (
    <>
      <div className={`h-screen bg-transparent backdrop-blur-sm border-white/20 flex flex-col rounded-r-2xl shadow-xl transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-72'
      }`}>
        <div className="p-6 border-b border-white/20 flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Masy-Net
            </h1>
          )}
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-white/20 transition text-white"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        {/* Menu */}
        <div className="flex-1 flex flex-col p-4 space-y-3 text-gray-200">
          <button 
            onClick={management} 
            className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-white/20 transition"
            title="Manage Employee"
          >
            <Users size={20} />
            {!isCollapsed && <span>Manage Employee</span>}
          </button>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-white/20">
          <button 
            onClick={handleLogoutClick} 
            className="flex items-center gap-3 w-full px-4 py-2 rounded-xl hover:bg-red-500/20 text-red-400 transition"
            title="Log Out"
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Log Out</span>}
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="relative bg-richBlack border border-white/20 rounded-2xl p-6 max-w-sm w-full shadow-2xl backdrop-blur-md">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/20 mb-4">
                <LogOut className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Logout Confirmation
              </h3>
              <p className="text-gray-400 mb-6">
                Are you sure want to Logout?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleCancelLogout}
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition"
                >
                  No
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;