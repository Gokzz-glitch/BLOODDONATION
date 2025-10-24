import React, { useState, useEffect } from 'react';
import { UrgentRequest, BloodType } from '../types';
import { useAuth } from '../hooks/useAuth';
import RequestBloodModal from './RequestBloodModal';
import Toast from './Toast';

const initialRequests: UrgentRequest[] = [
  { id: '1', name: 'City General Hospital', bloodType: BloodType.O_NEGATIVE, location: 'Downtown, Metro City', postedAt: new Date(Date.now() - 3600 * 1000 * 2) },
  { id: '2', name: 'St. Jude\'s Clinic', bloodType: BloodType.A_POSITIVE, location: 'Uptown, Metro City', postedAt: new Date(Date.now() - 3600 * 1000 * 5) },
];

const timeSince = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
}

const UrgentRequests: React.FC = () => {
  const [requests, setRequests] = useState<UrgentRequest[]>(initialRequests);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: '', show: false });
  const { user, openAuthModal } = useAuth();

  const handleOpenModal = () => {
    if (user) {
      setIsModalOpen(true);
    } else {
      openAuthModal('login');
    }
  };
  
  const addRequest = (newRequest: Omit<UrgentRequest, 'id' | 'postedAt'>) => {
      const requestWithId: UrgentRequest = {
          ...newRequest,
          id: Date.now().toString(),
          postedAt: new Date(),
      };
      setRequests(prev => [requestWithId, ...prev]);

      // Simulate notification
      if(user && user.bloodType === newRequest.bloodType) {
          setToast({ message: `New request for your blood type (${newRequest.bloodType})!`, show: true });
      }
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => setToast({ message: '', show: false }), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  return (
    <>
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="text-center md:text-left mb-4 md:mb-0">
                <h2 className="text-3xl font-bold text-gray-900">Urgent Requests</h2>
                <p className="mt-2 text-lg text-gray-600">These are critical needs in your community. Can you help?</p>
            </div>
            <button 
                onClick={handleOpenModal}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transform hover:scale-105 transition-all duration-300"
            >
                Request Blood
            </button>
          </div>

          <div className="space-y-4">
            {requests.map(req => (
              <div key={req.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center mb-2 sm:mb-0">
                    <div className="w-12 h-12 flex-shrink-0 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-lg mr-4">{req.bloodType}</div>
                    <div>
                        <p className="font-bold text-gray-800">{req.name}</p>
                        <p className="text-sm text-gray-600">{req.location}</p>
                    </div>
                </div>
                <p className="text-sm text-gray-500 self-end sm:self-center">{timeSince(req.postedAt)}</p>
              </div>
            ))}
             {requests.length === 0 && (
                <div className="text-center py-10 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No urgent requests at the moment.</p>
                </div>
             )}
          </div>
        </div>
      </section>
      {isModalOpen && <RequestBloodModal onClose={() => setIsModalOpen(false)} onSubmit={addRequest} />}
      <Toast message={toast.message} show={toast.show} onClose={() => setToast({ ...toast, show: false })} />
    </>
  );
};

export default UrgentRequests;
