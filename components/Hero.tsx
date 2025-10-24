import React from 'react';
import BloodDrop3D from './BloodDrop3D';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-white overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-red-50 opacity-50"></div>
      </div>
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="max-w-3xl text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              Give the Gift of Life.
              <span className="block text-red-600">Donate Blood Today.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto md:mx-0">
              Your single donation can save up to three lives. Join a community of heroes and make a real difference. It's simple, safe, and profoundly rewarding.
            </p>
            <div className="mt-10">
              <a
                href="#info-cards-section"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('info-cards-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-block px-8 py-4 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700 transform hover:scale-105 transition-all duration-300"
              >
                Learn How to Donate
              </a>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center h-full">
            <BloodDrop3D />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;