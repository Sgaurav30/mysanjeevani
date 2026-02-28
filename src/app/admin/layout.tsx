'use client';

import AdminSidebar from '@/components/AdminSidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem('adminToken');
      const user = localStorage.getItem('user');

      if (!token && !user) {
        router.push('/login');
        return;
      }

      // Check if user has admin role
      if (user) {
        try {
          const userData = JSON.parse(user);
          // Check if user is admin (has admin role or is admin email)
          if (userData.role === 'admin' || userData.email === 'admin@mysanjeevani.com') {
            setIsAdmin(true);
          } else {
            router.push('/');
            return;
          }
        } catch (error) {
          router.push('/login');
          return;
        }
      }

      setLoading(false);
    };

    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600 font-semibold text-lg">Unauthorized Access</p>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white shadow h-16 flex items-center px-6">
          <h2 className="text-lg font-semibold text-gray-900">Administration Panel</h2>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
