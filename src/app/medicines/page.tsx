'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Product {
  _id: number | string;
  id?: number | string;
  name: string;
  price: number;
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  healthConcerns: string[];
  image: string;
  vendorName: string;
  vendorRating: number;
}

interface Vendor {
  _id: string;
  name: string;
  email: string;
  rating?: number;
}

export default function MedicinesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHealthConcern, setSelectedHealthConcern] = useState('');
  const [selectedVendor, setSelectedVendor] = useState('');
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'allopathy', name: 'Allopathy' },
    { id: 'homeopathy', name: 'Homeopathy' },
    { id: 'ayurveda', name: 'Ayurveda' },
    { id: 'nutrition', name: 'Nutrition & Supplements' },
    { id: 'personal-care', name: 'Personal Care' },
    { id: 'baby-care', name: 'Baby Care' },
    { id: 'sexual-wellness', name: 'Sexual Wellness' },
    { id: 'fitness', name: 'Fitness' },
  ];

  const healthConcerns = [
    'Cold & Cough',
    'Fever',
    'Digestion',
    'Diabetes',
    'Blood Pressure',
    'Heart Health',
    'Joint Pain',
    'Immunity',
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, searchTerm, selectedHealthConcern, selectedVendor]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Fetch from API
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      } else {
        // Fallback to sample data
        const sampleProducts = [
          {
            _id: 1,
            name: 'Aspirin 500mg',
            price: 45,
            category: 'allopathy',
            brand: 'Bayer',
            rating: 4.5,
            reviews: 234,
            healthConcerns: ['Fever', 'Pain'],
            image: '💊',
            vendorName: 'MySanjeevani',
            vendorRating: 5,
          },
          {
            _id: 2,
            name: 'Cough Syrup',
            price: 65,
            category: 'allopathy',
            brand: 'Robitussin',
            rating: 4.2,
            reviews: 156,
            healthConcerns: ['Cold & Cough'],
            image: '🧪',
            vendorName: 'MySanjeevani',
            vendorRating: 5,
          },
        ];
        setProducts(sampleProducts);
      }

      // Fetch vendors
      const vendorRes = await fetch('/api/admin/vendors?status=verified');
      if (vendorRes.ok) {
        const vendorData = await vendorRes.json();
        const vendorList = vendorData.vendors || [];
        setVendors(vendorList);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedHealthConcern) {
      filtered = filtered.filter((p) =>
        p.healthConcerns?.includes(selectedHealthConcern)
      );
    }

    if (selectedVendor) {
      filtered = filtered.filter((p) => p.vendorName === selectedVendor);
    }

    setFilteredProducts(filtered);
  };

  const addToCart = (product: Product) => {
    // Get existing cart from localStorage
    const existingCart = localStorage.getItem('cart');
    let cart = existingCart ? JSON.parse(existingCart) : [];

    // Check if product already exists in cart
    const existingItem = cart.find((item: any) => item.id === (product._id || product.id));

    if (existingItem) {
      // Increase quantity if product already in cart
      existingItem.quantity += 1;
    } else {
      // Add new item to cart
      cart.push({
        id: product._id || product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        brand: product.brand,
        image: product.image,
        vendorName: product.vendorName,
      });
    }

    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  };

  const addToWishlist = (product: Product) => {
    alert(`${product.name} added to wishlist!`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <div className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Medicines & Health Products</h1>
          <p className="text-gray-600 mb-8">
            Browse and order from our wide range of healthcare products
          </p>

          {/* Search Bar */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search medicines, brands, health conditions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Filters and Products */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar Filters */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-20">
                <h3 className="font-bold text-gray-900 mb-4">Filters</h3>

                {/* Category Filter */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-700 text-sm mb-3">
                    Category
                  </h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory('')}
                      className={`block w-full text-left px-3 py-2 rounded text-sm ${
                        selectedCategory === ''
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`block w-full text-left px-3 py-2 rounded text-sm ${
                          selectedCategory === cat.id
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Health Concern Filter */}
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold text-gray-700 text-sm mb-3">
                    Health Concerns
                  </h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedHealthConcern('')}
                      className={`block w-full text-left px-3 py-2 rounded text-sm ${
                        selectedHealthConcern === ''
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      All Concerns
                    </button>
                    {healthConcerns.map((concern) => (
                      <button
                        key={concern}
                        onClick={() => setSelectedHealthConcern(concern)}
                        className={`block w-full text-left px-3 py-2 rounded text-sm ${
                          selectedHealthConcern === concern
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {concern}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vendor Filter */}
                {vendors.length > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-semibold text-gray-700 text-sm mb-3">
                      Vendors
                    </h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => setSelectedVendor('')}
                        className={`block w-full text-left px-3 py-2 rounded text-sm ${
                          selectedVendor === ''
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        All Vendors
                      </button>
                      <button
                        onClick={() => setSelectedVendor('MySanjeevani')}
                        className={`block w-full text-left px-3 py-2 rounded text-sm ${
                          selectedVendor === 'MySanjeevani'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        MySanjeevani Official
                      </button>
                      {vendors.map((vendor) => (
                        <button
                          key={vendor._id}
                          onClick={() => setSelectedVendor(vendor.vendorName)}
                          className={`block w-full text-left px-3 py-2 rounded text-sm ${
                            selectedVendor === vendor.vendorName
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {vendor.vendorName} {vendor.rating && `⭐ ${vendor.rating}`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Products Grid */}
            <div className="md:col-span-3">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading products...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No products found</p>
                  <button
                    onClick={() => {
                      setSelectedCategory('');
                      setSearchTerm('');
                      setSelectedHealthConcern('');
                    }}
                    className="mt-4 text-emerald-600 hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product: any) => (
                    <div
                      key={product._id || product.id}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
                    >
                      {/* Product Image */}
                      <div className="bg-gradient-to-b from-emerald-50 to-gray-50 p-8 text-center text-4xl h-40 flex items-center justify-center">
                        {product.image}
                      </div>

                      {/* Product Details */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {product.brand}
                        </p>

                        {/* Vendor Info */}
                        <div className="text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded mb-2 inline-block">
                          {product.vendorName || 'MySanjeevani'}
                          {product.vendorRating && ` ⭐ ${product.vendorRating}`}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex gap-1 text-yellow-400">
                            {'★'.repeat(Math.floor(product.rating))}
                            {'☆'.repeat(5 - Math.floor(product.rating))}
                          </div>
                          <span className="text-xs text-gray-600">
                            ({product.reviews})
                          </span>
                        </div>

                        {/* Price */}
                        <div className="mb-4">
                          <p className="text-2xl font-bold text-emerald-600">
                            ₹{product.price}
                          </p>
                        </div>

                        {/* Health Concerns Tags */}
                        <div className="mb-4 flex flex-wrap gap-1">
                          {(product.healthConcerns || []).slice(0, 2).map((concern: string) => (
                            <span
                              key={concern}
                              className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded"
                            >
                              {concern}
                            </span>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => addToCart(product)}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded font-medium transition"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => addToWishlist(product)}
                            className="px-3 py-2 border border-gray-300 hover:border-red-300 text-gray-700 rounded font-medium transition"
                          >
                            ♡
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Results Count */}
              {filteredProducts.length > 0 && (
                <div className="mt-8 text-center text-gray-600">
                  Showing {filteredProducts.length} of {products.length} products
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
