'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminConsultations() {
  const [consultations, setConsultations] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = () => {
    try {
      const consultationsStr = localStorage.getItem('consultations') || '[]';
      const consultationsList = JSON.parse(consultationsStr);
      setConsultations(consultationsList);
    } catch (error) {
      console.error('Error fetching consultations:', error);
    }
    setLoading(false);
  };

  const updateConsultationStatus = (consultationId: string, newStatus: string) => {
    const updatedConsultations = consultations.map(c =>
      c.id === consultationId ? { ...c, status: newStatus } : c
    );
    localStorage.setItem('consultations', JSON.stringify(updatedConsultations));
    setConsultations(updatedConsultations);
  };

  const deleteConsultation = (consultationId: string) => {
    if (confirm('Are you sure you want to delete this consultation?')) {
      const updatedConsultations = consultations.filter(c => c.id !== consultationId);
      localStorage.setItem('consultations', JSON.stringify(updatedConsultations));
      setConsultations(updatedConsultations);
    }
  };

  let filteredConsultations = consultations.filter(consultation =>
    (consultation.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consultation.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (filterStatus !== 'all') {
    filteredConsultations = filteredConsultations.filter(c => c.status === filterStatus);
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const pendingCount = consultations.filter(c => c.status === 'pending').length;
  const completedCount = consultations.filter(c => c.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/admin" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Manage Consultations</h1>
          <div className="flex gap-6 mt-2 text-sm">
            <p className="text-gray-600">Total: {consultations.length}</p>
            <p className="text-orange-600 font-medium">Pending: {pendingCount}</p>
            <p className="text-green-600 font-medium">Completed: {completedCount}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <input
            type="text"
            placeholder="Search by patient or doctor name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Consultations Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredConsultations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No consultations found
                  </td>
                </tr>
              ) : (
                filteredConsultations.map((consultation) => (
                  <tr key={consultation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {consultation.patientName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {consultation.doctorName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {consultation.type || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {consultation.date || new Date().toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={consultation.status || 'pending'}
                        onChange={(e) => updateConsultationStatus(consultation.id, e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => deleteConsultation(consultation.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
