import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {
  const { user, logout, openAuthModal, appointments, cancelAppointment } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCancelAppointment = (appointmentId: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      cancelAppointment(appointmentId);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <svg
              className="h-8 w-8 text-red-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h1 className="text-2xl font-bold text-gray-800">VitalFlow</h1>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2"
                >
                  <span className="font-semibold text-gray-700 hidden sm:block">Welcome, {user.name}!</span>
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0)}
                  </div>
                </button>
                {isMenuOpen && (
                   <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg py-1 z-30">
                     <div className="px-4 py-2 text-sm text-gray-700 font-bold border-b">My Appointments</div>
                     {appointments.length > 0 ? (
                        <div className="max-h-60 overflow-y-auto">
                          {appointments.map(app => (
                            <div key={app.id} className="px-4 py-3 hover:bg-gray-100">
                              <p className="text-sm font-semibold text-gray-800">{app.center.name}</p>
                              <p className="text-xs text-gray-500">{app.center.address}</p>
                              <p className="text-xs text-gray-600 mt-1">{app.date} at {app.time}</p>
                              <button 
                                onClick={() => handleCancelAppointment(app.id)}
                                className="text-xs text-red-500 hover:text-red-700 font-semibold mt-2"
                              >
                                Cancel
                              </button>
                            </div>
                          ))}
                        </div>
                     ) : (
                        <p className="px-4 py-3 text-sm text-gray-500">No upcoming appointments.</p>
                     )}
                     <div className="border-t">
                        <button
                          onClick={() => {
                            logout();
                            setIsMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                     </div>
                   </div>
                )}
              </div>
            ) : (
              <>
                <button 
                  onClick={() => openAuthModal('login')}
                  className="font-semibold text-gray-600 hover:text-red-600 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="px-4 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;