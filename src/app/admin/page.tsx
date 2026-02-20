'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMedicines: 0,
    totalConsultations: 0,
    totalRevenue: 0,
    totalOrders: 0,
    pendingConsultations: 0
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const user = localStorage.getItem('user');
      if (!user) {
        router.push('/login');
        return;
      }
      
      const userData = JSON.parse(user);
      // Check if user is admin (you can add a role field to User model later)
      // For now, we'll use email verification or a flag
      if (userData.email !== 'admin@mysanjeevani.com') {
        router.push('/');
        return;
      }
      
      setIsAdmin(true);
      fetchStats();
      setLoading(false);
    };
    
    checkAdmin();
  }, [router]);

  const fetchStats = async () => {
    try {
      // This would be API calls to get stats
      // For now, using mock data from localStorage
      const usersStr = localStorage.getItem('users') || '[]';
      const users = JSON.parse(usersStr);
      
      const medicinesStr = localStorage.getItem('medicines') || '[]';
      const medicines = JSON.parse(medicinesStr);
      
      const consultationsStr = localStorage.getItem('consultations') || '[]';
      const consultations = JSON.parse(consultationsStr);
      
      const ordersStr = localStorage.getItem('orders') || '[]';
      const orders = JSON.parse(ordersStr);

      let totalRevenue = 0;
      orders.forEach((order: any) => {
        if (order.total) totalRevenue += order.total;
      });

      const pendingConsultations = consultations.filter((c: any) => c.status === 'pending').length;

      setStats({
        totalUsers: users.length,
        totalMedicines: medicines.length,
        totalConsultations: consultations.length,
        totalRevenue,
        totalOrders: orders.length,
        pendingConsultations
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAdmin) {
    return <div className="flex items-center justify-center h-screen">Unauthorized</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to MySanjeevani Administration</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM16 16a5 5 0 10-10 0v2h10v-2z" />
                </svg>
              </div>
            </div>
            <Link href="/admin/users" className="text-blue-600 hover:text-blue-800 text-sm mt-4 inline-block font-medium">
              Manage Users →
            </Link>
          </div>

          {/* Total Medicines */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Medicines</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalMedicines}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
            </div>
            <Link href="/admin/medicines" className="text-green-600 hover:text-green-800 text-sm mt-4 inline-block font-medium">
              Manage Medicines →
            </Link>
          </div>

          {/* Total Consultations */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Consultations</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalConsultations}</p>
                <p className="text-red-600 text-xs mt-1">{stats.pendingConsultations} pending</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <Link href="/admin/consultations" className="text-purple-600 hover:text-purple-800 text-sm mt-4 inline-block font-medium">
              Manage Consultations →
            </Link>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">₹{stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <Link href="/admin/analytics" className="text-emerald-600 hover:text-emerald-800 text-sm mt-4 inline-block font-medium">
              View Analytics →
            </Link>
          </div>

          {/* Admin Tools */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Admin Tools</p>
                <p className="text-gray-900 font-semibold mt-2">Manage & Monitor</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/users" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition">
              Manage Users
            </Link>
            <Link href="/admin/medicines" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium transition">
              Manage Medicines
            </Link>
            <Link href="/admin/consultations" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-medium transition">
              Manage Consultations
            </Link>
            <Link href="/admin/analytics" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded font-medium transition">
              View Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
