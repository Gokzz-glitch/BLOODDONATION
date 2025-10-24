import React, { useState, FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';
import { BloodType } from '../types';

interface AuthModalProps {
  initialView: 'login' | 'signup';
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ initialView, onClose }) => {
  const [view, setView] = useState(initialView);
  const { login, signup } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [bloodType, setBloodType] = useState<BloodType>(BloodType.A_POSITIVE);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (view === 'login') {
      login(email, password);
    } else {
      signup(name, email, password, bloodType);
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
          <div className="flex border-b mb-6">
            <button onClick={() => setView('login')} className={`flex-1 py-2 font-semibold ${view === 'login' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500'}`}>Login</button>
            <button onClick={() => setView('signup')} className={`flex-1 py-2 font-semibold ${view === 'signup' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-500'}`}>Sign Up</button>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">{view === 'login' ? 'Welcome Back' : 'Create an Account'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {view === 'signup' && (
              <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
            )}
            <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
            {view === 'signup' && (
              <select value={bloodType} onChange={e => setBloodType(e.target.value as BloodType)} required className="w-full px-4 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-red-500">
                {Object.values(BloodType).map(bt => <option key={bt} value={bt}>{bt}</option>)}
              </select>
            )}
            <button type="submit" className="w-full bg-red-600 text-white py-3 rounded-md font-bold hover:bg-red-700 transition-colors">
              {view === 'login' ? 'Login' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
