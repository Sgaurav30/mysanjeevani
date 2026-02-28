'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      const ordersStr = localStorage.getItem('orders') || '[]';
      const ordersList = JSON.parse(ordersStr);
      setOrders(ordersList);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order._id?.includes(searchTerm) ||
          order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const updated = orders.map((order) =>
      order._id === orderId ? { ...order, status: newStatus } : order
    );
    localStorage.setItem('orders', JSON.stringify(updated));
    setOrders(updated);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-gray-600 mt-2">View and manage all customer orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Total Orders</p>
          <p className="text-4xl font-bold text-gray-900 mt-2">{orders.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Completed</p>
          <p className="text-4xl font-bold text-green-600 mt-2">
            {orders.filter((o) => o.status === 'completed').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Pending</p>
          <p className="text-4xl font-bold text-yellow-600 mt-2">
            {orders.filter((o) => o.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Cancelled</p>
          <p className="text-4xl font-bold text-red-600 mt-2">
            {orders.filter((o) => o.status === 'cancelled').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Search by order ID, customer email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="shipped">Shipped</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      #{order._id?.substring(0, 8)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>{order.customerName || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{order.customerEmail || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ₹{(order.total || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status || 'pending'}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${getStatusBadgeColor(
                          order.status || 'pending'
                        )}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="shipped">Shipped</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-indigo-600 hover:text-indigo-900 font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredOrders.length > 10 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700">
              Previous
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
