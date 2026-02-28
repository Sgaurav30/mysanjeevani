'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: '📊' },
    { label: 'Users', href: '/admin/users', icon: '👥' },
    { label: 'Vendors', href: '/admin/vendors', icon: '🏪' },
    { label: 'Medicines', href: '/admin/medicines', icon: '💊' },
    { label: 'Consultations', href: '/admin/consultations', icon: '👨‍⚕️' },
    { label: 'Analytics', href: '/admin/analytics', icon: '📈' },
    { label: 'Orders', href: '/admin/orders', icon: '📦' },
    { label: 'Reports', href: '/admin/reports', icon: '📋' },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-indigo-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">MySanjeevani Admin</h1>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? 'block' : 'hidden'
        } lg:block fixed lg:static left-0 top-16 lg:top-0 w-64 h-[calc(100vh-64px)] lg:h-screen bg-indigo-700 text-white overflow-y-auto z-40`}
      >
        {/* Logo */}
        <div className="hidden lg:flex items-center justify-center h-20 bg-indigo-800 border-b border-indigo-600">
          <h1 className="text-2xl font-bold">MySanjeevani</h1>
        </div>

        {/* Menu Items */}
        <nav className="p-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition ${
                isActive(item.href)
                  ? 'bg-indigo-600 text-white'
                  : 'text-indigo-100 hover:bg-indigo-600'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-indigo-600">
          <button
            onClick={() => {
              localStorage.removeItem('adminToken');
              window.location.href = '/login';
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
