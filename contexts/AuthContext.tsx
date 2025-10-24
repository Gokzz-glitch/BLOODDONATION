import React, { createContext, useState, ReactNode } from 'react';
import { User, BloodType, Appointment, DonationCenter } from '../types';
import AuthModal from '../components/AuthModal';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  signup: (name: string, email: string, password: string, bloodType: BloodType) => void;
  logout: () => void;
  appointments: Appointment[];
  bookAppointment: (center: DonationCenter, date: string, time: string) => void;
  cancelAppointment: (appointmentId: string) => void;
  openAuthModal: (view: 'login' | 'signup') => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data
const MOCK_USER: User = { id: '1', name: 'Jane Doe', email: 'jane.doe@example.com', bloodType: BloodType.A_POSITIVE };
const MOCK_APPOINTMENTS: Appointment[] = [
  { id: 'app1', center: { id: 'dc1', name: 'Downtown Donation Center', address: '123 Main St', distance: '2 miles' }, date: '2024-08-15', time: '10:00 AM', userId: '1' }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'signup'>('login');

  const openAuthModal = (view: 'login' | 'signup') => {
    setAuthModalView(view);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };
  
  // Mock login/logout
  const login = (email: string, password: string) => {
    console.log('Logging in with', email, password);
    setUser(MOCK_USER);
    setAppointments(MOCK_APPOINTMENTS);
    closeAuthModal();
  };

  const signup = (name: string, email: string, password: string, bloodType: BloodType) => {
    console.log('Signing up with', name, email, password, bloodType);
    const newUser = { id: Date.now().toString(), name, email, bloodType };
    setUser(newUser);
    setAppointments([]);
    closeAuthModal();
  };

  const logout = () => {
    setUser(null);
    setAppointments([]);
  };

  const bookAppointment = (center: DonationCenter, date: string, time: string) => {
      if (user) {
          const newAppointment: Appointment = {
              id: Date.now().toString(),
              center,
              date,
              time,
              userId: user.id,
          };
          setAppointments(prev => [...prev, newAppointment]);
      }
  };

  const cancelAppointment = (appointmentId: string) => {
    setAppointments(prev => prev.filter(app => app.id !== appointmentId));
  };

  const value = {
    user,
    login,
    signup,
    logout,
    appointments,
    bookAppointment,
    cancelAppointment,
    openAuthModal,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {isAuthModalOpen && <AuthModal initialView={authModalView} onClose={closeAuthModal} />}
    </AuthContext.Provider>
  );
};
