'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Suspense } from 'react';

interface Product {
  _id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  mrp?: number;
  discount?: number;
  icon?: string;
  benefit?: string;
  description?: string;
  stock: number;
  rating: number;
  reviews: number;
  requiresPrescription?: boolean;
  healthConcerns?: string[];
  isActive: boolean;
}

// ── Category groups for sidebar ─────────────────────────────────────────────
const MED_CATEGORIES = ['All', 'Antibiotics', 'Pain Relief', 'Acidity', 'Diabetes', 'Allergy', 'Heart Care', 'Vitamins', 'Cardiac', 'Supplements', 'Gastric'];
const AYUR_CATEGORIES = ['All', 'Immunity', 'Digestion', 'Stress Relief', 'Energy', 'Brain Health', "Women's Health", 'Joint & Bone', 'Skin Care'];
const HOMEO_CATEGORIES = ['All', 'Pain', 'Digestion & Acidity', 'Metabolism', 'Joint Pain', 'Cold & Flu', "Women's Health", 'Immunity', 'Skin Care'];

const TAB_CATEGORIES: Record<string, string[]> = {
  medicines: ['Antibiotics', 'Pain Relief', 'Acidity', 'Diabetes', 'Allergy', 'Heart Care', 'Vitamins', 'Cardiac', 'Supplements', 'Gastric'],
  ayurveda: ['Ayurveda'],
  homeopathy: ['Homeopathy'],
};

const TAB_SIDEBAR: Record<string, string[]> = {
  medicines: MED_CATEGORIES,
  ayurveda: AYUR_CATEGORIES,
  homeopathy: HOMEO_CATEGORIES,
};

const TAB_CONFIG = [
  { key: 'medicines', label: '💊 Medicines', color: 'emerald' },
  { key: 'ayurveda', label: '🌿 Ayurveda', color: 'amber' },
  { key: 'homeopathy', label: '🌸 Homeopathy', color: 'pink' },
];

const COLOR_MAP: Record<string, { active: string; btn: string; tag: string; ring: string }> = {
  emerald: { active: 'bg-emerald-100 text-emerald-800', btn: 'bg-orange-500 hover:bg-orange-600', tag: 'bg-emerald-50 text-emerald-700', ring: 'border-emerald-500 text-emerald-700' },
  amber:   { active: 'bg-amber-100 text-amber-800',   btn: 'bg-amber-500 hover:bg-amber-600',   tag: 'bg-amber-50 text-amber-700',   ring: 'border-amber-500 text-amber-700' },
  pink:    { active: 'bg-pink-100 text-pink-800',     btn: 'bg-pink-500 hover:bg-pink-600',     tag: 'bg-pink-50 text-pink-700',     ring: 'border-pink-500 text-pink-700' },
};

function MedicinesContent() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get('category') || '';

  const [activeTab, setActiveTab] = useState<'medicines' | 'ayurveda' | 'homeopathy'>('medicines');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [search, setSearch] = useState('');
  const [sidebarCat, setSidebarCat] = useState('All');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [seedStatus, setSeedStatus] = useState<string | null>(null);

  // Map URL param category → tab
  useEffect(() => {
    if (!urlCategory) return;
    const lower = urlCategory.toLowerCase();
    if (lower === 'ayurveda') setActiveTab('ayurveda');
    else if (lower === 'homeopathy') setActiveTab('homeopathy');
    else setActiveTab('medicines');
  }, [urlCategory]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      // fetch all, we filter client-side by category group
      const res = await fetch('/api/products?limit=200');
      const data = await res.json();
      setProducts(data.products || []);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const seedData = async () => {
    setSeeding(true);
    setSeedStatus(null);
    try {
      const res = await fetch('/api/seed?force=false', { method: 'POST' });
      const data = await res.json();
      if (data.seeded) {
        setSeedStatus(`✅ Seeded ${data.seeded.products} products + ${data.seeded.labTests} lab tests`);
      } else {
        setSeedStatus('Already seeded — use ?force=true to re-seed');
      }
      await fetchProducts();
    } catch { setSeedStatus('Seed failed'); }
    setSeeding(false);
  };

  const addToCart = (product: Product) => {
    setCart((prev) => ({ ...prev, [product._id]: (prev[product._id] || 0) + 1 }));
    try {
      const raw = localStorage.getItem('cart') || '[]';
      const c = JSON.parse(raw);
      const existing = c.find((i: any) => i.id === product._id);
      if (existing) existing.quantity += 1;
      else c.push({ id: product._id, name: product.name, price: product.price, quantity: 1, brand: product.brand, image: product.icon || '💊', vendorName: 'MySanjeevani' });
      localStorage.setItem('cart', JSON.stringify(c));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  };

  // ── Filter products for current tab + sidebar category ──────────────────
  const tabCategories = TAB_CATEGORIES[activeTab];
  const tabFiltered = products.filter((p) => {
    if (activeTab === 'ayurveda') return p.category === 'Ayurveda';
    if (activeTab === 'homeopathy') return p.category === 'Homeopathy';
    return tabCategories.includes(p.category);
  });

  const displayed = tabFiltered.filter((p) => {
    const matchCat = sidebarCat === 'All' || p.category === sidebarCat || p.benefit === sidebarCat;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.brand || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const col = COLOR_MAP[TAB_CONFIG.find((t) => t.key === activeTab)!.color];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-extrabold mb-1">Health Products Store</h1>
          <p className="text-emerald-100">Medicines · Ayurveda · Homeopathy — all at discounted prices</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex">
            {TAB_CONFIG.map((t) => (
              <button key={t.key} onClick={() => { setActiveTab(t.key as any); setSidebarCat('All'); }}
                className={`px-6 py-4 text-sm font-semibold border-b-2 transition ${
                  activeTab === t.key
                    ? `border-${t.color}-600 text-${t.color}-700`
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
                style={activeTab === t.key ? { borderColor: t.color === 'amber' ? '#d97706' : t.color === 'pink' ? '#db2777' : '#059669', color: t.color === 'amber' ? '#92400e' : t.color === 'pink' ? '#9d174d' : '#065f46' } : {}}>
                {t.label}
              </button>
            ))}
          </div>
          {products.length === 0 && !loading && (
            <button onClick={seedData} disabled={seeding}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-60">
              {seeding ? 'Loading data...' : '⚡ Load Products'}
            </button>
          )}
        </div>
      </div>

      {seedStatus && (
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-2 text-sm">{seedStatus}</div>
        </div>
      )}

      <div className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
        <div className="flex flex-col md:flex-row gap-6">

          {/* Sidebar */}
          <aside className="w-full md:w-52 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-20">
              <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
              <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">Category</h3>
              <div className="space-y-0.5">
                {TAB_SIDEBAR[activeTab].map((cat) => (
                  <button key={cat} onClick={() => setSidebarCat(cat)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition ${sidebarCat === cat ? col.active + ' font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}>
                    {cat}
                    <span className="float-right text-xs text-gray-400">
                      {cat === 'All' ? tabFiltered.length : tabFiltered.filter((p) => p.category === cat || p.benefit === cat).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">{displayed.length} products</p>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
                    <div className="h-16 bg-gray-100 rounded mb-3" />
                    <div className="h-4 bg-gray-100 rounded mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-2/3 mb-3" />
                    <div className="h-8 bg-gray-100 rounded" />
                  </div>
                ))}
              </div>
            ) : displayed.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">💊</div>
                <p className="text-gray-500 mb-4">No products found.</p>
                {products.length === 0 && (
                  <button onClick={seedData} disabled={seeding}
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-600">
                    {seeding ? 'Loading...' : '⚡ Load Sample Products'}
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayed.map((product) => (
                  <div key={product._id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition flex flex-col">
                    {/* Icon & discount */}
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-4xl">{product.icon || '💊'}</span>
                      {product.mrp && product.mrp > product.price && (
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-1.5 py-0.5 rounded">
                          {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                        </span>
                      )}
                    </div>

                    {/* Benefit tag (Ayurveda/Homeopathy) */}
                    {product.benefit && (
                      <span className={`text-xs px-2 py-0.5 rounded-full mb-1 self-start ${col.tag}`}>{product.benefit}</span>
                    )}

                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">{product.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{product.brand} · {product.category}</p>

                    {product.requiresPrescription && (
                      <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded mt-1 self-start">Rx</span>
                    )}

                    <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-500">
                      <span className="text-yellow-500">★</span>
                      <span>{product.rating}</span>
                      <span className="text-gray-300">({product.reviews})</span>
                    </div>

                    <div className="flex items-baseline gap-2 mt-1.5">
                      <span className="font-bold text-gray-900 text-base">₹{product.price}</span>
                      {product.mrp && product.mrp > product.price && (
                        <span className="text-xs text-gray-400 line-through">₹{product.mrp}</span>
                      )}
                    </div>

                    <button onClick={() => addToCart(product)}
                      className={`w-full py-2 rounded-lg mt-auto mt-3 text-sm font-semibold text-white transition ${cart[product._id] ? 'bg-gray-600' : col.btn}`}>
                      {cart[product._id] ? `✓ In Cart (${cart[product._id]})` : 'Add to Cart'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function MedicinesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <MedicinesContent />
    </Suspense>
  );
}

