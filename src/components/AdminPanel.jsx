import React, { useState } from 'react';
import { 
  Lock, Globe, Image, Video, Package, ShoppingBag, 
  Star, Plus, Trash2, Save, CheckCircle, AlertCircle, 
  Eye, ArrowLeft, RefreshCw, Phone, Sun, Moon, LogOut,
  FileSpreadsheet, Mail, ExternalLink, Send, Copy, Check, Code, HelpCircle, X
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminPanel({ 
  siteInfo, 
  setSiteInfo, 
  products, 
  setProducts, 
  orders, 
  setOrders, 
  reviews, 
  setReviews, 
  onClose,
  onResetData,
  theme,
  toggleTheme
}) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_token') === 'admin-auth-token-valid';
  });
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // Active Tab: 'site' | 'products' | 'orders' | 'reviews'
  const [activeTab, setActiveTab] = useState('site');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Edit Site Form State
  const [siteForm, setSiteForm] = useState(() => ({
    siteName: 'Hoàng Quốc Việt Shop',
    mobileSiteName: 'HQV Shop',
    tagline: 'Lót Giày Chất Lượng - Siêu Êm Giảm Đau Mỏi Chân',
    logoUrl: 'https://res.cloudinary.com/dldpfpp5/image/upload/v1793622192/Ho%C3%A0ng_Qu%E1%BB%91c_Vi%E1%BB%87t_Shop_L%C3%B3t_Gi%C3%A0y_Ch%E1%BA%A5t_L%C6%B0%E1%BB%A3ng_m63azn.png',
    announcement: '✨ HOÀNG QUỐC VIỆT SHOP • PHÂN PHỐI TẤM LÓT GIÀY 4D# CHÍNH HÃNG • GIAO HÀNG TOÀN QUỐC • KIỂM TRA HÀNG KHI NHẬN',
    hotline: '0971.250.891',
    zalo: '0356280381',
    email: 'haimyminhquan2123@gmail.com',
    address: 'Hoàng Quốc Việt Shop - Tổng Kho Phụ Kiện Giày - Hà Nội & TP. Hồ Chí Minh',
    googleSheetUrl: 'https://docs.google.com/spreadsheets/d/1besF2yiEShlWJWFEhdJnntWWex7llAXDeTC0-QO4fHk/edit?usp=sharing',
    orderNotifyEmail: 'lamhoangquan12c1@gmail.com',
    googleScriptUrl: localStorage.getItem('google_script_url') || '',
    ...(siteInfo || {})
  }));

  const [googleScriptModalOpen, setGoogleScriptModalOpen] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [testResultMsg, setTestResultMsg] = useState('');

  // Edit Product State
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const activeProduct = products[selectedProductIndex] || products[0] || {};
  const [productForm, setProductForm] = useState(() => activeProduct);

  const [newImageUrl, setNewImageUrl] = useState('');

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      const res = await api.login(loginForm.username, loginForm.password);
      if (res && res.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_token', 'admin-auth-token-valid');
      } else {
        setLoginError(res.message || 'Tài khoản hoặc mật khẩu không chính xác!');
      }
    } catch (err) {
      if (loginForm.username === 'admin' && loginForm.password === 'admin') {
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_token', 'admin-auth-token-valid');
      } else {
        setLoginError('Tài khoản hoặc mật khẩu không chính xác! (Gợi ý: admin / admin)');
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_token');
  };

  const showToast = (msg) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  // Save Site Info
  const handleSaveSiteInfo = async (e) => {
    e.preventDefault();
    if (siteForm.googleScriptUrl) {
      localStorage.setItem('google_script_url', siteForm.googleScriptUrl.trim());
    }
    try {
      const res = await api.updateSiteInfo(siteForm);
      if (res && res.success) {
        setSiteInfo(res.siteInfo);
        showToast('Đã lưu cấu hình website và cài đặt Google Sheet thành công!');
      }
    } catch (err) {
      setSiteInfo(siteForm);
      showToast('Đã cập nhật cấu hình website thành công!');
    }
  };

  // Test Google Script Webhook
  const handleTestWebhook = async () => {
    const url = siteForm.googleScriptUrl || localStorage.getItem('google_script_url');
    if (!url) {
      alert('Vui lòng nhập đường link URL Web App Google Apps Script trước khi gửi thử!');
      return;
    }
    setIsTestingWebhook(true);
    setTestResultMsg('');
    const sampleOrder = {
      id: 'TEST-' + Math.floor(100000 + Math.random() * 900000),
      customerName: 'Khách Hàng Thử Nghiệm (Test)',
      phone: '0971250891',
      address: '123 Đường Cầu Giấy, Phường Dịch Vọng',
      city: 'Hà Nội',
      productName: 'Tấm lót giày 4D# Chính Hãng',
      variantTitle: 'Bản Tiêu Chuẩn 4D (Test)',
      size: '41',
      color: 'Đen',
      quantity: 2,
      unitPrice: 35000,
      subtotal: 70000,
      shippingFeeText: 'LIÊN HỆ',
      totalAmount: 70000,
      notes: 'Đơn hàng test kiểm tra tự động Google Sheet và Email lamhoangquan12c1@gmail.com',
      createdAt: new Date().toISOString()
    };
    try {
      await fetch(url.trim(), {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(sampleOrder)
      });
      setTestResultMsg('✅ Đã gửi đơn test! Bạn hãy mở file Google Sheet và hộp thư lamhoangquan12c1@gmail.com để kiểm tra nhé.');
    } catch (err) {
      setTestResultMsg('⚠️ Lỗi gửi đơn test: ' + err.message);
    } finally {
      setIsTestingWebhook(false);
    }
  };

  // Save Product Info
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await api.updateProduct(productForm.id, productForm);
      if (res && res.success) {
        const updated = products.map(p => p.id === productForm.id ? res.product : p);
        setProducts(updated);
        showToast('Đã lưu thông tin sản phẩm và hình ảnh/video thành công!');
      }
    } catch (err) {
      const updated = products.map(p => p.id === productForm.id ? productForm : p);
      setProducts(updated);
      showToast('Đã cập nhật sản phẩm thành công!');
    }
  };

  // Add Product Image
  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    setProductForm(prev => ({
      ...prev,
      images: [...(prev.images || []), newImageUrl.trim()]
    }));
    setNewImageUrl('');
  };

  // Remove Product Image
  const handleRemoveImage = (indexToRemove) => {
    setProductForm(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // Update Order Status
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await api.updateOrderStatus(orderId, newStatus);
      if (res && res.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        showToast(`Đã chuyển đơn ${orderId} sang "${newStatus}"`);
      }
    } catch (err) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      showToast(`Đã cập nhật trạng thái đơn ${orderId}`);
    }
  };

  // Delete Order
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Bạn có chắc muốn xóa đơn hàng ${orderId}?`)) return;
    try {
      await api.deleteOrder(orderId);
      setOrders(prev => prev.filter(o => o.id !== orderId));
      showToast(`Đã xóa đơn hàng ${orderId}`);
    } catch (err) {
      setOrders(prev => prev.filter(o => o.id !== orderId));
    }
  };

  // Delete Review
  const handleDeleteReview = async (revId) => {
    if (!window.confirm('Bạn có chắc muốn xóa đánh giá này?')) return;
    try {
      await api.deleteReview(revId);
      setReviews(prev => prev.filter(r => r.id !== revId));
      showToast('Đã xóa đánh giá thành công!');
    } catch (err) {
      setReviews(prev => prev.filter(r => r.id !== revId));
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.finalAmount || o.totalAmount) || 0), 0);
  const totalOrders = orders.length;

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          
          <div className="w-14 h-14 rounded-2xl bg-rose-600 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-rose-500/20">
            <Lock size={28} />
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">ĐĂNG NHẬP ADMIN</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Trang quản trị cập nhật website & sản phẩm bán hàng
            </p>
          </div>

          {loginError && (
            <div className="mb-4 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-500/50 p-3 rounded-xl text-red-700 dark:text-red-200 text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0 text-red-500" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Tài khoản (Username)</label>
              <input
                type="text"
                required
                value={loginForm.username}
                onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                placeholder="admin"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-rose-500 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Mật khẩu (Password)</label>
              <input
                type="password"
                required
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                placeholder="•••••"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-rose-500 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md transition active:scale-95 text-sm"
            >
              Đăng Nhập Quản Trị
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
            <button
              onClick={() => setLoginForm({ username: 'admin', password: 'admin' })}
              className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline"
            >
              Điền nhanh tài khoản mặc định (admin / admin)
            </button>
            <div className="mt-3">
              <button
                onClick={onClose}
                className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-1 mx-auto"
              >
                <ArrowLeft size={14} /> Quay lại trang bán hàng
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // AUTHENTICATED DASHBOARD
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      
      {/* Admin Top Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center font-black text-white text-sm shadow">
              4D#
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Hệ Thống Quản Trị Website Bán Hàng</span>
                <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800">
                  Admin Active
                </span>
              </h1>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Tài khoản: <strong className="text-slate-900 dark:text-white">admin</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            
            {/* Theme Toggle in Admin */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold px-2.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 transition"
              title="Chuyển chế độ Sáng / Tối"
            >
              {theme === 'dark' ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-slate-600" />}
            </button>

            <button
              onClick={onClose}
              className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 transition shadow-sm"
              title="Quay lại giao diện người mua"
            >
              <Eye size={14} />
              <span className="hidden sm:inline">Xem Website</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-700 dark:text-red-300 text-xs font-bold px-3 py-2 rounded-xl border border-red-200 dark:border-red-800 transition shadow-sm"
              title="Đăng xuất"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Admin Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {saveSuccessMsg && (
          <div className="mb-6 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-600 p-3.5 rounded-2xl text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 shadow-sm animate-fade-in">
            <CheckCircle size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
            <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">Tổng Doanh Thu</p>
            <p className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-500 mt-1">
              {new Intl.NumberFormat('vi-VN').format(totalRevenue)}đ
            </p>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1">Từ {totalOrders} đơn đặt hàng</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
            <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">Đơn Hàng Mới</p>
            <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              {totalOrders}
            </p>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">
              {orders.filter(o => o.status === 'Chờ xác nhận').length} đơn chờ xác nhận
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
            <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">Sản Phẩm Đang Bán</p>
            <p className="text-xl sm:text-2xl font-black text-sky-600 dark:text-sky-400 mt-1">
              {products.length}
            </p>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1">4 phân loại nam/nữ 4D</p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
            <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">Đánh Giá Người Dùng</p>
            <p className="text-xl sm:text-2xl font-black text-amber-500 mt-1">
              {reviews.length} (4.9 ⭐)
            </p>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-1">100% đánh giá hài lòng</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-slate-800 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('site')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'site'
                ? 'bg-rose-600 text-white shadow'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <Globe size={15} />
            <span>Cập Nhật Website & Logo</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-rose-600 text-white shadow'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <Package size={15} />
            <span>Quản Lý Sản Phẩm & Media</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-rose-600 text-white shadow'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <ShoppingBag size={15} />
            <span>Quản Lý Đơn Hàng ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'bg-rose-600 text-white shadow'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <Star size={15} />
            <span>Quản Lý Đánh Giá ({reviews.length})</span>
          </button>

          <button
            onClick={onResetData}
            className="ml-auto flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold px-3 py-2 rounded-xl transition border border-slate-300 dark:border-slate-700 whitespace-nowrap"
            title="Khôi phục lại dữ liệu ban đầu"
          >
            <RefreshCw size={13} />
            <span>Khôi phục mẫu</span>
          </button>
        </div>

        {/* TAB 1: WEBSITE & LOGO */}
        {activeTab === 'site' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-sm">
            <div className="max-w-2xl mb-6">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">Cấu Hình Thông Tin Website & Logo</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Thay đổi tên website, hình ảnh logo thương hiệu, số điện thoại hotline và thanh thông báo chạy chữ.
              </p>
            </div>

            <form onSubmit={handleSaveSiteInfo} className="space-y-4 max-w-3xl text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Tên Website (Desktop) *</label>
                  <input
                    type="text"
                    required
                    value={siteForm.siteName}
                    onChange={(e) => setSiteForm(prev => ({ ...prev, siteName: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-rose-500 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none text-sm"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Ví dụ: Hoàng Quốc Việt Shop</p>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Tên Hiển Thị Rút Gọn (Mobile)</label>
                  <input
                    type="text"
                    value={siteForm.mobileSiteName || ''}
                    onChange={(e) => setSiteForm(prev => ({ ...prev, mobileSiteName: e.target.value }))}
                    placeholder="HQV Shop"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-rose-500 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none text-sm"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Hiển thị trên màn hình điện thoại (ví dụ: HQV Shop)</p>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Khẩu hiệu / Slogan phụ</label>
                <input
                  type="text"
                  value={siteForm.tagline || ''}
                  onChange={(e) => setSiteForm(prev => ({ ...prev, tagline: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-rose-500 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none"
                />
              </div>

              {/* Logo URL with Live Preview */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  URL Logo Website (Điền link hình ảnh logo)
                </label>
                <div className="flex gap-3 items-center">
                  <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 overflow-hidden shrink-0 flex items-center justify-center p-1 shadow-sm">
                    {siteForm.logoUrl ? (
                      <img 
                        src={siteForm.logoUrl} 
                        alt="Logo Preview" 
                        className="w-full h-full object-contain rounded-xl"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://res.cloudinary.com/dldpfpp5/image/upload/v1793622192/Ho%C3%A0ng_Qu%E1%BB%91c_Vi%E1%BB%87t_Shop_L%C3%B3t_Gi%C3%A0y_Ch%E1%BA%A5t_L%C6%B0%E1%BB%A3ng_m63azn.png';
                        }}
                      />
                    ) : (
                      <span className="text-slate-400 text-[10px]">Chưa có</span>
                    )}
                  </div>
                  <input
                    type="url"
                    value={siteForm.logoUrl || ''}
                    onChange={(e) => setSiteForm(prev => ({ ...prev, logoUrl: e.target.value }))}
                    placeholder="https://..."
                    className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-rose-500 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Logo hiển thị góc trái navbar và footer của website</p>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Dòng chữ thông báo chạy ở đầu trang (Marquee)</label>
                <textarea
                  rows={2}
                  value={siteForm.announcement || ''}
                  onChange={(e) => setSiteForm(prev => ({ ...prev, announcement: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-rose-500 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Hotline tư vấn</label>
                  <input
                    type="text"
                    value={siteForm.hotline || ''}
                    onChange={(e) => setSiteForm(prev => ({ ...prev, hotline: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-rose-500 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Số Zalo hỗ trợ</label>
                  <input
                    type="text"
                    value={siteForm.zalo || ''}
                    onChange={(e) => setSiteForm(prev => ({ ...prev, zalo: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-rose-500 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Email liên hệ</label>
                  <input
                    type="email"
                    value={siteForm.email || ''}
                    onChange={(e) => setSiteForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-rose-500 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Địa chỉ kho hàng / Tổng kho</label>
                <input
                  type="text"
                  value={siteForm.address || ''}
                  onChange={(e) => setSiteForm(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-rose-500 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none"
                />
              </div>

              {/* GOOGLE SHEET & EMAIL AUTOMATION INTEGRATION */}
              <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-2 border-emerald-500/30 dark:border-emerald-500/20 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-200 dark:border-emerald-900/50 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
                      <FileSpreadsheet size={22} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <span>Tự Động Đẩy Đơn Hàng Vào Google Sheet & Gửi Email</span>
                        <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Tự động 100%</span>
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Khách nhấn đặt hàng trên website sẽ tự động lưu vào Sheet và gửi thư chi tiết tới email của bạn.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setGoogleScriptModalOpen(true)}
                      className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow active:scale-95"
                    >
                      <Code size={14} />
                      <span>Xem Code & Hướng Dẫn</span>
                    </button>
                  </div>
                </div>

                {/* Two info badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-2 shadow-sm">
                    <div>
                      <span className="text-[11px] text-slate-500 font-semibold block">File Google Sheet đang kết nối:</span>
                      <span className="font-bold text-slate-900 dark:text-white line-clamp-1 mt-0.5">
                        Tấm lót giày 4D - Đơn Hàng Trực Tuyến
                      </span>
                    </div>
                    <a
                      href="https://docs.google.com/spreadsheets/d/1besF2yiEShlWJWFEhdJnntWWex7llAXDeTC0-QO4fHk/edit?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 hover:bg-emerald-200 text-emerald-800 dark:text-emerald-300 font-bold px-2.5 py-1.5 rounded-lg transition"
                    >
                      <ExternalLink size={12} />
                      <span>Mở Sheet</span>
                    </a>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-2 shadow-sm">
                    <div>
                      <span className="text-[11px] text-slate-500 font-semibold block">Email nhận thông báo tức thì:</span>
                      <span className="font-bold text-rose-600 dark:text-rose-400 text-sm mt-0.5 block">
                        lamhoangquan12c1@gmail.com
                      </span>
                    </div>
                    <span className="shrink-0 flex items-center gap-1 bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-bold px-2.5 py-1.5 rounded-lg text-[11px]">
                      <Mail size={12} />
                      <span>Đã kích hoạt</span>
                    </span>
                  </div>
                </div>

                {/* Webhook Input Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Đường dẫn Web App Google Apps Script (Webhook URL):
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="url"
                      placeholder="Dán URL Web App (Ví dụ: https://script.google.com/macros/s/AKfycb.../exec)"
                      value={siteForm.googleScriptUrl || ''}
                      onChange={(e) => setSiteForm(prev => ({ ...prev, googleScriptUrl: e.target.value }))}
                      className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-emerald-500 rounded-xl px-4 py-2 text-xs text-slate-900 dark:text-white outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleTestWebhook}
                      disabled={isTestingWebhook}
                      className="shrink-0 flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow active:scale-95 disabled:opacity-50"
                    >
                      <Send size={13} />
                      <span>{isTestingWebhook ? 'Đang gửi test...' : 'Gửi Đơn Test'}</span>
                    </button>
                  </div>
                  {testResultMsg && (
                    <p className="text-xs font-semibold mt-2 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                      {testResultMsg}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic">
                    * Nếu chưa có URL, bạn bấm vào nút <strong>"Xem Code & Hướng Dẫn"</strong> ở trên để sao chép mã dán vào Google Sheet trong 1 phút.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-2.5 rounded-xl transition shadow active:scale-95 text-xs sm:text-sm"
                >
                  <Save size={16} />
                  <span>Lưu Cập Nhật Website & Logo</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* TAB 2: PRODUCT & MEDIA */}
        {activeTab === 'products' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Quản Lý Sản Phẩm & Media (Hình Ảnh / Video)</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Cập nhật thông tin chi tiết: Tên, chất liệu, hướng dẫn sử dụng, bảo quản, cảnh báo, màu sắc, xuất xứ, khoảng giá nam/nữ, URL video và hình ảnh.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Tên sản phẩm *
                  </label>
                  <input
                    type="text"
                    required
                    value={productForm.name || ''}
                    onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-rose-500 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white font-bold outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Mô tả ngắn / Slogan phụ</label>
                  <input
                    type="text"
                    value={productForm.tagline || ''}
                    onChange={(e) => setProductForm(prev => ({ ...prev, tagline: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 focus:border-rose-500 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              {/* Exact Specs */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-sky-400">
                  Thông Số Kỹ Thuật Chi Tiết
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Chất liệu *</label>
                    <input
                      type="text"
                      value={productForm.material || 'PU, Polyester, Spandex'}
                      onChange={(e) => setProductForm(prev => ({ ...prev, material: e.target.value }))}
                      placeholder="PU, Polyester, Spandex"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-rose-500 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Màu sắc *</label>
                    <input
                      type="text"
                      value={productForm.colors || 'Đen, Xám, Trắng, Vàng, Be'}
                      onChange={(e) => setProductForm(prev => ({ ...prev, colors: e.target.value }))}
                      placeholder="Đen, Xám, Trắng, Vàng, Be"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-rose-500 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Xuất xứ *</label>
                    <input
                      type="text"
                      value={productForm.origin || 'Trung Quốc'}
                      onChange={(e) => setProductForm(prev => ({ ...prev, origin: e.target.value }))}
                      placeholder="Trung Quốc"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-rose-500 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      Giá Lót Giày Nam (Theo yêu cầu: 35.000 - 50.000 Size: 38-47)
                    </label>
                    <input
                      type="text"
                      value={productForm.malePriceRange || '35.000 - 50.000 (Size: 38-47)'}
                      onChange={(e) => setProductForm(prev => ({ ...prev, malePriceRange: e.target.value }))}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-rose-500 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                      Giá Lót Giày Nữ (Theo yêu cầu: 25.000 - 45.000 Size: 35-41)
                    </label>
                    <input
                      type="text"
                      value={productForm.femalePriceRange || '25.000 - 45.000 (Size: 35-41)'}
                      onChange={(e) => setProductForm(prev => ({ ...prev, femalePriceRange: e.target.value }))}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-rose-500 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                    Hướng dẫn sử dụng (Khách: Cắt và đặt vào giày theo kích cỡ)
                  </label>
                  <textarea
                    rows={2}
                    value={productForm.instructions || ''}
                    onChange={(e) => setProductForm(prev => ({ ...prev, instructions: e.target.value }))}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-rose-500 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Bảo quản (Khách: Bảo quản nơi khô ráo)</label>
                    <input
                      type="text"
                      value={productForm.storage || 'Bảo quản nơi khô ráo'}
                      onChange={(e) => setProductForm(prev => ({ ...prev, storage: e.target.value }))}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-rose-500 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-red-700 dark:text-red-400 font-semibold mb-1">
                      Cảnh báo (Khách: Tránh xa lửa; không sử dụng miếng lót với mục đích khác)
                    </label>
                    <input
                      type="text"
                      value={productForm.warning || 'Tránh xa lửa; không sử dụng miếng lót với mục đích khác.'}
                      onChange={(e) => setProductForm(prev => ({ ...prev, warning: e.target.value }))}
                      className="w-full bg-white dark:bg-slate-900 border border-red-300 dark:border-red-500/40 focus:border-red-500 rounded-xl px-3 py-2 text-red-700 dark:text-red-200 outline-none"
                    />
                  </div>
                </div>

              </div>

              {/* Video URL Management */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <Video size={16} className="text-rose-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    URL Video Sản Phẩm (Hiển thị trong danh sách media)
                  </h3>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">
                    Điền liên kết video (MP4 hoặc web video tương thích)
                  </label>
                  <input
                    type="url"
                    value={productForm.videoUrl || ''}
                    onChange={(e) => setProductForm(prev => ({ ...prev, videoUrl: e.target.value }))}
                    placeholder="https://assets.mixkit.co/...mp4"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-rose-500 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                {productForm.videoUrl && (
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-[11px] text-slate-600 dark:text-slate-400">Xem thử trước video:</span>
                    <video
                      src={productForm.videoUrl}
                      className="w-28 h-20 object-cover rounded-lg border border-slate-300 dark:border-slate-700"
                      controls
                      muted
                    />
                  </div>
                )}
              </div>

              {/* Images URL Management */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-2">
                  <Image size={16} className="text-sky-600 dark:text-sky-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Thư Viện Hình Ảnh Sản Phẩm ({productForm.images?.length || 0} ảnh)
                  </h3>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Điền URL hình ảnh sản phẩm mới (https://...)"
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-rose-500 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2 rounded-xl transition flex items-center gap-1 shrink-0"
                  >
                    <Plus size={14} />
                    <span>Thêm Ảnh</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
                  {(productForm.images || []).map((imgUrl, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 aspect-square bg-slate-100 dark:bg-slate-900">
                      <img 
                        src={imgUrl} 
                        alt={`Ảnh SP ${idx + 1}`} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://res.cloudinary.com/dldpfpp5/image/upload/v1793624516/Gemini_Generated_Image_kj8pblkj8pblkj8p_xumnxs.png';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center p-2">
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow"
                        >
                          <Trash2 size={12} />
                          <span>Xóa</span>
                        </button>
                      </div>
                      <span className="absolute bottom-1 left-1 bg-black/70 text-[9px] px-1 rounded text-white">
                        #{idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-2.5 rounded-xl transition shadow active:scale-95 text-xs sm:text-sm"
                >
                  <Save size={16} />
                  <span>Lưu Thay Đổi Sản Phẩm</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* TAB 3: ORDERS */}
        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Danh Sách Đơn Hàng Đặt Từ Website ({orders.length})</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Đơn hàng khách hàng điền form trên website sẽ xuất hiện tại đây theo thời gian thực.
                </p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="py-12 text-center text-slate-600 dark:text-slate-400 text-xs">
                Hiện chưa có đơn hàng nào được gửi.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                      <th className="pb-3 px-2">Mã Đơn</th>
                      <th className="pb-3 px-2">Khách Hàng & SĐT</th>
                      <th className="pb-3 px-2">Địa Chỉ Giao</th>
                      <th className="pb-3 px-2">Phân Loại / Size</th>
                      <th className="pb-3 px-2">SL</th>
                      <th className="pb-3 px-2">Tổng Tiền</th>
                      <th className="pb-3 px-2">Thanh Toán</th>
                      <th className="pb-3 px-2">Trạng Thái</th>
                      <th className="pb-3 px-2 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                        <td className="py-3 px-2 font-mono font-bold text-rose-600 whitespace-nowrap">
                          {order.id}
                          <span className="block text-[10px] text-slate-600 dark:text-slate-400 font-sans font-normal">
                            {order.createdAt}
                          </span>
                        </td>

                        <td className="py-3 px-2">
                          <p className="font-bold text-slate-900 dark:text-white">{order.customerName}</p>
                          <a href={`tel:${order.phone}`} className="text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 font-mono">
                            <Phone size={10} /> {order.phone}
                          </a>
                        </td>

                        <td className="py-3 px-2 max-w-[200px]">
                          <p className="text-slate-800 dark:text-slate-200 line-clamp-1">{order.address}</p>
                          <p className="text-slate-600 dark:text-slate-400 text-[10px]">{order.city}</p>
                          {order.notes && (
                            <p className="text-amber-600 text-[10px] italic">Ghi chú: {order.notes}</p>
                          )}
                        </td>

                        <td className="py-3 px-2">
                          <p className="text-slate-900 dark:text-white font-semibold line-clamp-1">{order.variantTitle}</p>
                          <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">
                            Size {order.size} • {order.color}
                          </span>
                        </td>

                        <td className="py-3 px-2 font-bold text-slate-900 dark:text-white text-center">
                          {order.quantity}
                        </td>

                        <td className="py-3 px-2 font-black text-rose-600 whitespace-nowrap">
                          {new Intl.NumberFormat('vi-VN').format(order.finalAmount || order.totalAmount)}đ
                        </td>

                        <td className="py-3 px-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            order.paymentMethod === 'COD' 
                              ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                              : 'bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400 border border-sky-300 dark:border-sky-800'
                          }`}>
                            {order.paymentMethod}
                          </span>
                        </td>

                        <td className="py-3 px-2">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-[11px] rounded-lg px-2 py-1 text-slate-900 dark:text-white outline-none font-bold"
                          >
                            <option value="Chờ xác nhận">Chờ xác nhận</option>
                            <option value="Đang giao hàng">Đang giao hàng</option>
                            <option value="Đã hoàn thành">Đã hoàn thành</option>
                            <option value="Đã hủy">Đã hủy</option>
                          </select>
                        </td>

                        <td className="py-3 px-2 text-right">
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg transition"
                            title="Xóa đơn hàng"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Quản Lý Đánh Giá Từ Người Dùng ({reviews.length})</h2>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Duyệt hoặc xóa những bình luận, đánh giá hiển thị trên website.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {reviews.map(rev => (
                <div key={rev.id} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-900 dark:text-white">{rev.userName}</span>
                      <div className="flex text-amber-400">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} size={11} className="fill-current text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-600 dark:text-slate-400">{rev.date}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{rev.comment}</p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Phân loại: {rev.variantPurchased}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteReview(rev.id)}
                    className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg transition shrink-0"
                    title="Xóa đánh giá này"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* GOOGLE APPS SCRIPT INSTRUCTION MODAL */}
      {googleScriptModalOpen && (
        <div 
          className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fade-in select-none"
          onClick={(e) => {
            if (e.target === e.currentTarget) setGoogleScriptModalOpen(false);
          }}
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                  <FileSpreadsheet size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black">Hướng Dẫn Kết Nối Google Sheet & Gửi Email Tự Động</h3>
                  <p className="text-xs text-emerald-100">
                    Ghi đơn vào file Sheet & Gửi email đến: <strong>lamhoangquan12c1@gmail.com</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setGoogleScriptModalOpen(false)}
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              
              {/* Steps Overview */}
              <div className="space-y-2.5">
                <div className="flex gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
                  <div>
                    <strong className="text-slate-900 dark:text-white block font-bold">Mở Google Apps Script trong Google Sheet:</strong>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Mở file Google Sheet của bạn{' '}
                      <a 
                        href="https://docs.google.com/spreadsheets/d/1besF2yiEShlWJWFEhdJnntWWex7llAXDeTC0-QO4fHk/edit?usp=sharing" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-emerald-600 dark:text-emerald-400 font-bold underline inline-flex items-center gap-1"
                      >
                        [Mở Sheet tại đây ↗]
                      </a>
                      , trên thanh Menu chọn: <strong>Tiện ích mở rộng (Extensions)</strong> ➔ chọn <strong>Apps Script</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">2</span>
                  <div>
                    <strong className="text-slate-900 dark:text-white block font-bold">Dán toàn bộ mã nguồn:</strong>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Xóa hết các dòng chữ có sẵn trong file <code>Code.gs</code>, bấm nút <strong>"Sao Chép Mã Nguồn"</strong> ở bên dưới và dán vào, sau đó nhấn biểu tượng <strong>Lưu 💾 (Ctrl + S)</strong>.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">3</span>
                  <div>
                    <strong className="text-slate-900 dark:text-white block font-bold">Triển khai thành Web App:</strong>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Bấm nút màu xanh <strong>Triển khai (Deploy)</strong> ở góc trên bên phải ➔ <strong>Tùy chọn triển khai mới (New deployment)</strong> ➔ Chọn loại: <strong>Ứng dụng web (Web app)</strong>.
                      <br />• Thực thi dưới dạng: <strong>Tôi (lamhoangquan12c1@gmail.com)</strong>
                      <br />• Ai có quyền truy cập: <strong className="text-rose-600 dark:text-rose-400">Bất kỳ ai (Anyone)</strong> *(Bắt buộc chọn Bất kỳ ai để website có thể gửi đơn hàng)*
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">4</span>
                  <div>
                    <strong className="text-slate-900 dark:text-white block font-bold">Lấy URL và dán vào Website:</strong>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Bấm <strong>Triển khai</strong>, Google sẽ yêu cầu cấp quyền (chọn Nâng cao ➔ Đi tới ứng dụng không an toàn ➔ Cho phép). Copy đường link <strong>URL ứng dụng web</strong> (có đuôi <code>/exec</code>), dán vào ô Webhook URL trên trang Admin và bấm <strong>Lưu Cập Nhật</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Code Box with Copy Button */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Code size={14} className="text-emerald-600" />
                    <span>Mã Nguồn Google Apps Script (Code.gs)</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      const code = `/**
 * HOÀNG QUỐC VIỆT SHOP - GOOGLE APPS SCRIPT WEBHOOK ĐẶT HÀNG TỰ ĐỘNG
 * Ghi vào Sheet: 1besF2yiEShlWJWFEhdJnntWWex7llAXDeTC0-QO4fHk
 * Gửi email đến: lamhoangquan12c1@gmail.com
 */
var CONFIG = {
  SHEET_ID: "1besF2yiEShlWJWFEhdJnntWWex7llAXDeTC0-QO4fHk",
  EMAIL_RECEIVER: "lamhoangquan12c1@gmail.com",
  SHOP_NAME: "Hoàng Quốc Việt Shop",
  SHOP_HOTLINE: "0971.250.891",
  SHOP_ZALO: "0356.280.381",
  SHEET_URL: "https://docs.google.com/spreadsheets/d/1besF2yiEShlWJWFEhdJnntWWex7llAXDeTC0-QO4fHk/edit?usp=sharing"
};

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    message: "Webhook Hoàng Quốc Việt Shop đang hoạt động bình thường!",
    targetEmail: CONFIG.EMAIL_RECEIVER,
    sheetUrl: CONFIG.SHEET_URL
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var rawData = {};
    if (e && e.postData && e.postData.contents) {
      try { rawData = JSON.parse(e.postData.contents); } catch (err) { rawData = e.parameter || {}; }
    } else if (e && e.parameter) {
      rawData = e.parameter;
    }

    var now = new Date();
    var timeStr = Utilities.formatDate(now, "GMT+7", "dd/MM/yyyy HH:mm:ss");
    var orderId = rawData.id || ("ORD-" + now.getTime().toString().slice(-6));
    var customerName = (rawData.customerName || "Khách mua lẻ").trim();
    var phone = (rawData.phone || rawData.customerPhone || "").trim();
    var address = (rawData.address || rawData.customerAddress || "").trim();
    var city = (rawData.city || "Toàn quốc").trim();
    var notes = (rawData.notes || "Không có").trim();

    var productName = rawData.productName || "Tấm lót giày 4D# Chính Hãng";
    var variantTitle = rawData.variantTitle || "Bản Tiêu Chuẩn 4D";
    var size = rawData.size || "39";
    var color = rawData.color || "Đen";
    var quantity = Number(rawData.quantity || 1);
    var unitPrice = Number(rawData.unitPrice || 35000);
    var subtotal = Number(rawData.subtotal || (unitPrice * quantity));
    var totalAmount = Number(rawData.totalAmount || rawData.finalAmount || subtotal);
    var shippingFeeText = rawData.shippingFeeText || "LIÊN HỆ";
    var status = "Chờ xác nhận";

    function formatVND(amount) {
      return Number(amount).toLocaleString("vi-VN") + "đ";
    }

    // 1. GHI VÀO GOOGLE SHEET
    var ss;
    try { ss = SpreadsheetApp.openById(CONFIG.SHEET_ID); } catch (sheetErr) { ss = SpreadsheetApp.getActiveSpreadsheet(); }
    var sheet = ss.getActiveSheet();

    if (sheet.getLastRow() === 0) {
      var headers = [
        "Mã Đơn Hàng", "Thời Gian Đặt", "Họ Tên Khách Hàng", "Số Điện Thoại",
        "Địa Chỉ Giao Hàng", "Tỉnh / Thành Phố", "Tên Sản Phẩm", "Phân Loại",
        "Size Giày", "Màu Sắc", "Số Lượng", "Đơn Giá", "Tổng Tiền",
        "Phí Vận Chuyển", "Ghi Chú Shipper", "Trạng Thái"
      ];
      sheet.appendRow(headers);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#e11d48").setFontColor("#ffffff").setFontWeight("bold").setHorizontalAlignment("center").setVerticalAlignment("middle");
      sheet.setRowHeight(1, 35);
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      orderId, timeStr, customerName, "'" + phone, address, city,
      productName, variantTitle, size, color, quantity,
      formatVND(unitPrice), formatVND(totalAmount), shippingFeeText, notes, status
    ]);

    var newRow = sheet.getLastRow();
    sheet.setRowHeight(newRow, 28);
    sheet.getRange(newRow, 1, 1, 16).setVerticalAlignment("middle");
    sheet.getRange(newRow, 1).setFontWeight("bold").setFontColor("#e11d48");
    sheet.getRange(newRow, 4).setHorizontalAlignment("left");
    sheet.getRange(newRow, 11).setHorizontalAlignment("center");
    sheet.getRange(newRow, 13).setFontWeight("bold");
    sheet.getRange(newRow, 16).setBackground("#fef3c7").setFontColor("#b45309").setFontWeight("bold").setHorizontalAlignment("center");

    // 2. GỬI EMAIL THÔNG BÁO ĐẾN lamhoangquan12c1@gmail.com
    var emailSubject = "🔥 [ĐƠN HÀNG MỚI] " + orderId + " - " + customerName + " (" + phone + ") - " + formatVND(totalAmount);
    var emailHtml = \`
<!DOCTYPE html>
<html>
<body style="margin:0;padding:20px 10px;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1e293b;">
  <div style="max-width:620px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.08);border:1px solid #e2e8f0;">
    <div style="background:linear-gradient(135deg,#e11d48 0%,#be123c 100%);padding:28px 24px;text-align:center;color:#fff;">
      <div style="display:inline-block;background:rgba(255,255,255,0.2);padding:4px 14px;border-radius:20px;font-size:11px;font-weight:800;text-transform:uppercase;margin-bottom:8px;">
        ✨ Thông Báo Đơn Hàng Mới Từ Website
      </div>
      <h1 style="margin:0;font-size:22px;font-weight:900;">\${CONFIG.SHOP_NAME}</h1>
      <p style="margin:6px 0 0;font-size:12px;opacity:0.9;">Mã đơn: <strong style="background:#fff;color:#e11d48;padding:2px 8px;border-radius:6px;font-family:monospace;">\${orderId}</strong></p>
    </div>
    <div style="padding:22px 18px;">
      <div style="background:#ecfdf5;border:1px solid #a7f3d0;border-radius:12px;padding:12px 16px;margin-bottom:18px;color:#065f46;font-size:13px;font-weight:700;">
        📦 Có 01 đơn hàng mới đang chờ bạn xác nhận và đóng gói gửi hàng!
      </div>
      <div style="background:#f8fafc;border-radius:14px;padding:16px;border:1px solid #e2e8f0;margin-bottom:18px;">
        <h3 style="margin:0 0 10px;font-size:13px;text-transform:uppercase;color:#64748b;font-weight:800;border-bottom:1px solid #e2e8f0;padding-bottom:6px;">
          👤 Thông Tin Người Nhận
        </h3>
        <table style="width:100%;font-size:13px;border-collapse:collapse;">
          <tr><td style="padding:5px 0;color:#64748b;width:120px;">Khách hàng:</td><td style="padding:5px 0;font-weight:700;color:#0f172a;">\${customerName}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;">Số điện thoại:</td><td style="padding:5px 0;"><a href="tel:\${phone}" style="color:#e11d48;font-weight:900;font-size:15px;text-decoration:none;background:#ffe4e6;padding:3px 10px;border-radius:8px;display:inline-block;">📞 \${phone} (Bấm gọi ngay)</a></td></tr>
          <tr><td style="padding:5px 0;color:#64748b;">Địa chỉ giao:</td><td style="padding:5px 0;font-weight:600;">\${address}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;">Tỉnh thành:</td><td style="padding:5px 0;font-weight:600;">\${city}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;">Ghi chú:</td><td style="padding:5px 0;color:#b45309;font-weight:600;font-style:italic;">\${notes}</td></tr>
          <tr><td style="padding:5px 0;color:#64748b;">Thời gian:</td><td style="padding:5px 0;color:#64748b;">\${timeStr}</td></tr>
        </table>
      </div>
      <div style="background:#fff;border-radius:14px;padding:16px;border:1px solid #e2e8f0;margin-bottom:20px;">
        <h3 style="margin:0 0 10px;font-size:13px;text-transform:uppercase;color:#64748b;font-weight:800;border-bottom:1px solid #e2e8f0;padding-bottom:6px;">
          🛒 Chi Tiết Sản Phẩm
        </h3>
        <table style="width:100%;font-size:13px;border-collapse:collapse;">
          <tr style="background:#f1f5f9;color:#475569;"><th style="padding:8px;text-align:left;">Sản Phẩm</th><th style="padding:8px;text-align:center;">Size/Màu</th><th style="padding:8px;text-align:center;">SL</th><th style="padding:8px;text-align:right;">Thành Tiền</th></tr>
          <tr>
            <td style="padding:10px 8px;border-bottom:1px solid #f1f5f9;"><strong style="color:#0f172a;">\${productName}</strong><div style="color:#e11d48;font-size:11px;font-weight:600;">\${variantTitle}</div></td>
            <td style="padding:10px 8px;border-bottom:1px solid #f1f5f9;text-align:center;"><span style="background:#f1f5f9;padding:2px 6px;border-radius:4px;font-weight:600;">\${size} • \${color}</span></td>
            <td style="padding:10px 8px;border-bottom:1px solid #f1f5f9;text-align:center;font-weight:700;">x\${quantity}</td>
            <td style="padding:10px 8px;border-bottom:1px solid #f1f5f9;text-align:right;font-weight:700;">\${formatVND(unitPrice * quantity)}</td>
          </tr>
        </table>
        <div style="margin-top:12px;padding-top:8px;border-top:1px dashed #e2e8f0;">
          <table style="width:100%;font-size:13px;border-collapse:collapse;">
            <tr><td style="padding:4px 0;color:#64748b;">Tiền hàng (\${quantity} đôi):</td><td style="padding:4px 0;text-align:right;font-weight:600;">\${formatVND(subtotal)}</td></tr>
            <tr><td style="padding:4px 0;color:#64748b;">Phí vận chuyển:</td><td style="padding:4px 0;text-align:right;font-weight:800;color:#e11d48;">\${shippingFeeText}</td></tr>
            <tr style="border-top:1px solid #e2e8f0;"><td style="padding:10px 0 2px;font-size:14px;font-weight:800;">TỔNG THANH TOÁN:</td><td style="padding:10px 0 2px;text-align:right;font-size:18px;font-weight:900;color:#e11d48;">\${formatVND(totalAmount)}</td></tr>
          </table>
        </div>
      </div>
      <div style="text-align:center;margin:20px 0 5px;">
        <a href="tel:\${phone}" style="display:inline-block;background:#059669;color:#fff;text-decoration:none;padding:10px 20px;border-radius:10px;font-weight:800;font-size:13px;margin-right:8px;">📞 Gọi Cho Khách Ngay</a>
        <a href="\${CONFIG.SHEET_URL}" target="_blank" style="display:inline-block;background:#0284c7;color:#fff;text-decoration:none;padding:10px 20px;border-radius:10px;font-weight:800;font-size:13px;">📊 Mở Google Sheet</a>
      </div>
    </div>
    <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:14px;text-align:center;font-size:11px;color:#64748b;">
      \${CONFIG.SHOP_NAME} • Hotline: \${CONFIG.SHOP_HOTLINE} • Zalo: \${CONFIG.SHOP_ZALO}
    </div>
  </div>
</body>
</html>\`;

    MailApp.sendEmail({ to: CONFIG.EMAIL_RECEIVER, subject: emailSubject, htmlBody: emailHtml });

    return ContentService.createTextOutput(JSON.stringify({
      success: true, message: "Đã thêm vào Sheet và gửi email thành công!", orderId: orderId
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}`;
                      navigator.clipboard.writeText(code);
                      setCopiedScript(true);
                      setTimeout(() => setCopiedScript(false), 3000);
                    }}
                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg transition active:scale-95 shadow"
                  >
                    {copiedScript ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedScript ? 'Đã Sao Chép Code!' : 'Sao Chép Toàn Bộ Mã Nguồn'}</span>
                  </button>
                </div>

                <div className="bg-slate-900 text-emerald-300 p-3.5 rounded-xl font-mono text-[11px] leading-relaxed max-h-48 overflow-y-auto border border-slate-800">
                  <p className="text-slate-400 mb-1">// Dán toàn bộ mã nguồn này vào trình biên tập Apps Script trong Google Sheet</p>
                  <pre className="text-slate-200">
{`var CONFIG = {
  SHEET_ID: "1besF2yiEShlWJWFEhdJnntWWex7llAXDeTC0-QO4fHk",
  EMAIL_RECEIVER: "lamhoangquan12c1@gmail.com",
  SHOP_NAME: "Hoàng Quốc Việt Shop",
  SHOP_HOTLINE: "0971.250.891",
  SHOP_ZALO: "0356.280.381"
};

function doPost(e) { ... }`}
                  </pre>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setGoogleScriptModalOpen(false)}
                className="bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold px-6 py-2 rounded-xl text-xs transition"
              >
                Đã Hiểu & Đóng Lại
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
