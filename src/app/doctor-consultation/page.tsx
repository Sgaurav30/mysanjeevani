'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function DoctorConsultationPage() {
  const [doctors] = useState([
    {
      id: 1,
      name: 'Dr. Rajesh Kumar',
      specialization: 'General Physician',
      experience: '15 years',
      fees: 299,
      rating: 4.8,
      reviews: 245,
      nextAvailable: 'Today 3 PM',
      image: '👨‍⚕️',
    },
    {
      id: 2,
      name: 'Dr. Priya Sharma',
      specialization: 'Cardiologist',
      experience: '12 years',
      fees: 499,
      rating: 4.9,
      reviews: 187,
      nextAvailable: 'Today 4 PM',
      image: '👩‍⚕️',
    },
    {
      id: 3,
      name: 'Dr. Amit Singh',
      specialization: 'Dermatologist',
      experience: '10 years',
      fees: 349,
      rating: 4.7,
      reviews: 312,
      nextAvailable: 'Tomorrow 10 AM',
      image: '👨‍⚕️',
    },
    {
      id: 4,
      name: 'Dr. Neha Patel',
      specialization: 'Pediatrician',
      experience: '8 years',
      fees: 299,
      rating: 4.9,
      reviews: 421,
      nextAvailable: 'Today 5 PM',
      image: '👩‍⚕️',
    },
  ]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <div className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Consult Top Doctors Online
            </h1>
            <p className="text-gray-600">
              Get medical advice from qualified doctors without leaving your home
            </p>
          </div>

          {/* Consultation Types */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { icon: '📹', type: 'Video Call', time: '15 min' },
              { icon: '☎️', type: 'Audio Call', time: '10 min' },
              { icon: '💬', type: 'Chat', time: 'Unlimited' },
            ].map((con) => (
              <div
                key={con.type}
                className="border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition"
              >
                <div className="text-4xl mb-3">{con.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{con.type}</h3>
                <p className="text-sm text-gray-600">{con.time} session</p>
              </div>
            ))}
          </div>

          {/* Doctors List */}
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Doctors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
              >
                {/* Doctor Image */}
                <div className="bg-gradient-to-b from-emerald-50 to-gray-50 p-8 text-center text-5xl">
                  {doctor.image}
                </div>

                {/* Doctor Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {doctor.specialization}
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    {doctor.experience} experience
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex gap-1 text-yellow-400">
                      {'★'.repeat(Math.floor(doctor.rating))}
                      {'☆'.repeat(5 - Math.floor(doctor.rating))}
                    </div>
                    <span className="text-xs text-gray-600">
                      ({doctor.reviews})
                    </span>
                  </div>

                  {/* Next Available */}
                  <p className="text-sm text-emerald-600 font-medium mb-3">
                    {doctor.nextAvailable}
                  </p>

                  {/* Fees and Button */}
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                      ₹{doctor.fees}
                    </span>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-sm transition">
                      Consult
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
