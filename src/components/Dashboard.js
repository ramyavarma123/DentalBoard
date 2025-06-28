import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  Users, 
  FileText, 
  LogOut, 
  Menu, 
  X,
  Home
} from 'lucide-react';
import DashboardHome from './DashboardHome';
import PatientManagement from './PatientManagement';
import AppointmentManagement from './AppointmentManagement';
import CalendarView from './CalendarView';
import PatientView from './PatientView';
import DarkModeToggle from './DarkModeToggle';

const Dashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const adminMenuItems = [
    { id: 'home', name: 'Dashboard', icon: Home },
    { id: 'patients', name: 'Patients', icon: Users },
    { id: 'appointments', name: 'Appointments', icon: FileText },
    { id: 'calendar', name: 'Calendar', icon: Calendar },
  ];

  const patientMenuItems = [
    { id: 'home', name: 'My Dashboard', icon: Home },
    { id: 'appointments', name: 'My Appointments', icon: FileText },
  ];

  const menuItems = isAdmin() ? adminMenuItems : patientMenuItems;

  const renderContent = () => {
    if (!isAdmin() && activeTab === 'home') {
      return <PatientView />;
    }

    switch (activeTab) {
      case 'home':
        return <DashboardHome />;
      case 'patients':
        return isAdmin() ? <PatientManagement /> : <PatientView />;
      case 'appointments':
        return isAdmin() ? <AppointmentManagement /> : <PatientView />;
      case 'calendar':
        return isAdmin() ? <CalendarView /> : <PatientView />;
      default:
        return <DashboardHome />;
    }
  };

  return (
<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 lg:hidden z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 gradient-primary">
          <h1 className="text-white text-lg font-semibold">Dental Center</h1>
          <button
            className="text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="mt-8">
          <div className="px-6 mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium text-sm">
                  {user?.name?.charAt(0) || user?.email?.charAt(0)}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.name || user?.email}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center px-6 py-3 text-left text-sm font-medium transition-colors duration-150
                    ${activeTab === item.id 
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-600 dark:border-blue-400' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <Icon size={18} className="mr-3" />
                  {item.name}
                </button>
              );
            })}
          </div>

          <div className="absolute bottom-0 w-full p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Dark Mode</span>
              <DarkModeToggle />
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors duration-150"
            >
              <LogOut size={18} className="mr-3" />
              Sign Out
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:pl-0">
        {/* Mobile header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {menuItems.find(item => item.id === activeTab)?.name || 'Dashboard'}
            </h1>
            <DarkModeToggle />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
