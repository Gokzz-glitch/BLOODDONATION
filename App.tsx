import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import InfoCards from './components/InfoCards';
import Chatbot from './components/Chatbot';
import UrgentRequests from './components/UrgentRequests';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header />
      <main>
        <Hero />
        <UrgentRequests />
        <InfoCards />
      </main>
      <Chatbot />
    </div>
  );
};

export default App;