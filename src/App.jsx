import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ProductMediaGallery from './components/ProductMediaGallery';
import ProductInfo from './components/ProductInfo';
import ProductHighlights from './components/ProductHighlights';
import OrderForm from './components/OrderForm';
import ReviewsSection from './components/ReviewsSection';
import SizeGuideModal from './components/SizeGuideModal';
import OrderSuccessModal from './components/OrderSuccessModal';
import LiveSalesToast from './components/LiveSalesToast';
import MobileStickyBar from './components/MobileStickyBar';
import FloatingContactButtons from './components/FloatingContactButtons';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import { api } from './services/api';
import { initialData } from '../server/initialData';

export default function App() {
  // Navigation View State: 'shop' | 'admin'
  const [currentView, setCurrentView] = useState('shop');

  // THEME STATE: Default is 'light' as requested by the user!
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  // Sync theme with html root class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Core Data States
  const [siteInfo, setSiteInfo] = useState(initialData.siteInfo);
  const [products, setProducts] = useState(initialData.products);
  const [orders, setOrders] = useState(initialData.orders);
  const [reviews, setReviews] = useState(initialData.reviews);
  const [loading, setLoading] = useState(true);

  // Active Product Selection
  const currentProduct = products[0] || initialData.products[0];

  // Selection states
  const [selectedVariant, setSelectedVariant] = useState(currentProduct?.variants?.[0] || null);
  const [selectedSize, setSelectedSize] = useState('42');
  const [selectedColor, setSelectedColor] = useState('Đen Pro');
  const [quantity, setQuantity] = useState(1);

  // Modals
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Load data from Backend on mount
  useEffect(() => {
    async function loadAllData() {
      try {
        const [infoRes, prodsRes, ordsRes, revsRes] = await Promise.allSettled([
          api.getSiteInfo(),
          api.getProducts(),
          api.getOrders(),
          api.getReviews(currentProduct?.id)
        ]);

        if (infoRes.status === 'fulfilled' && infoRes.value) {
          setSiteInfo(infoRes.value);
        }
        if (prodsRes.status === 'fulfilled' && prodsRes.value && prodsRes.value.length > 0) {
          setProducts(prodsRes.value);
          const firstProd = prodsRes.value[0];
          if (firstProd && firstProd.variants && firstProd.variants.length > 0) {
            setSelectedVariant(firstProd.variants[0]);
            setSelectedSize(firstProd.variants[0].sizes?.[0] || '41');
            setSelectedColor(firstProd.variants[0].colors?.[0] || 'Đen');
          }
        }
        if (ordsRes.status === 'fulfilled' && ordsRes.value) {
          setOrders(ordsRes.value);
        }
        if (revsRes.status === 'fulfilled' && revsRes.value) {
          setReviews(revsRes.value);
        }
      } catch (err) {
        console.warn('Using initial dataset:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAllData();
  }, []);

  // Sync selected variant when product changes
  useEffect(() => {
    if (currentProduct && currentProduct.variants && currentProduct.variants.length > 0) {
      if (!selectedVariant || !currentProduct.variants.find(v => v.id === selectedVariant.id)) {
        const firstVar = currentProduct.variants[0];
        setSelectedVariant(firstVar);
        setSelectedSize(firstVar.sizes?.[0] || '41');
        setSelectedColor(firstVar.colors?.[0] || 'Đen');
      }
    }
  }, [currentProduct]);

  // Scroll to Order Form smoothly
  const handleScrollToOrder = () => {
    const el = document.getElementById('order-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Reset demo data
  const handleResetData = async () => {
    if (!window.confirm('Bạn có chắc muốn khôi phục toàn bộ dữ liệu mẫu ban đầu?')) return;
    try {
      await api.resetData();
      setSiteInfo(initialData.siteInfo);
      setProducts(initialData.products);
      setOrders(initialData.orders);
      setReviews(initialData.reviews);
      alert('Đã khôi phục dữ liệu ban đầu thành công!');
    } catch (e) {
      setSiteInfo(initialData.siteInfo);
      setProducts(initialData.products);
      setOrders(initialData.orders);
      setReviews(initialData.reviews);
      alert('Đã khôi phục dữ liệu ban đầu!');
    }
  };

  // Switch to Admin View
  if (currentView === 'admin') {
    return (
      <AdminPanel
        siteInfo={siteInfo}
        setSiteInfo={setSiteInfo}
        products={products}
        setProducts={setProducts}
        orders={orders}
        setOrders={setOrders}
        reviews={reviews}
        setReviews={setReviews}
        onClose={() => setCurrentView('shop')}
        onResetData={handleResetData}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 selection:bg-rose-500 selection:text-white transition-colors duration-200">
      
      {/* Navbar with Announcement Bar & Theme Switcher */}
      <Navbar
        siteInfo={siteInfo}
        onOpenAdmin={() => setCurrentView('admin')}
        currentView={currentView}
        setCurrentView={setCurrentView}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Main Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Media Column: Danh sách hình ảnh & video sản phẩm */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <ProductMediaGallery
              product={currentProduct}
            />
          </div>

          {/* Product Info & Variant Selector Column */}
          <div className="lg:col-span-7">
            <ProductInfo
              product={currentProduct}
              selectedVariant={selectedVariant}
              setSelectedVariant={setSelectedVariant}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              quantity={quantity}
              setQuantity={setQuantity}
              onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
              onBuyNow={handleScrollToOrder}
            />
          </div>

        </div>

        {/* 4D Technology Highlights */}
        <ProductHighlights />

        {/* Express Checkout Order Form */}
        <OrderForm
          product={currentProduct}
          selectedVariant={selectedVariant}
          selectedSize={selectedSize}
          selectedColor={selectedColor}
          quantity={quantity}
          siteInfo={siteInfo}
          onOrderSuccess={(order) => setCompletedOrder(order)}
        />

        {/* Customer Reviews Section */}
        <ReviewsSection
          reviews={reviews}
          productId={currentProduct?.id}
          onReviewAdded={(newRev) => setReviews(prev => [newRev, ...prev])}
        />

      </main>

      {/* Footer */}
      <Footer
        siteInfo={siteInfo}
        onOpenAdmin={() => setCurrentView('admin')}
      />

      {/* Mobile Sticky Buy Bar */}
      <MobileStickyBar
        siteInfo={siteInfo}
        onBuyNow={handleScrollToOrder}
      />

      {/* Social Proof Live Sales Toast */}
      <LiveSalesToast />

      {/* Floating Contact Bubbles: Phone & Zalo */}
      <FloatingContactButtons siteInfo={siteInfo} />

      {/* Size Guide & Cut Instructions Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      {/* Order Success Celebration Modal */}
      <OrderSuccessModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
        siteInfo={siteInfo}
      />

    </div>
  );
}
