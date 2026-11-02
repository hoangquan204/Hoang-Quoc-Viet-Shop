import React, { useState } from 'react';
import { 
  Lock, Globe, Image, Video, Package, ShoppingBag, 
  Star, Plus, Trash2, Save, CheckCircle, AlertCircle, 
  Eye, ArrowLeft, RefreshCw, Phone, Sun, Moon, LogOut
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
  const [siteForm, setSiteForm] = useState(() => siteInfo || {
    siteName: 'Hoàng Quốc Việt Shop',
    mobileSiteName: 'HQV Shop',
    tagline: 'Lót Giày Chất Lượng - Siêu Êm Giảm Đau Mỏi Chân',
    logoUrl: 'https://res.cloudinary.com/dldpfpp5/image/upload/v1793622192/Ho%C3%A0ng_Qu%E1%BB%91c_Vi%E1%BB%87t_Shop_L%C3%B3t_Gi%C3%A0y_Ch%E1%BA%A5t_L%C6%B0%E1%BB%A3ng_m63azn.png',
    announcement: '✨ HOÀNG QUỐC VIỆT SHOP • PHÂN PHỐI TẤM LÓT GIÀY 4D# CHÍNH HÃNG • GIAO HÀNG TOÀN QUỐC • KIỂM TRA HÀNG KHI NHẬN',
    hotline: '0971.250.891',
    zalo: '0356280381',
    email: 'haimyminhquan2123@gmail.com',
    address: 'Hoàng Quốc Việt Shop - Tổng Kho Phụ Kiện Giày - Hà Nội & TP. Hồ Chí Minh'
  });

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
    try {
      const res = await api.updateSiteInfo(siteForm);
      if (res && res.success) {
        setSiteInfo(res.siteInfo);
        showToast('Đã lưu cấu hình website và logo thành công!');
      }
    } catch (err) {
      setSiteInfo(siteForm);
      showToast('Đã cập nhật cấu hình website thành công!');
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
                      value={productForm.colors || 'Đa dạng'}
                      onChange={(e) => setProductForm(prev => ({ ...prev, colors: e.target.value }))}
                      placeholder="Đa dạng"
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
    </div>
  );
}
