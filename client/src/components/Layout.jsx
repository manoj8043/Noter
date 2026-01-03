import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaStickyNote, FaTasks, FaCalendarAlt, FaHome, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/', icon: <FaHome />, label: 'Dashboard' },
    { path: '/notes', icon: <FaStickyNote />, label: 'Notes' },
    { path: '/tasks', icon: <FaTasks />, label: 'Tasks' },
    { path: '/calendar', icon: <FaCalendarAlt />, label: 'Calendar' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
            <FaStickyNote /> Noter
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-indigo-50 text-indigo-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
             <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">{user?.username}</span>
                <span className="text-xs text-gray-400">{user?.email}</span>
             </div>
             <button onClick={logout} className="text-gray-400 hover:text-red-500 transition-colors">
                <FaSignOutAlt />
             </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
