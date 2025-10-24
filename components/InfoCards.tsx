import React from 'react';

// Fix: Replaced JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
const InfoCard: React.FC<{ icon: React.ReactElement; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div style={{ perspective: '1000px' }}>
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform-gpu hover:-translate-y-2 hover:[transform:rotateY(10deg)]">
      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100 text-red-600 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{children}</p>
    </div>
  </div>
);

const InfoCards: React.FC = () => {
  return (
    <section id="info-cards-section" className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">The Donation Process</h2>
          <p className="mt-2 text-lg text-gray-600">Simple, safe, and life-saving.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <InfoCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            title="Check Eligibility"
          >
            Find out if you're eligible to donate. Most healthy adults can. Ask our AI assistant for specific requirements!
          </InfoCard>
          <InfoCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
            title="Find a Location"
          >
            Use our chatbot to find the nearest blood donation centers and mobile drives based on your current location.
          </InfoCard>
          <InfoCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            title="Donate & Save Lives"
          >
            The entire process takes about an hour. Your donation can help accident victims, surgery patients, and many others.
          </InfoCard>
        </div>
      </div>
    </section>
  );
};

export default InfoCards;