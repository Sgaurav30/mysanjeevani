'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  brand: string;
  image: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }

    // Load user from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = Math.floor(totalPrice * 0.10); // 10% discount
  const finalPrice = totalPrice - discount;
  const deliveryCharge = finalPrice > 299 ? 0 : 49;
  const totalAmount = finalPrice + deliveryCharge;

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const removeFromCart = (id: number) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const clearCart = () => {
    if (confirm('Are you sure you want to clear the cart?')) {
      setCartItems([]);
      localStorage.setItem('cart', JSON.stringify([]));
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      alert('Please login first');
      router.push('/login');
      return;
    }
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    setShowPaymentModal(true);
  };

  const processPayment = async () => {
    if (!selectedPaymentMethod) {
      alert('Please select a payment method');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate payment processing
      setTimeout(() => {
        // Create order
        const order = {
          id: Math.random().toString(36).substr(2, 9),
          userId: user.id,
          items: cartItems,
          totalAmount: totalAmount,
          paymentMethod: selectedPaymentMethod,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
        };

        // Save order to localStorage (for demo)
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Clear cart
        setCartItems([]);
        localStorage.setItem('cart', JSON.stringify([]));

        setIsProcessing(false);
        setShowPaymentModal(false);

        // Show success message and redirect
        alert(`Order placed successfully!\nOrder ID: ${order.id}\nPayment Method: ${selectedPaymentMethod}`);
        router.push('/orders');
      }, 2000);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <div className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600 mb-8">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
          </p>

          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Add some medicines to get started</p>
              <Link
                href="/medicines"
                className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Cart Items ({cartItems.length})
                    </h2>
                    <button
                      onClick={clearCart}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Clear Cart
                    </button>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="px-6 py-4 flex gap-4 items-center hover:bg-gray-50 transition"
                      >
                        {/* Product Image */}
                        <div className="w-20 h-20 bg-emerald-50 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                          {item.image}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600">{item.brand}</p>
                          <p className="text-lg font-bold text-emerald-600 mt-1">
                            ₹{item.price}
                          </p>
                        </div>

                        {/* Quantity Control */}
                        <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-gray-600 hover:text-gray-900 font-bold"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-gray-600 hover:text-gray-900 font-bold"
                          >
                            +
                          </button>
                        </div>

                        {/* Total & Remove */}
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            ₹{item.price * item.quantity}
                          </p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-sm text-red-600 hover:text-red-700 mt-2"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Continue Shopping */}
                <div className="mt-6">
                  <Link
                    href="/medicines"
                    className="inline-block text-emerald-600 hover:text-emerald-700 font-semibold"
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Price Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-b from-emerald-50 to-white border border-emerald-200 rounded-lg p-6 sticky top-24">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>

                  <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                    <div className="flex justify-between items-center text-gray-700">
                      <span>Subtotal:</span>
                      <span className="font-semibold">₹{totalPrice.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center text-green-600">
                      <span>Discount (10%):</span>
                      <span className="font-semibold">-₹{discount.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center text-gray-700">
                      <span>After Discount:</span>
                      <span className="font-semibold">₹{finalPrice.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center text-gray-700">
                      <span>
                        Delivery{' '}
                        {deliveryCharge === 0 && (
                          <span className="text-green-600 font-semibold text-xs">
                            (FREE)
                          </span>
                        )}
                        :
                      </span>
                      <span className="font-semibold">
                        {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-6 text-lg">
                    <span className="font-bold text-gray-900">Total Amount:</span>
                    <span className="font-bold text-emerald-600 text-2xl">
                      ₹{totalAmount.toFixed(2)}
                    </span>
                  </div>

                  {deliveryCharge > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 text-xs text-blue-700">
                      📦 Add ₹{(299 - finalPrice).toFixed(2)} more to get FREE delivery
                    </div>
                  )}

                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white py-3 rounded-lg font-bold transition"
                  >
                    💳 Buy Now
                  </button>

                  <div className="mt-4 text-xs text-gray-600 text-center space-y-1">
                    <p>✓ Secure Checkout</p>
                    <p>✓ Multiple Payment Options</p>
                    <p>✓ Money Back Guarantee</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Payment Method</h2>
            <p className="text-gray-600 mb-6">
              Amount to Pay: <span className="font-bold text-emerald-600 text-lg">₹{totalAmount.toFixed(2)}</span>
            </p>

            <div className="space-y-3 mb-6">
              {/* Credit/Debit Card */}
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-emerald-300 transition"
                onClick={() => setSelectedPaymentMethod('card')}>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={selectedPaymentMethod === 'card'}
                  onChange={() => setSelectedPaymentMethod('card')}
                  className="mr-4"
                />
                <div>
                  <p className="font-semibold text-gray-900">💳 Credit/Debit Card</p>
                  <p className="text-xs text-gray-600">Visa, Mastercard, Amex</p>
                </div>
              </label>

              {/* Net Banking */}
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-emerald-300 transition"
                onClick={() => setSelectedPaymentMethod('netbanking')}>
                <input
                  type="radio"
                  name="payment"
                  value="netbanking"
                  checked={selectedPaymentMethod === 'netbanking'}
                  onChange={() => setSelectedPaymentMethod('netbanking')}
                  className="mr-4"
                />
                <div>
                  <p className="font-semibold text-gray-900">🏦 Net Banking</p>
                  <p className="text-xs text-gray-600">All Indian Banks Supported</p>
                </div>
              </label>

              {/* UPI */}
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-emerald-300 transition"
                onClick={() => setSelectedPaymentMethod('upi')}>
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={selectedPaymentMethod === 'upi'}
                  onChange={() => setSelectedPaymentMethod('upi')}
                  className="mr-4"
                />
                <div>
                  <p className="font-semibold text-gray-900">📱 UPI</p>
                  <p className="text-xs text-gray-600">Google Pay, PhonePe, Paytm</p>
                </div>
              </label>

              {/* Wallets */}
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-emerald-300 transition"
                onClick={() => setSelectedPaymentMethod('wallet')}>
                <input
                  type="radio"
                  name="payment"
                  value="wallet"
                  checked={selectedPaymentMethod === 'wallet'}
                  onChange={() => setSelectedPaymentMethod('wallet')}
                  className="mr-4"
                />
                <div>
                  <p className="font-semibold text-gray-900">💰 Digital Wallets</p>
                  <p className="text-xs text-gray-600">Paytm, Amazon Pay, Airtel Money</p>
                </div>
              </label>

              {/* Buy Now Pay Later */}
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-emerald-300 transition"
                onClick={() => setSelectedPaymentMethod('bnpl')}>
                <input
                  type="radio"
                  name="payment"
                  value="bnpl"
                  checked={selectedPaymentMethod === 'bnpl'}
                  onChange={() => setSelectedPaymentMethod('bnpl')}
                  className="mr-4"
                />
                <div>
                  <p className="font-semibold text-gray-900">📅 Buy Now Pay Later</p>
                  <p className="text-xs text-gray-600">Razorpay, Simpl, LazyPay</p>
                </div>
              </label>

              {/* Cash on Delivery */}
              <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-emerald-300 transition"
                onClick={() => setSelectedPaymentMethod('cod')}>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={selectedPaymentMethod === 'cod'}
                  onChange={() => setSelectedPaymentMethod('cod')}
                  className="mr-4"
                />
                <div>
                  <p className="font-semibold text-gray-900">🚚 Cash on Delivery</p>
                  <p className="text-xs text-gray-600">Pay when you receive</p>
                </div>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                onClick={processPayment}
                disabled={isProcessing || !selectedPaymentMethod}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-semibold transition"
              >
                {isProcessing ? 'Processing...' : 'Pay Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
