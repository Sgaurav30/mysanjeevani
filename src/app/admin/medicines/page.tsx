'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Medicine {
  _id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  mrp?: number;
  discount?: number;
  stock: number;
  description: string;
  rating?: number;
  reviews?: number;
  requiresPrescription?: boolean;
  isActive: boolean;
}

const CATEGORIES = ['All', 'Antibiotics', 'Pain Relief', 'Vitamins', 'Gastric', 'Cardiac', 'Diabetes', 'Allergy', 'Supplements', 'Ayurveda', 'Homeopathy'];

export default function AdminMedicines() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editMed, setEditMed] = useState<Medicine | null>(null);
  const [formData, setFormData] = useState({ name: '', brand: '', category: '', price: '', mrp: '', discount: '', stock: '', description: '', requiresPrescription: false });
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchMedicines = useCallback(async () => {
    try {
      setLoading(true);
      const q = new URLSearchParams({ limit: '100' });
      if (categoryFilter !== 'All') q.set('category', categoryFilter);
      if (searchTerm) q.set('search', searchTerm);
      const res = await fetch(`/api/products?${q}`);
      const data = await res.json();
      setMedicines(data.products || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [categoryFilter, searchTerm]);

  useEffect(() => { fetchMedicines(); }, [fetchMedicines]);

  const seedMedicines = async () => {
    setSeeding(true);
    try {
      await fetch('/api/products/seed', { method: 'POST' });
      await fetchMedicines();
    } catch {}
    setSeeding(false);
  };

  const openAdd = () => {
    setEditMed(null);
    setFormData({ name: '', brand: '', category: '', price: '', mrp: '', discount: '', stock: '', description: '', requiresPrescription: false });
    setShowAddForm(true);
  };

  const openEdit = (med: Medicine) => {
    setEditMed(med);
    setFormData({ name: med.name, brand: med.brand || '', category: med.category, price: String(med.price), mrp: String(med.mrp || ''), discount: String(med.discount || ''), stock: String(med.stock), description: med.description || '', requiresPrescription: med.requiresPrescription || false });
    setShowAddForm(true);
  };

  const saveMedicine = async () => {
    if (!formData.name || !formData.category || !formData.price) { alert('Name, category and price are required.'); return; }
    setSaving(true);
    try {
      const payload = { name: formData.name, brand: formData.brand, category: formData.category, price: Number(formData.price), mrp: formData.mrp ? Number(formData.mrp) : undefined, discount: formData.discount ? Number(formData.discount) : undefined, stock: Number(formData.stock) || 0, description: formData.description, requiresPrescription: formData.requiresPrescription, isActive: true };
      if (editMed) {
        await fetch(`/api/admin/products/${editMed._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      } else {
        await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      }
      setShowAddForm(false);
      setEditMed(null);
      await fetchMedicines();
    } catch {}
    setSaving(false);
  };

  const deleteMedicine = async (id: string) => {
    if (!confirm('Delete this medicine?')) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    setMedicines((prev) => prev.filter((m) => m._id !== id));
  };

  const toggleActive = async (med: Medicine) => {
    await fetch(`/api/admin/products/${med._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !med.isActive }) });
    setMedicines((prev) => prev.map((m) => m._id === med._id ? { ...m, isActive: !m.isActive } : m));
  };

  const filtered = medicines.filter((m) => !searchTerm || m.name.toLowerCase().includes(searchTerm.toLowerCase()) || (m.brand || '').toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <Link href="/admin" className="text-blue-600 hover:text-blue-800 text-sm mb-3 inline-block">← Back to Dashboard</Link>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">💊 Manage Medicines</h1>
              <p className="text-gray-500 text-sm mt-1">{medicines.length} products in database</p>
            </div>
            <div className="flex gap-3">
              {medicines.length === 0 && (
                <button onClick={seedMedicines} disabled={seeding} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60">
                  {seeding ? 'Loading...' : '+ Seed Sample Medicines'}
                </button>
              )}
              <button onClick={openAdd} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold">
                + Add Medicine
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input type="text" placeholder="Search by name or brand..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <button onClick={fetchMedicines} className="bg-gray-700 text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-800">Search</button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Products', value: medicines.length, color: 'bg-blue-50 text-blue-700' },
            { label: 'Active', value: medicines.filter(m => m.isActive).length, color: 'bg-green-50 text-green-700' },
            { label: 'Rx Required', value: medicines.filter(m => m.requiresPrescription).length, color: 'bg-orange-50 text-orange-700' },
            { label: 'Low Stock (<20)', value: medicines.filter(m => m.stock < 20).length, color: 'bg-red-50 text-red-700' },
          ].map((s) => (
            <div key={s.label} className={`${s.color} rounded-xl p-4`}>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{editMed ? 'Edit Medicine' : 'Add New Medicine'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" placeholder="Medicine Name *" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
              <input type="text" placeholder="Brand" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="">Category *</option>
                {CATEGORIES.filter(c => c !== 'All').map((c) => <option key={c}>{c}</option>)}
              </select>
              <input type="number" placeholder="Price ₹ *" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
              <input type="number" placeholder="MRP ₹" value={formData.mrp} onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
              <input type="number" placeholder="Stock Qty" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
              <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="col-span-1 md:col-span-2 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" rows={2} />
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.requiresPrescription} onChange={(e) => setFormData({ ...formData, requiresPrescription: e.target.checked })} className="w-4 h-4 accent-green-600" />
                <span className="text-sm text-gray-700">Requires Prescription</span>
              </label>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={saveMedicine} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-60">
                {saving ? 'Saving...' : editMed ? 'Update Medicine' : 'Add Medicine'}
              </button>
              <button onClick={() => { setShowAddForm(false); setEditMed(null); }} className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading medicines...</div>
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Name & Brand', 'Category', 'Price / MRP', 'Stock', 'Rx', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                      No medicines found.{medicines.length === 0 && ' Click "Seed Sample Medicines" to add sample data.'}
                    </td>
                  </tr>
                ) : (
                  filtered.map((med) => (
                    <tr key={med._id} className={`hover:bg-gray-50 ${!med.isActive ? 'opacity-50' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900 text-sm">{med.name}</div>
                        <div className="text-xs text-gray-500">{med.brand}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{med.category}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-semibold text-green-700">₹{med.price}</div>
                        {med.mrp && med.mrp > med.price && <div className="text-xs text-gray-400 line-through">₹{med.mrp}</div>}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={med.stock < 20 ? 'text-red-600 font-semibold' : 'text-gray-700'}>{med.stock}</span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {med.requiresPrescription ? <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs">Rx</span> : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleActive(med)} className={`text-xs px-2 py-1 rounded-full font-medium ${med.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {med.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-3">
                          <button onClick={() => openEdit(med)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                          <button onClick={() => deleteMedicine(med._id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

