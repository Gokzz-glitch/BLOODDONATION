import React, { useState, FormEvent } from 'react';
import { BloodType, UrgentRequest } from '../types';

interface RequestBloodModalProps {
  onClose: () => void;
  onSubmit: (newRequest: Omit<UrgentRequest, 'id' | 'postedAt'>) => void;
}

const RequestBloodModal: React.FC<RequestBloodModalProps> = ({ onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [bloodType, setBloodType] = useState<BloodType>(BloodType.A_POSITIVE);
  
  const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      if (!name.trim() || !location.trim()) return;
      onSubmit({ name, location, bloodType });
      onClose();
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
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Submit an Urgent Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Hospital or Patient Name" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
            <input type="text" placeholder="City & State" value={location} onChange={e => setLocation(e.target.value)} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type Needed</label>
              <select value={bloodType} onChange={e => setBloodType(e.target.value as BloodType)} required className="w-full px-4 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-red-500">
                {Object.values(BloodType).map(bt => <option key={bt} value={bt}>{bt}</option>)}
              </select>
            </div>
            <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-md font-bold hover:bg-red-700 transition-colors">
              Submit Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestBloodModal;
