'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminMedicines() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = () => {
    try {
      const medicinesStr = localStorage.getItem('medicines') || '[]';
      const medicinesList = JSON.parse(medicinesStr);
      setMedicines(medicinesList);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
    setLoading(false);
  };

  const handleAddMedicine = () => {
    if (!formData.name || !formData.category || !formData.price) {
      alert('Please fill all required fields');
      return;
    }

    const newMedicine = {
      id: Date.now().toString(),
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock) || 0,
      rating: 4.5,
      reviews: 0
    };

    const updatedMedicines = [...medicines, newMedicine];
    localStorage.setItem('medicines', JSON.stringify(updatedMedicines));
    setMedicines(updatedMedicines);
    setFormData({ name: '', category: '', price: '', stock: '', description: '' });
    setShowAddForm(false);
  };

  const deleteMedicine = (medicineId: string) => {
    if (confirm('Are you sure you want to delete this medicine?')) {
      const updatedMedicines = medicines.filter(m => m.id !== medicineId);
      localStorage.setItem('medicines', JSON.stringify(updatedMedicines));
      setMedicines(updatedMedicines);
    }
  };

  const filteredMedicines = medicines.filter(med =>
    med.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/admin" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Manage Medicines</h1>
          <p className="text-gray-600 mt-2">Total Medicines: {medicines.length}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Add Medicine Button */}
        <div className="mb-6 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search medicines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="ml-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-medium"
          >
            {showAddForm ? 'Cancel' : '+ Add Medicine'}
          </button>
        </div>

        {/* Add Medicine Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add New Medicine</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Medicine Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Category</option>
                <option value="Antibiotics">Antibiotics</option>
                <option value="Pain Relief">Pain Relief</option>
                <option value="Cold & Flu">Cold & Flu</option>
                <option value="Vitamins">Vitamins</option>
                <option value="Supplements">Supplements</option>
              </select>
              <input
                type="number"
                placeholder="Price (₹)"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="number"
                placeholder="Stock Quantity"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="col-span-1 md:col-span-2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
              />
            </div>
            <button
              onClick={handleAddMedicine}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-medium"
            >
              Add Medicine
            </button>
          </div>
        )}

        {/* Medicines Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMedicines.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No medicines found
                  </td>
                </tr>
              ) : (
                filteredMedicines.map((medicine) => (
                  <tr key={medicine.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {medicine.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {medicine.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      ₹{medicine.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className={medicine.stock > 10 ? 'text-green-600' : 'text-red-600'}>
                        {medicine.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      ⭐ {medicine.rating || 4.5}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => deleteMedicine(medicine.id)}
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
