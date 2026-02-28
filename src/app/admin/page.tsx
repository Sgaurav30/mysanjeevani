'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalMedicines: 0,
    totalConsultations: 0,
    totalRevenue: 0,
    totalOrders: 0,
    pendingConsultations: 0,
    activeVendors: 0,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch stats from API or localStorage
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        // Fallback to localStorage
        const usersStr = localStorage.getItem('users') || '[]';
        const users = JSON.parse(usersStr);

        const vendorsStr = localStorage.getItem('vendors') || '[]';
        const vendors = JSON.parse(vendorsStr);

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
        const activeVendors = vendors.filter((v: any) => v.status === 'verified').length;

        setStats({
          totalUsers: users.length,
          totalVendors: vendors.length,
          totalMedicines: medicines.length,
          totalConsultations: consultations.length,
          totalRevenue,
          totalOrders: orders.length,
          pendingConsultations,
          activeVendors,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-2">Welcome to MySanjeevani Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-blue-100 text-sm font-medium">Total Users</h3>
            <span className="text-3xl">👥</span>
          </div>
          <p className="text-4xl font-bold">{stats.totalUsers}</p>
          <Link href="/admin/users" className="text-blue-100 hover:text-white text-sm mt-4 inline-block">
            View All →
          </Link>
        </div>

        {/* Total Vendors */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-emerald-100 text-sm font-medium">Total Vendors</h3>
            <span className="text-3xl">🏪</span>
          </div>
          <p className="text-4xl font-bold">{stats.totalVendors}</p>
          <p className="text-emerald-100 text-xs mt-1">{stats.activeVendors} verified</p>
          <Link href="/admin/vendors" className="text-emerald-100 hover:text-white text-sm mt-4 inline-block">
            Manage Vendors →
          </Link>
        </div>

        {/* Total Medicines */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-green-100 text-sm font-medium">Total Medicines</h3>
            <span className="text-3xl">💊</span>
          </div>
          <p className="text-4xl font-bold">{stats.totalMedicines}</p>
          <Link href="/admin/medicines" className="text-green-100 hover:text-white text-sm mt-4 inline-block">
            Manage Medicines →
          </Link>
        </div>

        {/* Total Orders */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-orange-100 text-sm font-medium">Total Orders</h3>
            <span className="text-3xl">📦</span>
          </div>
          <p className="text-4xl font-bold">{stats.totalOrders}</p>
          <Link href="/admin/orders" className="text-orange-100 hover:text-white text-sm mt-4 inline-block">
            View Orders →
          </Link>
        </div>
      </div>

      {/* Revenue & Consultations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-purple-100 text-sm font-medium">Total Revenue</h3>
            <span className="text-3xl">💰</span>
          </div>
          <p className="text-4xl font-bold">₹{stats.totalRevenue.toFixed(2)}</p>
          <p className="text-purple-100 text-xs mt-2">All time revenue</p>
          <Link href="/admin/analytics" className="text-purple-100 hover:text-white text-sm mt-4 inline-block">
            View Analytics →
          </Link>
        </div>

        {/* Consultations */}
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-pink-100 text-sm font-medium">Consultations</h3>
            <span className="text-3xl">👨‍⚕️</span>
          </div>
          <p className="text-4xl font-bold">{stats.totalConsultations}</p>
          <p className="text-pink-100 text-xs mt-1">{stats.pendingConsultations} pending</p>
          <Link href="/admin/consultations" className="text-pink-100 hover:text-white text-sm mt-4 inline-block">
            View Consultations →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/users"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition transform hover:scale-105"
          >
            👥 Manage Users
          </Link>
          <Link
            href="/admin/vendors"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition transform hover:scale-105"
          >
            🏪 Manage Vendors
          </Link>
          <Link
            href="/admin/medicines"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition transform hover:scale-105"
          >
            💊 Manage Medicines
          </Link>
          <Link
            href="/admin/analytics"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition transform hover:scale-105"
          >
            📊 Analytics
          </Link>
        </div>
      </div>
    </div>
  );
}
