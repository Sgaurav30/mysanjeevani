'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { LogoImage } from '@/components/Logo';

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="h-32 w-32">
                <LogoImage />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-2">
              MySanjeevani
            </h1>
            <p className="text-xl sm:text-2xl mb-6 opacity-95 font-semibold">
              Your Health, Our Priority
            </p>
            <p className="text-lg sm:text-xl mb-8 opacity-90">
              Order medicines online with home delivery. Consult doctors, book lab tests, and manage your health in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/medicines"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition"
              >
                Order Medicines
              </Link>
              <Link
                href="/signup"
                className="bg-white hover:bg-gray-100 text-emerald-600 px-8 py-3 rounded-lg font-semibold transition"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="bg-orange-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-orange-100 p-6 rounded-lg text-center">
              <p className="text-lg font-semibold text-orange-900">Get 20% OFF</p>
              <p className="text-gray-700">Use code: HEALTH20</p>
            </div>
            <div className="bg-orange-100 p-6 rounded-lg text-center">
              <p className="text-lg font-semibold text-orange-900">FREE Delivery</p>
              <p className="text-gray-700">On orders above ₹299</p>
            </div>
            <div className="bg-orange-100 p-6 rounded-lg text-center">
              <p className="text-lg font-semibold text-orange-900">24/7 Support</p>
              <p className="text-gray-700">24 hours customer care</p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Our Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: '💊', 
                title: 'Medicines', 
                desc: 'Order prescription & OTC medicines',
                link: '/medicines'
              },
              { 
                icon: '👨‍⚕️', 
                title: 'Doctor Consultation', 
                desc: 'Talk to health experts 24/7',
                link: '/doctor-consultation'
              },
              { 
                icon: '🧪', 
                title: 'Lab Tests', 
                desc: 'Book tests at home',
                link: '/lab-tests'
              },
              { 
                icon: '📰', 
                title: 'Health Articles', 
                desc: 'Read expert health tips',
                link: '/health-blog'
              },
              { 
                icon: '📋', 
                title: 'Prescriptions', 
                desc: 'Manage your prescriptions',
                link: '/profile'
              },
              { 
                icon: '🎁', 
                title: 'Special Offers', 
                desc: 'Get exclusive discounts',
                link: '/'
              },
            ].map((service, index) => (
              <a 
                key={index} 
                href={service.link}
                className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition cursor-pointer"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Why Choose MySanjeevani?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: '✓ Trusted by Millions', desc: 'Over 5 million users trust us for their health needs' },
              { title: '✓ Affordable Prices', desc: 'Get medicines at the best prices with instant discounts' },
              { title: '✓ Fast Delivery', desc: 'Get medicines delivered to your home in 30 minutes' },
              { title: '✓ Licensed Pharmacists', desc: 'All medicines verified by licensed pharmacists' },
            ].map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="text-2xl text-emerald-600">{item.title.split(' ')[0]}</div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{item.title.slice(2)}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Rajesh Kumar', text: 'Best app for ordering medicines! Very fast delivery.' },
              { name: 'Priya Sharma', text: 'Doctor consultation was helpful and affordable.' },
              { name: 'Amit Patel', text: 'Great service and excellent customer support.' },
            ].map((testimonial, index) => (
              <div key={index} className="border border-gray-200 p-6 rounded-lg">
                <p className="text-yellow-500 mb-3">★★★★★</p>
                <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                <p className="font-semibold text-gray-900">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-emerald-600 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="mb-6 opacity-90">Get health tips and exclusive offers delivered to your inbox</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded text-gray-900"
            />
            <button className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded font-semibold transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
