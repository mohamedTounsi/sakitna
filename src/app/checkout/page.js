"use client";

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createOrder } from '@/app/actions/order';
import { toTND, calculateProductPrice } from '@/lib/currency';
import { Bebas_Neue } from 'next/font/google';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
});

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartItems, cartTotal, removeFromCart, clearCart } = useCart();
  
  const isDirect = searchParams.get('direct') === 'true';
  const directId = searchParams.get('id');
  const directQty = parseInt(searchParams.get('qty') || '1', 10);
  const directSize = searchParams.get('size') || '';

  const [loading, setLoading] = useState(false);
  const [directProduct, setDirectProduct] = useState(null);
  const [loadingDirect, setLoadingDirect] = useState(isDirect);

  useEffect(() => {
    if (isDirect && directId) {
      fetch(`/api/products/${directId}`)
        .then(res => res.json())
        .then(data => {
          setDirectProduct(data);
          setLoadingDirect(false);
        })
        .catch(err => {
          console.error(err);
          setLoadingDirect(false);
        });
    }
  }, [isDirect, directId]);

  const checkoutItems = isDirect && directProduct 
    ? [{
        product: directProduct,
        quantity: directQty,
        size: directSize,
        price: calculateProductPrice(directProduct, directQty)
      }] 
    : cartItems;

  const checkoutTotal = isDirect && directProduct 
    ? calculateProductPrice(directProduct, directQty) 
    : cartTotal;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const orderData = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      address: formData.get('address'),
      phone: formData.get('phone'),
      items: checkoutItems.map(item => ({
        product: item.product._id,
        title: item.product.title,
        quantity: item.quantity,
        size: item.size,
        price: item.price
      })),
      totalAmount: checkoutTotal
    };

    const res = await createOrder(orderData);
    if (res.success) {
      if (!isDirect) {
        clearCart();
      }
      router.push('/thank-you');
    } else {
      alert("Error placing order: " + res.error);
      setLoading(false);
    }
  };

  if (loadingDirect) {
    return (
      <main className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <section className="flex-1 flex flex-col items-center justify-center mt-20">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </section>
        <Footer />
      </main>
    );
  }

  if (checkoutItems.length === 0) {
    return (
      <main className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <section className="texture-grain flex-1 flex flex-col items-center justify-center py-32 px-8 text-center mt-20">
          <h1 className={`${bebasNeue.className} text-6xl md:text-8xl uppercase tracking-tight text-[#0a1628] mb-6`}>
            Your Cart is Empty
          </h1>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-black/40 mb-10 max-w-md">
            Looks like you haven't added anything to your cart yet.
          </p>
          <button 
            onClick={() => router.push('/shop')} 
            className="border-2 border-[#0a1628] text-[#0a1628] hover:bg-[#0a1628] hover:text-white transition-all duration-300 font-black tracking-[0.25em] uppercase rounded-none py-4 px-10 text-[10px] cursor-pointer"
          >
            Explore Collection &mdash;
          </button>
        </section>
        <Footer />
      </main>
    );
  }

  const inputClass = "w-full border-2 border-black/10 bg-white p-3.5 rounded-none focus:outline-none focus:border-[#0a1628] text-[#0a1628] text-sm placeholder-[#0a1628]/35 transition-all duration-200 font-medium";

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <section className="texture-grain py-24 px-6 md:px-16 max-w-screen-2xl mx-auto flex-1 w-full mt-24 flex flex-col lg:flex-row gap-16">
        
        {/* Checkout Form */}
        <div className="flex-1 lg:max-w-2xl">
          <h1 className={`${bebasNeue.className} text-5xl md:text-6xl uppercase tracking-tight text-[#0a1628] mb-1`}>
            Checkout
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#0a1628]/50 mb-10">
            Billing & Delivery details
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-black/40 mb-2">First Name</label>
                <input type="text" name="firstName" required className={inputClass} placeholder="John" />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-black/40 mb-2">Last Name</label>
                <input type="text" name="lastName" required className={inputClass} placeholder="Doe" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-black/40 mb-2">Delivery Address</label>
              <input type="text" name="address" required className={inputClass} placeholder="123 Main St, Tunis, Tunisia" />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.25em] text-black/40 mb-2">Phone Number</label>
              <input type="tel" name="phone" required className={inputClass} placeholder="+216 20 000 000" />
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-[#0a1628] text-white py-4.5 text-xs font-black uppercase tracking-[0.25em] hover:bg-white hover:text-[#0a1628] border-2 border-[#0a1628] transition disabled:opacity-50 duration-300 rounded-none cursor-pointer"
              >
                {loading ? 'Processing...' : 'Place Order (Cash on Delivery) &mdash;'}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[42%] bg-[#fcfcfb] border border-black/5 p-8 flex flex-col h-fit">
          <h2 className={`${bebasNeue.className} text-3xl uppercase tracking-tight text-[#0a1628] mb-1`}>
            Order Summary
          </h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#0a1628]/50 mb-6">
            Review your selection
          </p>
          
          <div className="space-y-6 mb-8 max-h-[480px] overflow-y-auto pr-2">
            {checkoutItems.map((item, index) => {
              const frontImg = item.product.frontImage || item.product.image;
              return (
                <div key={index} className="flex gap-4 items-start pb-6 border-b border-black/5 last:border-0 last:pb-0">
                  {/* Thumbnail Image */}
                  <div className="relative w-16 h-16 bg-[#f2f2f2] overflow-hidden flex-shrink-0 border border-black/5">
                    {frontImg && (
                      <img 
                        src={frontImg} 
                        alt={item.product.title} 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  {/* Item details */}
                  <div className="flex-1 flex flex-col justify-between min-h-[64px]">
                    <div>
                      <div className="text-xs font-black uppercase tracking-widest text-[#0a1628] leading-tight mb-1">
                        {item.product.title}
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-black/40 flex items-center gap-2">
                        <span>Size: <span className="text-[#0a1628] font-black">{item.size}</span></span>
                        <span>|</span>
                        <span>Qty: <span className="text-[#0a1628] font-black">{item.quantity}</span></span>
                      </div>
                    </div>
                    
                    {/* Actions and Price */}
                    <div className="flex justify-between items-end mt-4">
                      {!isDirect ? (
                        <button
                          type="button"
                          onClick={() => removeFromCart(index)}
                          className="text-[9px] font-black uppercase tracking-widest text-red-500/80 hover:text-red-600 transition cursor-pointer"
                        >
                          Remove
                        </button>
                      ) : (
                        <span className="text-[9px] font-bold uppercase tracking-widest text-black/35">Direct Checkout</span>
                      )}
                      <div className="text-sm font-black text-[#0a1628]">
                        {toTND(item.price)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <hr className="divider-textured mb-6" />

          <div className="flex justify-between items-center text-lg font-black text-[#0a1628]">
            <span className="uppercase tracking-[0.15em] text-[11px] text-black/50">Total</span>
            <span className="text-xl">{toTND(checkoutTotal)}</span>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}

export default function Checkout() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
