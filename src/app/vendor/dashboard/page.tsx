'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Link from 'next/link';

interface VendorInfo {
  _id: string;
  vendorName: string;
  email: string;
  status: string;
  rating?: number;
  totalOrders?: number;
  commissionPercentage?: number;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  description?: string;
  image?: string;
}

export default function VendorDashboard() {
  const router = useRouter();
  const [vendorInfo, setVendorInfo] = useState<VendorInfo | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'generic',
    stock: '',
    image: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('vendorToken');
    const info = localStorage.getItem('vendorInfo');

    if (!token || !info) {
      router.push('/vendor/login');
      return;
    }

    setVendorInfo(JSON.parse(info));
    fetchProducts(JSON.parse(info)._id);
  }, [router]);

  const fetchProducts = async (vendorId: string) => {
    try {
      const response = await fetch(`/api/vendor/products?vendorId=${vendorId}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem('vendorToken');

    try {
      const response = await fetch('/api/vendor/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          vendorId: vendorInfo?._id,
          ...newProduct,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock),
        }),
      });

      if (!response.ok) throw new Error('Failed to add product');

      setNewProduct({
        name: '',
        description: '',
        price: '',
        category: 'generic',
        stock: '',
        image: '',
      });
      setShowAddProduct(false);
      if (vendorInfo) {
        fetchProducts(vendorInfo._id);
      }
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      alert('Error: ' + error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure?')) return;

    const token = localStorage.getItem('vendorToken');
    try {
      const response = await fetch(`/api/vendor/products?productId=${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete product');
      if (vendorInfo) {
        fetchProducts(vendorInfo._id);
      }
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : 'Unknown error';
      alert('Error: ' + error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('vendorToken');
    localStorage.removeItem('vendorInfo');
    router.push('/vendor/login');
  };

  if (!vendorInfo) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{vendorInfo.vendorName}</h1>
              <p className="text-gray-600 text-sm mt-1">
                Status: <span className="font-semibold text-emerald-600">{vendorInfo.status}</span>
              </p>
              {vendorInfo.status === 'verified' && (
                <p className="text-gray-600 text-sm">
                  Rating: ⭐ {vendorInfo.rating || 'Not rated yet'}
                </p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>

        {vendorInfo.status !== 'verified' && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg mb-8">
            ⚠️ Your account is {vendorInfo.status}. You cannot add products until your account is verified by admin.
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-300">
          <button
            onClick={() => setTab('overview')}
            className={`px-4 py-2 font-semibold ${
              tab === 'overview'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-600'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setTab('products')}
            className={`px-4 py-2 font-semibold ${
              tab === 'products'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-600'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setTab('orders')}
            className={`px-4 py-2 font-semibold ${
              tab === 'orders'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-600'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setTab('analytics')}
            className={`px-4 py-2 font-semibold ${
              tab === 'analytics'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-600'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Overview Tab */}
        {tab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-gray-500 text-sm font-semibold">Total Products</h3>
              <p className="text-3xl font-bold text-emerald-600 mt-2">{products.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-gray-500 text-sm font-semibold">Total Orders</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {vendorInfo.totalOrders || 0}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-gray-500 text-sm font-semibold">Rating</h3>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                ⭐ {vendorInfo.rating || 'N/A'}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-gray-500 text-sm font-semibold">Commission</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">{vendorInfo.commissionPercentage || 10}%</p>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {tab === 'products' && (
          <div>
            {vendorInfo.status === 'verified' && (
              <button
                onClick={() => setShowAddProduct(!showAddProduct)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg mb-6"
              >
                {showAddProduct ? 'Cancel' : '+ Add Product'}
              </button>
            )}

            {showAddProduct && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      required
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <select
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="generic">Generic</option>
                      <option value="branded">Branded</option>
                      <option value="ayurvedic">Ayurvedic</option>
                      <option value="homeopathy">Homeopathy</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Price"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      required
                      step="0.01"
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="number"
                      placeholder="Stock"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      required
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <textarea
                    placeholder="Description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    rows="3"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg"
                  >
                    Add Product
                  </button>
                </form>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {products.length === 0 ? (
                <p className="p-6 text-center text-gray-500">No products yet</p>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Product</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Stock</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4">{product.name}</td>
                        <td className="px-6 py-4">₹{product.price}</td>
                        <td className="px-6 py-4">{product.stock}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="text-red-600 hover:text-red-800 font-semibold"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-500 text-center">Orders feature coming soon</p>
          </div>
        )}

        {/* Analytics Tab */}
        {tab === 'analytics' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-500 text-center">Analytics feature coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}
