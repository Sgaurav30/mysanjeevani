'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LabTestsPage() {
  const [tests] = useState([
    {
      id: 1,
      name: 'Full Body Checkup',
      price: 1499,
      homeCollection: true,
      reportTime: '24 hours',
      rating: 4.6,
      reviews: 523,
      icon: '🧪',
    },
    {
      id: 2,
      name: 'Blood Sugar Test',
      price: 299,
      homeCollection: true,
      reportTime: '12 hours',
      rating: 4.8,
      reviews: 892,
      icon: '🩸',
    },
    {
      id: 3,
      name: 'Thyroid Profile',
      price: 799,
      homeCollection: true,
      reportTime: '24 hours',
      rating: 4.7,
      reviews: 412,
      icon: '🧬',
    },
    {
      id: 4,
      name: 'Lipid Profile',
      price: 599,
      homeCollection: true,
      reportTime: '24 hours',
      rating: 4.5,
      reviews: 634,
      icon: '📊',
    },
    {
      id: 5,
      name: 'Liver Function Test',
      price: 699,
      homeCollection: true,
      reportTime: '24 hours',
      rating: 4.6,
      reviews: 345,
      icon: '🫘',
    },
    {
      id: 6,
      name: 'Kidney Function Test',
      price: 749,
      homeCollection: true,
      reportTime: '24 hours',
      rating: 4.7,
      reviews: 289,
      icon: '🫘',
    },
  ]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <div className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Book Lab Tests at Home
            </h1>
            <p className="text-gray-600">
              Get tested from the comfort of your home with free sample collection
            </p>
          </div>

          {/* Test Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[
              { icon: '🏠', title: 'Home Collection', desc: 'Free sample pickup' },
              { icon: '⚡', title: 'Quick Reports', desc: '24-48 hours' },
              { icon: '💯', title: 'Accurate', desc: 'ISO certified labs' },
              { icon: '🔒', title: 'Secure', desc: 'Data privacy' },
            ].map((benefit, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl mb-2">{benefit.icon}</div>
                <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>

          {/* Tests Grid */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Tests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => (
              <div
                key={test.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                <div className="bg-gradient-to-b from-emerald-50 to-gray-50 p-8 text-center text-5xl">
                  {test.icon}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{test.name}</h3>

                  {/* Report Time */}
                  <p className="text-sm text-gray-600 mb-2">
                    Report in {test.reportTime}
                  </p>

                  {/* Home Collection Badge */}
                  {test.homeCollection && (
                    <span className="inline-block bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded mb-3">
                      Free Home Collection
                    </span>
                  )}

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-1 text-yellow-400">
                      {'★'.repeat(Math.floor(test.rating))}
                      {'☆'.repeat(5 - Math.floor(test.rating))}
                    </div>
                    <span className="text-xs text-gray-600">({test.reviews})</span>
                  </div>

                  {/* Price and Button */}
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-emerald-600">
                      ₹{test.price}
                    </span>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-sm transition">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
