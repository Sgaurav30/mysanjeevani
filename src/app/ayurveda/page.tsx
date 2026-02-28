'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const CATEGORIES = ['All', 'Immunity', 'Digestion', 'Stress Relief', 'Energy', 'Skin & Hair', 'Weight Management', 'Joint & Bone', "Women's Health", "Men's Health"];

const PRODUCTS = [
  { id: 1, name: 'Ashwagandha KSM-66 Capsules', brand: 'Himalaya', category: 'Stress Relief', price: 349, mrp: 450, discount: 22, icon: '🌿', rating: 4.7, reviews: 2341, desc: 'Clinically tested KSM-66 extract for stress relief & vitality', tag: 'Best Seller' },
  { id: 2, name: 'Triphala Churna 500g', brand: 'Dabur', category: 'Digestion', price: 129, mrp: 180, discount: 28, icon: '🌱', rating: 4.5, reviews: 1823, desc: 'Traditional blend of Amalaki, Bibhitaki & Haritaki for digestion', tag: '' },
  { id: 3, name: 'Chyawanprash Special', brand: 'Baidyanath', category: 'Immunity', price: 245, mrp: 320, discount: 23, icon: '🍯', rating: 4.8, reviews: 4521, desc: '40+ herbs including Amla to boost immunity year-round', tag: 'Top Rated' },
  { id: 4, name: 'Shilajit Gold Capsules', brand: 'Patanjali', category: 'Energy', price: 299, mrp: 399, discount: 25, icon: '⚡', rating: 4.6, reviews: 987, desc: 'Pure Himalayan Shilajit with gold for energy & vitality', tag: '' },
  { id: 5, name: 'Brahmi Ghrita 200ml', brand: 'Kottakkal', category: 'Stress Relief', price: 419, mrp: 550, discount: 24, icon: '🧠', rating: 4.4, reviews: 567, desc: 'Classic Ayurvedic formulation for brain health & memory', tag: '' },
  { id: 6, name: 'Guduchi / Giloy Tablets', brand: 'Himalaya', category: 'Immunity', price: 199, mrp: 260, discount: 23, icon: '🍃', rating: 4.6, reviews: 3102, desc: 'Immunity booster with Guduchi (Tinospora cordifolia)', tag: 'Best Seller' },
  { id: 7, name: 'Neem Karela Jamun Juice', brand: 'Patanjali', category: 'Weight Management', price: 155, mrp: 200, discount: 22, icon: '🥤', rating: 4.3, reviews: 1456, desc: 'Ayurvedic juice blend for blood sugar management', tag: '' },
  { id: 8, name: 'Shatavari Granules 200g', brand: 'Zandu', category: "Women's Health", price: 279, mrp: 360, discount: 22, icon: '🌺', rating: 4.5, reviews: 892, desc: 'Traditional herb for hormonal balance & women\'s wellness', tag: '' },
  { id: 9, name: 'Turmeric Curcumin 95%', brand: 'Organic India', category: 'Joint & Bone', price: 449, mrp: 599, discount: 25, icon: '🟡', rating: 4.7, reviews: 2109, desc: 'High bioavailability curcumin for joint health & inflammation', tag: 'Top Rated' },
  { id: 10, name: 'Arjuna Capsules 60s', brand: 'Himalaya', category: "Men's Health", price: 219, mrp: 280, discount: 22, icon: '❤️', rating: 4.5, reviews: 763, desc: 'Heart tonic with Arjuna bark extract for cardiovascular support', tag: '' },
  { id: 11, name: 'Bhringraj Hair Oil 200ml', brand: 'Dabur', category: 'Skin & Hair', price: 149, mrp: 199, discount: 25, icon: '💆', rating: 4.6, reviews: 3421, desc: 'Ayurvedic hair oil to prevent hairfall and promote growth', tag: 'Best Seller' },
  { id: 12, name: 'Haridra Khand 250g', brand: 'Baidyanath', category: 'Skin & Hair', price: 189, mrp: 250, discount: 24, icon: '✨', rating: 4.4, reviews: 654, desc: 'Turmeric-based formulation for skin glow & allergic conditions', tag: '' },
];

export default function AyurvedaPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<number[]>([]);
  const [search, setSearch] = useState('');

  const filtered = PRODUCTS.filter((p) => {
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (id: number) => {
    setCart((prev) => [...prev, id]);
    // Also update localStorage cart
    try {
      const raw = localStorage.getItem('cart') || '[]';
      const c = JSON.parse(raw);
      const prod = PRODUCTS.find((p) => p.id === id)!;
      const existing = c.find((i: any) => i.id === `ayur-${id}`);
      if (existing) existing.quantity += 1;
      else c.push({ id: `ayur-${id}`, name: prod.name, price: prod.price, quantity: 1 });
      localStorage.setItem('cart', JSON.stringify(c));
      window.dispatchEvent(new Event('storage'));
    } catch {}
  };

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      <Header />

      {/* Hero */}
      <div className="bg-gradient-to-r from-amber-600 to-yellow-500 text-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-extrabold mb-2">🌿 Ayurveda Store</h1>
          <p className="text-amber-100 text-lg mb-4">Ancient wisdom, modern wellness. 100% authentic Ayurvedic products.</p>
          <div className="flex flex-wrap gap-3 text-sm">
            {['100% Authentic', 'Ayush Certified', 'No Side Effects', 'Expert Curated'].map((b) => (
              <span key={b} className="bg-white/20 px-3 py-1 rounded-full">{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <input
            type="text"
            placeholder="Search Ayurvedic products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-96 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full md:w-48 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-20">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">Category</h3>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition ${
                      selectedCategory === cat ? 'bg-amber-100 text-amber-800 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-4">{filtered.length} products found</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((p) => (
                <div key={p.id} className="bg-white rounded-xl border border-amber-200 p-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-3xl">{p.icon}</span>
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-1.5 py-0.5 rounded">{p.discount}% OFF</span>
                  </div>
                  {p.tag && (
                    <span className="bg-amber-100 text-amber-700 text-xs font-medium px-2 py-0.5 rounded-full">{p.tag}</span>
                  )}
                  <h3 className="font-semibold text-gray-900 text-sm mt-1 leading-tight">{p.name}</h3>
                  <p className="text-xs text-amber-700 font-medium">{p.brand}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.desc}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                    <span className="text-yellow-500">★</span>
                    <span>{p.rating}</span>
                    <span className="text-gray-300">({p.reviews})</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold text-gray-900">₹{p.price}</span>
                    <span className="text-xs text-gray-400 line-through">₹{p.mrp}</span>
                  </div>
                  <button
                    onClick={() => addToCart(p.id)}
                    className={`w-full py-1.5 rounded-lg mt-2 text-xs font-semibold transition ${
                      cart.includes(p.id) ? 'bg-green-600 text-white' : 'bg-amber-500 hover:bg-amber-600 text-white'
                    }`}
                  >
                    {cart.includes(p.id) ? '✓ Added' : 'Add to Cart'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
