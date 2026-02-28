'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';

const HEALTH_CONCERNS = [
  { icon: '🫀', label: 'Diabetes', href: '/medicines?category=Diabetes' },
  { icon: '❤️', label: 'Heart Care', href: '/medicines?category=Heart+Care' },
  { icon: '🧠', label: 'Mental Wellness', href: '/medicines?category=Mental+Wellness' },
  { icon: '🦴', label: 'Bone & Joint', href: '/medicines?category=Bone+%26+Joint' },
  { icon: '🌡️', label: 'Fever & Flu', href: '/medicines?category=Fever+%26+Flu' },
  { icon: '🤧', label: 'Allergy', href: '/medicines?category=Allergy' },
  { icon: '🫁', label: 'Respiratory', href: '/medicines?category=Respiratory' },
  { icon: '🦷', label: 'Oral Care', href: '/medicines?category=Oral+Care' },
  { icon: '👁️', label: 'Eye Care', href: '/medicines?category=Eye+Care' },
  { icon: '🧴', label: 'Skin Care', href: '/medicines?category=Skin+Care' },
  { icon: '💊', label: 'Vitamins', href: '/medicines?category=Vitamins' },
  { icon: '🩺', label: 'BP & Thyroid', href: '/medicines?category=BP+%26+Thyroid' },
];

const MEDICINES = [
  { name: 'Azithromycin 500mg', brand: 'Zithromax', price: 89, mrp: 120, category: 'Antibiotics', icon: '💊', discount: 26 },
  { name: 'Paracetamol 500mg', brand: 'Calpol', price: 18, mrp: 25, category: 'Pain Relief', icon: '💊', discount: 28 },
  { name: 'Pantoprazole 40mg', brand: 'Pan-D', price: 76, mrp: 95, category: 'Acidity', icon: '💊', discount: 20 },
  { name: 'Metformin 500mg', brand: 'Glycomet', price: 45, mrp: 60, category: 'Diabetes', icon: '💊', discount: 25 },
  { name: 'Cetirizine 10mg', brand: 'Zyrtec', price: 28, mrp: 38, category: 'Allergy', icon: '💊', discount: 26 },
  { name: 'Atorvastatin 10mg', brand: 'Lipitor', price: 95, mrp: 130, category: 'Heart Care', icon: '💊', discount: 27 },
  { name: 'Vitamin D3 60K', brand: 'D-Rise', price: 149, mrp: 195, category: 'Vitamins', icon: '🟡', discount: 24 },
  { name: 'Amoxicillin 250mg', brand: 'Mox', price: 65, mrp: 85, category: 'Antibiotics', icon: '💊', discount: 24 },
];

const LAB_TESTS = [
  { name: 'Full Body Checkup', tests: '72 Tests included', price: 999, mrp: 2499, icon: '🧪', popular: true },
  { name: 'Diabetes Screening', tests: 'HbA1c + Fasting Sugar', price: 399, mrp: 799, icon: '🩸', popular: true },
  { name: 'Thyroid Profile (T3,T4,TSH)', tests: '3 Tests', price: 349, mrp: 699, icon: '🧬', popular: false },
  { name: 'Lipid Profile', tests: 'Cholesterol Panel', price: 299, mrp: 599, icon: '💉', popular: false },
  { name: 'CBC + Differential', tests: 'Complete Blood Count', price: 199, mrp: 399, icon: '🔬', popular: true },
  { name: 'Liver Function Test', tests: '11 Tests', price: 449, mrp: 899, icon: '🫘', popular: false },
];

const AYURVEDA_PRODUCTS = [
  { name: 'Ashwagandha KSM-66', brand: 'Himalaya', price: 349, mrp: 450, benefit: 'Stress Relief', icon: '🌿' },
  { name: 'Triphala Churna', brand: 'Dabur', price: 129, mrp: 180, benefit: 'Digestion', icon: '🌱' },
  { name: 'Chyawanprash', brand: 'Baidyanath', price: 245, mrp: 320, benefit: 'Immunity', icon: '🍯' },
  { name: 'Shilajit Capsules', brand: 'Patanjali', price: 299, mrp: 399, benefit: 'Energy & Vitality', icon: '⚡' },
];

const HOMEOPATHY_PRODUCTS = [
  { name: 'Arnica Montana 30C', brand: 'SBL', price: 89, mrp: 110, benefit: 'Bruises & Pain', icon: '🌼' },
  { name: 'Nux Vomica 30C', brand: 'Dr. Reckeweg', price: 95, mrp: 125, benefit: 'Digestion & Acidity', icon: '🌸' },
  { name: 'Calcarea Carb 200C', brand: 'Boiron', price: 120, mrp: 160, benefit: 'Metabolism', icon: '💮' },
  { name: 'Rhus Tox 30C', brand: 'Masood', price: 79, mrp: 99, benefit: 'Joint Pain', icon: '🌺' },
];

export default function Home() {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* ── HERO BANNER ── */}
      <section className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <span className="bg-orange-400 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">
              INDIA&apos;S TRUSTED HEALTH PLATFORM
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
              Your Complete<br />Healthcare Partner
            </h1>
            <p className="text-emerald-100 text-lg mb-6">
              Medicines · Lab Tests · Doctor Consultations · Ayurveda · Homeopathy — all at your fingertips
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Link href="/medicines" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition text-center">
                Order Medicines
              </Link>
              <Link href="/doctor-consultation" className="bg-white hover:bg-gray-100 text-emerald-700 font-semibold px-6 py-3 rounded-xl transition text-center">
                Consult a Doctor
              </Link>
            </div>
            <div className="flex gap-6 text-sm text-emerald-100">
              <span>✓ 2 Crore+ customers</span>
              <span>✓ 5 Lakh+ products</span>
              <span>✓ Fast delivery</span>
            </div>
          </div>
          <div className="hidden md:flex flex-1 justify-center">
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
              {[
                { icon: '💊', label: 'Medicines', sub: 'Up to 25% off', href: '/medicines', color: 'from-blue-400 to-blue-500' },
                { icon: '🧪', label: 'Lab Tests', sub: 'Home collection', href: '/lab-tests', color: 'from-purple-400 to-purple-500' },
                { icon: '👨‍⚕️', label: 'Consult', sub: 'Verified doctors', href: '/doctor-consultation', color: 'from-pink-400 to-rose-500' },
                { icon: '🌿', label: 'Ayurveda', sub: '100% Authentic', href: '/ayurveda', color: 'from-teal-400 to-teal-500' },
              ].map((item) => (
                <Link key={item.label} href={item.href} className={`bg-gradient-to-br ${item.color} rounded-2xl p-4 text-white text-center hover:scale-105 transition-transform`}>
                  <div className="text-3xl mb-1">{item.icon}</div>
                  <p className="font-bold text-sm">{item.label}</p>
                  <p className="text-xs opacity-80">{item.sub}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── OFFER STRIP ── */}
      <div className="bg-orange-500 text-white py-2 overflow-hidden">
        <div className="flex gap-12 animate-pulse max-w-7xl mx-auto px-4 text-sm font-medium flex-wrap">
          <span>🎁 Use code HEALTH20 → 20% OFF on first order</span>
          <span>🚚 FREE delivery above ₹299</span>
          <span>🧪 Lab tests starting ₹199 | Home collection</span>
          <span>👨‍⚕️ Consult doctors starting ₹99</span>
        </div>
      </div>

      {/* ── QUICK SERVICE CARDS ── */}
      <section className="bg-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { icon: '💊', label: 'Medicines', href: '/medicines', bg: 'bg-blue-50 hover:bg-blue-100' },
              { icon: '🧪', label: 'Lab Tests', href: '/lab-tests', bg: 'bg-purple-50 hover:bg-purple-100' },
              { icon: '👨‍⚕️', label: 'Consult', href: '/doctor-consultation', bg: 'bg-rose-50 hover:bg-rose-100' },
              { icon: '🌿', label: 'Ayurveda', href: '/ayurveda', bg: 'bg-green-50 hover:bg-green-100' },
              { icon: '🌸', label: 'Homeopathy', href: '/homeopathy', bg: 'bg-pink-50 hover:bg-pink-100' },
              { icon: '🏥', label: 'Wellness', href: '/wellness', bg: 'bg-teal-50 hover:bg-teal-100' },
            ].map((s) => (
              <Link key={s.label} href={s.href} className={`${s.bg} rounded-xl p-4 text-center transition cursor-pointer`}>
                <div className="text-3xl mb-1">{s.icon}</div>
                <p className="text-xs font-semibold text-gray-700">{s.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHOP BY HEALTH CONCERN ── */}
      <section className="py-8 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Shop by Health Concern</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-3">
            {HEALTH_CONCERNS.map((c) => (
              <Link key={c.label} href={c.href} className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-emerald-50 transition group text-center">
                <span className="text-2xl">{c.icon}</span>
                <span className="text-xs text-gray-600 group-hover:text-emerald-700 font-medium leading-tight">{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEDICINES ── */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Popular Medicines</h2>
              <p className="text-sm text-gray-500">Best-selling medicines at discounted prices</p>
            </div>
            <Link href="/medicines" className="text-emerald-600 font-medium text-sm hover:underline">View all →</Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {MEDICINES.map((m) => (
              <div key={m.name} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{m.icon}</span>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">{m.discount}% OFF</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-0.5">{m.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{m.brand} · {m.category}</p>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">₹{m.price}</span>
                  <span className="text-xs text-gray-400 line-through">₹{m.mrp}</span>
                </div>
                <Link href="/medicines" className="w-full block text-center bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold py-1.5 rounded-lg mt-3 transition">
                  Add to Cart
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LAB TESTS ── */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Book Lab Tests</h2>
              <p className="text-sm text-gray-500">Free home sample collection · Reports in 24 hrs</p>
            </div>
            <Link href="/lab-tests" className="text-emerald-600 font-medium text-sm hover:underline">View all →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {LAB_TESTS.map((t) => (
              <div key={t.name} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{t.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 text-sm">{t.name}</h3>
                      {t.popular && <span className="bg-orange-100 text-orange-700 text-xs px-1.5 py-0.5 rounded font-medium">Popular</span>}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{t.tests}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-bold text-gray-900">₹{t.price}</span>
                      <span className="text-xs text-gray-400 line-through">₹{t.mrp}</span>
                      <span className="text-xs text-green-700 font-semibold">{Math.round((1 - t.price / t.mrp) * 100)}% off</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                      <span>🏠 Home collection available</span>
                    </div>
                  </div>
                </div>
                <Link href="/lab-tests" className="w-full block text-center border border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white text-xs font-semibold py-1.5 rounded-lg mt-3 transition">
                  Book Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DOCTOR CONSULTATION BANNER ── */}
      <section className="py-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Consult India&apos;s Best Doctors</h2>
              <p className="text-blue-100 mb-4">15+ specialities · Video, Audio & In-person · Queue number shown instantly</p>
              <div className="flex flex-wrap gap-3 text-sm">
                {['General Physician', 'Cardiologist', 'Dermatologist', 'Pediatrician', 'Gynecologist', 'Dentist'].map((s) => (
                  <span key={s} className="bg-white/20 px-3 py-1 rounded-full">{s}</span>
                ))}
              </div>
            </div>
            <div className="flex-shrink-0 flex gap-3">
              <Link href="/doctor-consultation" className="bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition">
                Book Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── AYURVEDA ── */}
      <section className="py-8 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">🌿 Ayurveda & Natural Products</h2>
              <p className="text-sm text-gray-500">Authentic herbal & ayurvedic wellness products</p>
            </div>
            <Link href="/ayurveda" className="text-emerald-600 font-medium text-sm hover:underline">View all →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {AYURVEDA_PRODUCTS.map((p) => (
              <div key={p.name} className="bg-white rounded-xl border border-amber-200 p-4 hover:shadow-md transition">
                <div className="text-3xl mb-2">{p.icon}</div>
                <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">{p.benefit}</span>
                <h3 className="font-semibold text-gray-900 text-sm mt-2 leading-tight">{p.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{p.brand}</p>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">₹{p.price}</span>
                  <span className="text-xs text-gray-400 line-through">₹{p.mrp}</span>
                </div>
                <Link href="/ayurveda" className="w-full block text-center bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold py-1.5 rounded-lg mt-3 transition">
                  Add to Cart
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOMEOPATHY ── */}
      <section className="py-8 bg-rose-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">🌸 Homeopathy</h2>
              <p className="text-sm text-gray-500">Trusted homeopathic remedies for every condition</p>
            </div>
            <Link href="/homeopathy" className="text-pink-600 font-medium text-sm hover:underline">View all →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {HOMEOPATHY_PRODUCTS.map((p) => (
              <div key={p.name} className="bg-white rounded-xl border border-rose-200 p-4 hover:shadow-md transition">
                <div className="text-3xl mb-2">{p.icon}</div>
                <span className="bg-pink-100 text-pink-700 text-xs font-medium px-2 py-0.5 rounded-full">{p.benefit}</span>
                <h3 className="font-semibold text-gray-900 text-sm mt-2 leading-tight">{p.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{p.brand}</p>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">₹{p.price}</span>
                  <span className="text-xs text-gray-400 line-through">₹{p.mrp}</span>
                </div>
                <Link href="/homeopathy" className="w-full block text-center bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold py-1.5 rounded-lg mt-3 transition">
                  Add to Cart
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROMO BANNERS ── */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-1">🎁 First Order Offer</h3>
            <p className="text-sm opacity-90 mb-3">Get flat 25% off on your first medicine order</p>
            <span className="bg-white/20 text-white text-sm font-bold px-3 py-1 rounded-full">FIRST25</span>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-1">🧪 Lab Test Offer</h3>
            <p className="text-sm opacity-90 mb-3">Up to 60% off on full body health checkups</p>
            <Link href="/lab-tests" className="bg-white/20 text-white text-sm font-bold px-3 py-1 rounded-full inline-block hover:bg-white/30">Book Now</Link>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-rose-500 text-white rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-1">👨‍⚕️ Free Consultation</h3>
            <p className="text-sm opacity-90 mb-3">First consultation free with selected doctors</p>
            <Link href="/doctor-consultation" className="bg-white/20 text-white text-sm font-bold px-3 py-1 rounded-full inline-block hover:bg-white/30">Consult Now</Link>
          </div>
        </div>
      </section>

      {/* ── WHY MYSANJEEVANI ── */}
      <section className="py-10 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Why MySanjeevani?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '✅', title: 'Genuine Products', desc: 'All medicines sourced from licensed distributors' },
              { icon: '🚚', title: 'Fast Delivery', desc: 'Express delivery in 2-4 hours in select cities' },
              { icon: '💰', title: 'Best Prices', desc: 'Save up to 25% vs MRP on all medicines' },
              { icon: '🔒', title: '100% Secure', desc: 'Safe & encrypted payment, easy returns' },
            ].map((f) => (
              <div key={f.title} className="text-center">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-10 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-5">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Rajesh K.', city: 'Mumbai', text: 'Medicines delivered in 2 hours! Great prices and genuine products. Highly recommend.', stars: 5 },
              { name: 'Priya S.', city: 'Delhi', text: 'Booked a lab test online, sample collected at home, report on WhatsApp next morning. Super convenient!', stars: 5 },
              { name: 'Amit P.', city: 'Bangalore', text: 'Doctor consultation was excellent. The queue number feature is really helpful — I knew exactly when my turn is.', stars: 5 },
            ].map((t) => (
              <div key={t.name} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <div className="flex text-yellow-400 text-sm mb-2">{'★'.repeat(t.stars)}</div>
                <p className="text-gray-700 text-sm mb-3 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold">{t.name[0]}</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="bg-emerald-600 text-white py-10">
        <div className="max-w-lg mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-2">Stay Healthy, Stay Updated</h2>
          <p className="text-emerald-100 mb-5">Get health tips and exclusive offers in your inbox</p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-3 rounded-lg transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

