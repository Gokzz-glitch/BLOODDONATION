import React, { useState, FormEvent } from 'react';
import { DonationCenter } from '../types';
import { useAuth } from '../hooks/useAuth';

interface AppointmentModalProps {
  center: DonationCenter;
  onClose: () => void;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({ center, onClose }) => {
  const { bookAppointment, user, openAuthModal } = useAuth();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      onClose(); // Close this modal first
      openAuthModal('login');
      return;
    }
    if (date && time) {
      bookAppointment(center, date, time);
      onClose();
    } else {
      alert('Please select a date and time.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center mb-2 text-gray-800">Book Appointment</h2>
          <p className="text-center text-gray-600 mb-6">at <span className="font-semibold">{center.name}</span></p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                min={new Date().toISOString().split('T')[0]} // Today onwards
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="time"
                id="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-md font-bold hover:bg-red-700 transition-colors">
              Confirm Appointment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
