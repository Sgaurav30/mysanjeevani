'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// ── Types ────────────────────────────────────────────────────────────────────
interface Medicine {
  _id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  mrp?: number;
  icon?: string;
  benefit?: string;
  stock: number;
  description: string;
  rating?: number;
  reviews?: number;
  requiresPrescription?: boolean;
  isActive: boolean;
}

interface LabTest {
  _id: string;
  name: string;
  category: string;
  price: number;
  mrp?: number;
  description?: string;
  icon?: string;
  duration?: string;
  testsIncluded?: string;
  popular?: boolean;
  isActive: boolean;
}

const PROD_CATEGORIES = ['Antibiotics', 'Pain Relief', 'Vitamins', 'Gastric', 'Cardiac', 'Diabetes', 'Allergy', 'Supplements', 'Acidity', 'Ayurveda', 'Homeopathy', 'Heart Care'];
const LAB_CATEGORIES = ['General Health', 'Diabetes', 'Thyroid', 'Heart Health', 'Kidney Health', 'Liver Health', 'Women Health', 'Immunity', 'Vitamins', 'Allergy'];

const EMPTY_PROD = { name: '', brand: '', category: '', price: '', mrp: '', stock: '', description: '', icon: '', benefit: '', requiresPrescription: false };
const EMPTY_LAB  = { name: '', category: '', price: '', mrp: '', description: '', icon: '', duration: '', testsIncluded: '', popular: false };

export default function AdminMedicines() {
  const [tab, setTab] = useState<'products' | 'labtests'>('products');

  // ── Products state ────────────────────────────────────────────────────────
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [medSearch, setMedSearch] = useState('');
  const [medCatFilter, setMedCatFilter] = useState('All');
  const [showProdForm, setShowProdForm] = useState(false);
  const [editMed, setEditMed] = useState<Medicine | null>(null);
  const [prodForm, setProdForm] = useState(EMPTY_PROD);
  const [medLoading, setMedLoading] = useState(true);
  const [medSaving, setMedSaving] = useState(false);

  // ── Lab Tests state ───────────────────────────────────────────────────────
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [labSearch, setLabSearch] = useState('');
  const [showLabForm, setShowLabForm] = useState(false);
  const [editLab, setEditLab] = useState<LabTest | null>(null);
  const [labForm, setLabForm] = useState(EMPTY_LAB);
  const [labLoading, setLabLoading] = useState(false);
  const [labSaving, setLabSaving] = useState(false);

  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState('');

  // ── Fetch products ────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setMedLoading(true);
    try {
      const q = new URLSearchParams({ limit: '200' });
      if (medCatFilter !== 'All') q.set('category', medCatFilter);
      if (medSearch) q.set('search', medSearch);
      const res = await fetch(`/api/products?${q}`);
      const data = await res.json();
      setMedicines(data.products || []);
    } catch {}
    setMedLoading(false);
  }, [medCatFilter, medSearch]);

  // ── Fetch lab tests ───────────────────────────────────────────────────────
  const fetchLabTests = useCallback(async () => {
    setLabLoading(true);
    try {
      const q = new URLSearchParams({ limit: '200' });
      if (labSearch) q.set('search', labSearch);
      const res = await fetch(`/api/lab-tests?${q}`);
      const data = await res.json();
      setLabTests(data.labTests || []);
    } catch {}
    setLabLoading(false);
  }, [labSearch]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { fetchLabTests(); }, [fetchLabTests]);

  // ── Seed ──────────────────────────────────────────────────────────────────
  const seedAll = async (force = false) => {
    setSeeding(true);
    setSeedMsg('');
    try {
      const res = await fetch(`/api/seed${force ? '?force=true' : ''}`, { method: 'POST' });
      const data = await res.json();
      if (data.seeded) setSeedMsg(`Seeded ${data.seeded.products} products + ${data.seeded.labTests} lab tests`);
      else setSeedMsg(data.message || 'Already seeded');
      await fetchProducts();
      await fetchLabTests();
    } catch { setSeedMsg('Seed failed'); }
    setSeeding(false);
  };

  // ── Product CRUD ──────────────────────────────────────────────────────────
  const openAddProd = () => { setEditMed(null); setProdForm(EMPTY_PROD); setShowProdForm(true); };
  const openEditProd = (m: Medicine) => {
    setEditMed(m);
    setProdForm({ name: m.name, brand: m.brand || '', category: m.category, price: String(m.price), mrp: String(m.mrp || ''), stock: String(m.stock), description: m.description || '', icon: m.icon || '', benefit: m.benefit || '', requiresPrescription: m.requiresPrescription || false });
    setShowProdForm(true);
  };
  const saveProd = async () => {
    if (!prodForm.name || !prodForm.category || !prodForm.price) { alert('Name, category and price are required.'); return; }
    setMedSaving(true);
    const payload = { name: prodForm.name, brand: prodForm.brand, category: prodForm.category, price: Number(prodForm.price), mrp: prodForm.mrp ? Number(prodForm.mrp) : undefined, stock: Number(prodForm.stock) || 0, description: prodForm.description, icon: prodForm.icon || undefined, benefit: prodForm.benefit || undefined, requiresPrescription: prodForm.requiresPrescription, isActive: true };
    try {
      if (editMed) await fetch(`/api/admin/products/${editMed._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      else await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      setShowProdForm(false); setEditMed(null); await fetchProducts();
    } catch {}
    setMedSaving(false);
  };
  const deleteProd = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    setMedicines((p) => p.filter((m) => m._id !== id));
  };
  const toggleProdActive = async (m: Medicine) => {
    await fetch(`/api/admin/products/${m._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !m.isActive }) });
    setMedicines((p) => p.map((x) => x._id === m._id ? { ...x, isActive: !x.isActive } : x));
  };

  // ── Lab Test CRUD ─────────────────────────────────────────────────────────
  const openAddLab = () => { setEditLab(null); setLabForm(EMPTY_LAB); setShowLabForm(true); };
  const openEditLab = (t: LabTest) => {
    setEditLab(t);
    setLabForm({ name: t.name, category: t.category, price: String(t.price), mrp: String(t.mrp || ''), description: t.description || '', icon: t.icon || '', duration: t.duration || '', testsIncluded: t.testsIncluded || '', popular: t.popular || false });
    setShowLabForm(true);
  };
  const saveLab = async () => {
    if (!labForm.name || !labForm.category || !labForm.price) { alert('Name, category and price are required.'); return; }
    setLabSaving(true);
    const payload = { name: labForm.name, category: labForm.category, price: Number(labForm.price), mrp: labForm.mrp ? Number(labForm.mrp) : undefined, description: labForm.description, icon: labForm.icon || undefined, duration: labForm.duration || undefined, testsIncluded: labForm.testsIncluded || undefined, popular: labForm.popular, isActive: true };
    try {
      if (editLab) await fetch(`/api/admin/lab-tests/${editLab._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      else await fetch('/api/lab-tests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      setShowLabForm(false); setEditLab(null); await fetchLabTests();
    } catch {}
    setLabSaving(false);
  };
  const deleteLab = async (id: string) => {
    if (!confirm('Delete this lab test?')) return;
    await fetch(`/api/admin/lab-tests/${id}`, { method: 'DELETE' });
    setLabTests((p) => p.filter((t) => t._id !== id));
  };
  const toggleLabActive = async (t: LabTest) => {
    await fetch(`/api/admin/lab-tests/${t._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !t.isActive }) });
    setLabTests((p) => p.map((x) => x._id === t._id ? { ...x, isActive: !x.isActive } : x));
  };

  const filteredMeds = medicines.filter((m) => !medSearch || m.name.toLowerCase().includes(medSearch.toLowerCase()) || (m.brand || '').toLowerCase().includes(medSearch.toLowerCase()));
  const filteredLabs = labTests.filter((t) => !labSearch || t.name.toLowerCase().includes(labSearch.toLowerCase()) || t.category.toLowerCase().includes(labSearch.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <Link href="/admin" className="text-blue-600 hover:text-blue-800 text-sm mb-3 inline-block">← Back to Dashboard</Link>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🏪 Manage Health Products</h1>
              <p className="text-gray-500 text-sm mt-1">{medicines.length} products · {labTests.length} lab tests</p>
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              {seedMsg && <span className="text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg">{seedMsg}</span>}
              <button onClick={() => seedAll(false)} disabled={seeding} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60">
                {seeding ? 'Seeding...' : '⚡ Seed Sample Data'}
              </button>
              <button onClick={() => seedAll(true)} disabled={seeding} className="border border-orange-500 text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60">
                ↺ Re-seed (Force)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex">
          <button onClick={() => setTab('products')} className={`px-6 py-4 font-semibold text-sm border-b-2 transition ${tab === 'products' ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
            💊 Products ({medicines.length})
          </button>
          <button onClick={() => setTab('labtests')} className={`px-6 py-4 font-semibold text-sm border-b-2 transition ${tab === 'labtests' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
            🧪 Lab Tests ({labTests.length})
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ── PRODUCTS TAB ───────────────────────────────────────── */}
        {tab === 'products' && (
          <>
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

            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <input className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" type="text" placeholder="Search name or brand..." value={medSearch} onChange={(e) => setMedSearch(e.target.value)} />
              <select value={medCatFilter} onChange={(e) => setMedCatFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="All">All Categories</option>
                {PROD_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <button onClick={openAddProd} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold">+ Add Product</button>
            </div>

            {showProdForm && (
              <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{editMed ? 'Edit Product' : 'Add New Product'}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" placeholder="Product Name *" value={prodForm.name} onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                  <input type="text" placeholder="Brand" value={prodForm.brand} onChange={(e) => setProdForm({ ...prodForm, brand: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                  <select value={prodForm.category} onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="">Category *</option>
                    {PROD_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <input type="number" placeholder="Price ₹ *" value={prodForm.price} onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                  <input type="number" placeholder="MRP ₹" value={prodForm.mrp} onChange={(e) => setProdForm({ ...prodForm, mrp: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                  <input type="number" placeholder="Stock Qty" value={prodForm.stock} onChange={(e) => setProdForm({ ...prodForm, stock: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                  <input type="text" placeholder="Icon emoji (e.g. 💊)" value={prodForm.icon} onChange={(e) => setProdForm({ ...prodForm, icon: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                  <input type="text" placeholder="Benefit tag (e.g. Immunity)" value={prodForm.benefit} onChange={(e) => setProdForm({ ...prodForm, benefit: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                  <textarea placeholder="Description" value={prodForm.description} onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" rows={2} />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={prodForm.requiresPrescription} onChange={(e) => setProdForm({ ...prodForm, requiresPrescription: e.target.checked })} className="w-4 h-4 accent-green-600" />
                    <span className="text-sm text-gray-700">Requires Prescription (Rx)</span>
                  </label>
                </div>
                <div className="flex gap-3 mt-5">
                  <button onClick={saveProd} disabled={medSaving} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-60">{medSaving ? 'Saving...' : editMed ? 'Update Product' : 'Add Product'}</button>
                  <button onClick={() => { setShowProdForm(false); setEditMed(null); }} className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-50">Cancel</button>
                </div>
              </div>
            )}

            {medLoading ? (
              <div className="text-center py-20 text-gray-400">Loading products...</div>
            ) : (
              <div className="bg-white rounded-xl shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>{['Icon', 'Name & Brand', 'Category', 'Price / MRP', 'Stock', 'Rx', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredMeds.length === 0 ? (
                      <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-400">No products found. Click "Seed Sample Data" to populate.</td></tr>
                    ) : filteredMeds.map((m) => (
                      <tr key={m._id} className={`hover:bg-gray-50 ${!m.isActive ? 'opacity-50' : ''}`}>
                        <td className="px-4 py-3 text-2xl">{m.icon || '💊'}</td>
                        <td className="px-4 py-3"><div className="font-medium text-gray-900 text-sm">{m.name}</div><div className="text-xs text-gray-500">{m.brand}</div></td>
                        <td className="px-4 py-3 text-sm text-gray-600">{m.category}</td>
                        <td className="px-4 py-3"><div className="text-sm font-semibold text-green-700">₹{m.price}</div>{m.mrp && m.mrp > m.price && <div className="text-xs text-gray-400 line-through">₹{m.mrp}</div>}</td>
                        <td className="px-4 py-3 text-sm"><span className={m.stock < 20 ? 'text-red-600 font-semibold' : 'text-gray-700'}>{m.stock}</span></td>
                        <td className="px-4 py-3 text-sm">{m.requiresPrescription ? <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs">Rx</span> : <span className="text-gray-300">—</span>}</td>
                        <td className="px-4 py-3"><button onClick={() => toggleProdActive(m)} className={`text-xs px-2 py-1 rounded-full font-medium ${m.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{m.isActive ? 'Active' : 'Inactive'}</button></td>
                        <td className="px-4 py-3"><div className="flex gap-3"><button onClick={() => openEditProd(m)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button><button onClick={() => deleteProd(m._id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ── LAB TESTS TAB ──────────────────────────────────────── */}
        {tab === 'labtests' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Tests', value: labTests.length, color: 'bg-blue-50 text-blue-700' },
                { label: 'Active', value: labTests.filter(t => t.isActive).length, color: 'bg-green-50 text-green-700' },
                { label: 'Popular', value: labTests.filter(t => t.popular).length, color: 'bg-purple-50 text-purple-700' },
                { label: 'With Discount', value: labTests.filter(t => t.mrp && t.mrp > t.price).length, color: 'bg-orange-50 text-orange-700' },
              ].map((s) => (
                <div key={s.label} className={`${s.color} rounded-xl p-4`}>
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className="text-sm font-medium">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <input className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" type="text" placeholder="Search lab test name or category..." value={labSearch} onChange={(e) => setLabSearch(e.target.value)} />
              <button onClick={openAddLab} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold">+ Add Lab Test</button>
            </div>

            {showLabForm && (
              <div className="bg-white rounded-xl shadow border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{editLab ? 'Edit Lab Test' : 'Add New Lab Test'}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" placeholder="Test Name *" value={labForm.name} onChange={(e) => setLabForm({ ...labForm, name: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <select value={labForm.category} onChange={(e) => setLabForm({ ...labForm, category: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Category *</option>
                    {LAB_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                  <input type="number" placeholder="Price ₹ *" value={labForm.price} onChange={(e) => setLabForm({ ...labForm, price: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input type="number" placeholder="MRP ₹" value={labForm.mrp} onChange={(e) => setLabForm({ ...labForm, mrp: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input type="text" placeholder="Duration (e.g. 6-8 hrs fasting)" value={labForm.duration} onChange={(e) => setLabForm({ ...labForm, duration: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input type="text" placeholder="Icon emoji (e.g. 🧪)" value={labForm.icon} onChange={(e) => setLabForm({ ...labForm, icon: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input type="text" placeholder="Tests included (e.g. 72 parameters)" value={labForm.testsIncluded} onChange={(e) => setLabForm({ ...labForm, testsIncluded: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 md:col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <textarea placeholder="Description" value={labForm.description} onChange={(e) => setLabForm({ ...labForm, description: e.target.value })} className="border border-gray-300 rounded-lg px-3 py-2 md:col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500" rows={2} />
                  <label className="flex items-center gap-2 cursor-pointer self-center">
                    <input type="checkbox" checked={labForm.popular} onChange={(e) => setLabForm({ ...labForm, popular: e.target.checked })} className="w-4 h-4 accent-blue-600" />
                    <span className="text-sm text-gray-700">Mark as Popular</span>
                  </label>
                </div>
                <div className="flex gap-3 mt-5">
                  <button onClick={saveLab} disabled={labSaving} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-60">{labSaving ? 'Saving...' : editLab ? 'Update Lab Test' : 'Add Lab Test'}</button>
                  <button onClick={() => { setShowLabForm(false); setEditLab(null); }} className="border border-gray-300 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-50">Cancel</button>
                </div>
              </div>
            )}

            {labLoading ? (
              <div className="text-center py-20 text-gray-400">Loading lab tests...</div>
            ) : (
              <div className="bg-white rounded-xl shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>{['Icon', 'Test Name', 'Category', 'Price / MRP', 'Includes', 'Popular', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredLabs.length === 0 ? (
                      <tr><td colSpan={8} className="px-6 py-12 text-center text-gray-400">No lab tests found. Click "Seed Sample Data" to populate.</td></tr>
                    ) : filteredLabs.map((t) => (
                      <tr key={t._id} className={`hover:bg-gray-50 ${!t.isActive ? 'opacity-50' : ''}`}>
                        <td className="px-4 py-3 text-2xl">{t.icon || '🧪'}</td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900 text-sm">{t.name}</div>
                          {t.description && <div className="text-xs text-gray-500 truncate max-w-xs">{t.description}</div>}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{t.category}</td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-semibold text-blue-700">₹{t.price}</div>
                          {t.mrp && t.mrp > t.price && <div className="text-xs text-gray-400 line-through">₹{t.mrp}</div>}
                          {t.mrp && t.mrp > t.price && <div className="text-xs text-green-600 font-medium">{Math.round(((t.mrp - t.price) / t.mrp) * 100)}% off</div>}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">{t.testsIncluded || '—'}</td>
                        <td className="px-4 py-3">
                          {t.popular ? <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full font-medium">Popular</span> : <span className="text-gray-300 text-xs">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => toggleLabActive(t)} className={`text-xs px-2 py-1 rounded-full font-medium ${t.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{t.isActive ? 'Active' : 'Inactive'}</button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-3">
                            <button onClick={() => openEditLab(t)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                            <button onClick={() => deleteLab(t._id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

