'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const DEPARTMENTS = [
  'All',
  'General Medicine',
  'Cardiology',
  'Dermatology',
  'Pediatrics',
  'Orthopedics',
  'Neurology',
  'Gynecology',
  'ENT',
  'Ophthalmology',
  'Psychiatry',
  'Oncology',
  'Urology',
  'Gastroenterology',
  'Endocrinology',
  'Pulmonology',
];

interface TimeSlot {
  _id: string;
  day: string;
  startTime: string;
  endTime: string;
  maxPatients: number;
  isActive: boolean;
}

interface Doctor {
  _id: string;
  name: string;
  department: string;
  specialization: string;
  experience: number;
  qualification: string;
  consultationFee: number;
  rating: number;
  totalReviews: number;
  timeSlots: TimeSlot[];
  isAvailable: boolean;
  avatar: string;
  bio: string;
}

interface Consultation {
  _id: string;
  doctorName: string;
  doctorDepartment: string;
  doctorSpecialization: string;
  appointmentDate: string;
  preferredTimeSlot: string;
  allottedTime: string;
  consultationType: string;
  queueNumber: number;
  patientsAhead: number;
  status: string;
  fees: number;
  symptoms: string;
  notes: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  'in-progress': 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function DoctorConsultationPage() {
  const [activeTab, setActiveTab] = useState<'find' | 'mine'>('find');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingConsultations, setLoadingConsultations] = useState(false);
  const [selectedDept, setSelectedDept] = useState('All');
  const [search, setSearch] = useState('');
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<Consultation | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    appointmentDate: '',
    preferredTimeSlot: '',
    consultationType: 'in-person',
    symptoms: '',
  });

  const getUserData = () => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const fetchDoctors = useCallback(async () => {
    setLoadingDoctors(true);
    try {
      const params = new URLSearchParams();
      if (selectedDept !== 'All') params.set('department', selectedDept);
      if (search) params.set('search', search);
      const res = await fetch(`/api/doctors?${params}`);
      const data = await res.json();
      setDoctors(data.doctors || []);
    } catch {
      setDoctors([]);
    } finally {
      setLoadingDoctors(false);
    }
  }, [selectedDept, search]);

  const fetchConsultations = useCallback(async () => {
    const user = getUserData();
    if (!user?._id) return;
    setLoadingConsultations(true);
    try {
      const res = await fetch(`/api/consultations?userId=${user._id}`);
      const data = await res.json();
      setConsultations(data.consultations || []);
    } catch {
      setConsultations([]);
    } finally {
      setLoadingConsultations(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  useEffect(() => {
    if (activeTab === 'mine') fetchConsultations();
  }, [activeTab, fetchConsultations]);

  const openBooking = (doctor: Doctor) => {
    const user = getUserData();
    setBookingDoctor(doctor);
    setForm({
      patientName: user?.fullName || '',
      patientPhone: user?.phone || '',
      patientEmail: user?.email || '',
      appointmentDate: '',
      preferredTimeSlot: '',
      consultationType: 'in-person',
      symptoms: '',
    });
    setError('');
    setShowBookingModal(true);
  };

  const handleBook = async () => {
    const user = getUserData();
    if (!user) { setError('Please log in to book a consultation.'); return; }
    if (!form.patientName || !form.appointmentDate) { setError('Please fill in all required fields.'); return; }
    if (!bookingDoctor) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, doctorId: bookingDoctor._id, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Booking failed');
      setBookingSuccess(data.consultation);
      setShowBookingModal(false);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const cancelConsultation = async (id: string) => {
    if (!confirm('Cancel this consultation?')) return;
    try {
      await fetch(`/api/consultations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      fetchConsultations();
    } catch {}
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Book a Doctor Consultation</h1>
          <p className="text-emerald-100 text-lg">
            Choose from verified doctors across specializations. See your queue position instantly.
          </p>
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setActiveTab('find')}
              className={`px-6 py-2 rounded-full font-medium transition ${
                activeTab === 'find' ? 'bg-white text-emerald-700' : 'bg-emerald-700 text-white hover:bg-emerald-800'
              }`}
            >
              Find Doctors
            </button>
            <button
              onClick={() => setActiveTab('mine')}
              className={`px-6 py-2 rounded-full font-medium transition ${
                activeTab === 'mine' ? 'bg-white text-emerald-700' : 'bg-emerald-700 text-white hover:bg-emerald-800'
              }`}
            >
              My Consultations
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 py-10 w-full">

        {/* Booking success banner */}
        {bookingSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-5 flex items-start justify-between gap-4">
            <div>
              <h3 className="font-bold text-green-800 text-lg mb-1">✅ Consultation Booked!</h3>
              <p className="text-green-700">
                <strong>Doctor:</strong> {bookingSuccess.doctorName} &nbsp;|&nbsp;
                <strong>Date:</strong> {new Date(bookingSuccess.appointmentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
              <p className="text-green-700 mt-1">
                <strong>Your Token:</strong>{' '}
                <span className="text-2xl font-bold text-emerald-700">#{bookingSuccess.queueNumber}</span>
                &nbsp;—&nbsp;
                {bookingSuccess.patientsAhead === 0 ? "You're first in queue!" : `${bookingSuccess.patientsAhead} patient(s) ahead of you`}
              </p>
              <p className="text-sm text-green-600 mt-1">Admin will confirm your exact time slot shortly.</p>
            </div>
            <button onClick={() => setBookingSuccess(null)} className="text-green-500 hover:text-green-700 text-xl">✕</button>
          </div>
        )}

        {/* FIND DOCTORS TAB */}
        {activeTab === 'find' && (
          <>
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <input
                type="text"
                placeholder="Search by name, specialization, department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchDoctors()}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button
                onClick={fetchDoctors}
                className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 font-medium transition"
              >
                Search
              </button>
            </div>

            {/* Department pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                    selectedDept === dept
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-emerald-400'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            {loadingDoctors ? (
              <div className="text-center py-20 text-gray-500">Loading doctors...</div>
            ) : doctors.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <div className="text-6xl mb-4">👨‍⚕️</div>
                <p className="text-lg font-medium">No doctors found</p>
                <p className="text-sm">Try a different department or check back later</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                  <div key={doctor._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition">
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 flex items-center gap-4">
                      <div className="text-5xl">{doctor.avatar || '👨‍⚕️'}</div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{doctor.name}</h3>
                        <p className="text-emerald-700 text-sm font-medium">{doctor.specialization}</p>
                        <span className="inline-block bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full mt-1">
                          {doctor.department}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      {doctor.qualification && (
                        <p className="text-xs text-gray-500 mb-2">🎓 {doctor.qualification}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span>🏥 {doctor.experience} yrs exp</span>
                        <span>⭐ {doctor.rating > 0 ? doctor.rating.toFixed(1) : 'New'}
                          {doctor.totalReviews > 0 && <span className="text-xs text-gray-400 ml-1">({doctor.totalReviews})</span>}
                        </span>
                      </div>
                      {doctor.timeSlots?.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 mb-1 font-medium">Available Days:</p>
                          <div className="flex flex-wrap gap-1">
                            {doctor.timeSlots.filter((s) => s.isActive).slice(0, 3).map((slot) => (
                              <span key={slot._id} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded">
                                {slot.day.slice(0, 3)}: {slot.startTime}–{slot.endTime}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {doctor.bio && <p className="text-xs text-gray-500 mb-3 line-clamp-2">{doctor.bio}</p>}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-bold text-gray-900">₹{doctor.consultationFee}</span>
                          <span className="text-xs text-gray-400 ml-1">/ consult</span>
                        </div>
                        {doctor.isAvailable ? (
                          <button
                            onClick={() => openBooking(doctor)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
                          >
                            Book Now
                          </button>
                        ) : (
                          <span className="text-red-500 text-sm font-medium">Unavailable</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* MY CONSULTATIONS TAB */}
        {activeTab === 'mine' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Consultations</h2>
              <button
                onClick={fetchConsultations}
                className="text-emerald-600 text-sm font-medium border border-emerald-300 px-4 py-2 rounded-lg hover:bg-emerald-50"
              >
                ↻ Refresh
              </button>
            </div>

            {loadingConsultations ? (
              <div className="text-center py-20 text-gray-500">Loading...</div>
            ) : consultations.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-lg font-medium">No consultations yet</p>
                <button
                  onClick={() => setActiveTab('find')}
                  className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
                >
                  Book Your First Consultation
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {consultations.map((c) => (
                  <div key={c._id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-bold text-gray-900 text-lg">{c.doctorName}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[c.status] || 'bg-gray-100 text-gray-600'}`}>
                            {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-emerald-700 font-medium mb-1">{c.doctorSpecialization} · {c.doctorDepartment}</p>
                        <p className="text-sm text-gray-600">
                          📅 {new Date(c.appointmentDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                          {c.preferredTimeSlot && <span> · ⏰ {c.preferredTimeSlot}</span>}
                        </p>
                        {c.allottedTime && (
                          <p className="text-sm text-blue-700 font-medium mt-1">✅ Confirmed time: <strong>{c.allottedTime}</strong></p>
                        )}
                        {c.symptoms && <p className="text-sm text-gray-500 mt-1">Symptoms: {c.symptoms}</p>}
                        {c.notes && (
                          <p className="text-sm text-gray-600 mt-2 bg-gray-50 rounded px-3 py-2">📝 {c.notes}</p>
                        )}
                      </div>

                      {['pending', 'confirmed'].includes(c.status) && (
                        <div className="flex-shrink-0 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 text-center min-w-[140px]">
                          <p className="text-xs text-gray-500 mb-1">Your Token No.</p>
                          <p className="text-4xl font-extrabold text-emerald-700">#{c.queueNumber}</p>
                          <p className="text-xs text-gray-600 mt-1 font-medium">
                            {c.patientsAhead === 0 ? "🎉 You're first!" : `${c.patientsAhead} patient(s) ahead`}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">Fees: ₹{c.fees}</p>
                        </div>
                      )}

                      {c.status === 'completed' && (
                        <div className="flex-shrink-0 bg-green-50 border border-green-200 rounded-xl p-4 text-center min-w-[110px]">
                          <p className="text-3xl">✅</p>
                          <p className="text-sm font-medium text-green-700 mt-1">Completed</p>
                          <p className="text-xs text-gray-400">₹{c.fees}</p>
                        </div>
                      )}
                    </div>

                    {['pending', 'confirmed'].includes(c.status) && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => cancelConsultation(c._id)}
                          className="text-red-500 hover:text-red-700 text-sm border border-red-200 px-4 py-1.5 rounded-lg hover:bg-red-50 transition"
                        >
                          Cancel Consultation
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* BOOKING MODAL */}
      {showBookingModal && bookingDoctor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">Book Consultation</h2>
                  <p className="text-emerald-100 text-sm mt-1">{bookingDoctor.name} · {bookingDoctor.specialization}</p>
                </div>
                <button onClick={() => setShowBookingModal(false)} className="text-white/80 hover:text-white text-2xl">✕</button>
              </div>
              <div className="flex items-center gap-4 mt-4 bg-white/10 rounded-lg p-3">
                <div className="text-3xl">{bookingDoctor.avatar || '👨‍⚕️'}</div>
                <div>
                  <p className="font-semibold">{bookingDoctor.name}</p>
                  <p className="text-emerald-100 text-xs">{bookingDoctor.department}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xl font-bold">₹{bookingDoctor.consultationFee}</p>
                  <p className="text-emerald-200 text-xs">consultation fee</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2">{error}</div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name *</label>
                <input
                  type="text"
                  value={form.patientName}
                  onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="Full name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={form.patientPhone}
                    onChange={(e) => setForm({ ...form, patientPhone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.patientEmail}
                    onChange={(e) => setForm({ ...form, patientEmail: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Date *</label>
                <input
                  type="date"
                  min={todayStr}
                  value={form.appointmentDate}
                  onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              {bookingDoctor.timeSlots?.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time Window</label>
                  <div className="grid grid-cols-2 gap-2">
                    {bookingDoctor.timeSlots.filter((s) => s.isActive).map((slot) => (
                      <button
                        key={slot._id}
                        type="button"
                        onClick={() => setForm({ ...form, preferredTimeSlot: `${slot.startTime} - ${slot.endTime}` })}
                        className={`text-sm border rounded-lg px-3 py-2 transition ${
                          form.preferredTimeSlot === `${slot.startTime} - ${slot.endTime}`
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-gray-200 hover:border-emerald-300'
                        }`}
                      >
                        {slot.day}: {slot.startTime}–{slot.endTime}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Type</label>
                <select
                  value={form.consultationType}
                  onChange={(e) => setForm({ ...form, consultationType: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  <option value="in-person">In-Person Visit</option>
                  <option value="video">Video Call</option>
                  <option value="audio">Audio Call</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Symptoms / Reason</label>
                <textarea
                  rows={3}
                  value={form.symptoms}
                  onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                  placeholder="Briefly describe your symptoms..."
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
                ℹ️ Admin will confirm your exact time slot. Your queue number is assigned instantly upon booking.
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2.5 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBook}
                  disabled={submitting}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2.5 font-medium transition disabled:opacity-60"
                >
                  {submitting ? 'Booking...' : `Confirm (₹${bookingDoctor.consultationFee})`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

