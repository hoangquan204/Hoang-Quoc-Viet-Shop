import { initialData } from '../../server/initialData';

const API_BASE = '/api';

function getLocalDB() {
  try {
    const raw = localStorage.getItem('4d_insole_db');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.products && parsed.products.length > 0) {
        // Auto-migrate siteInfo if outdated
        if (parsed.siteInfo) {
          if (!parsed.siteInfo.siteName || parsed.siteInfo.siteName.includes('4D INSOLE')) {
            parsed.siteInfo.siteName = initialData.siteInfo.siteName;
            parsed.siteInfo.mobileSiteName = initialData.siteInfo.mobileSiteName;
          }
          if (!parsed.siteInfo.logoUrl || parsed.siteInfo.logoUrl.includes('unsplash')) {
            parsed.siteInfo.logoUrl = initialData.siteInfo.logoUrl;
          }
          if (!parsed.siteInfo.mobileSiteName) {
            parsed.siteInfo.mobileSiteName = initialData.siteInfo.mobileSiteName;
          }
          if (!parsed.siteInfo.hotline || parsed.siteInfo.hotline.includes('0988')) {
            parsed.siteInfo.hotline = initialData.siteInfo.hotline;
          }
          if (!parsed.siteInfo.zalo || parsed.siteInfo.zalo.includes('0988')) {
            parsed.siteInfo.zalo = initialData.siteInfo.zalo;
          }
          if (!parsed.siteInfo.email || parsed.siteInfo.email !== initialData.siteInfo.email) {
            parsed.siteInfo.email = initialData.siteInfo.email;
          }
          if (!parsed.siteInfo.orderNotifyEmail) {
            parsed.siteInfo.orderNotifyEmail = 'lamhoangquan12c1@gmail.com';
          }
          if (!parsed.siteInfo.announcement || parsed.siteInfo.announcement.includes('SALE') || parsed.siteInfo.announcement.includes('GIẢM')) {
            parsed.siteInfo.announcement = initialData.siteInfo.announcement;
          }
          parsed.siteInfo.vouchers = [];
        }

        // Auto-migrate product images and remove promo prices
        if (parsed.products && parsed.products[0]) {
          const prod = parsed.products[0];
          prod.colors = "Đen, Xám, Trắng, Vàng, Be";
          if (!prod.images || prod.images.some(img => img.includes('unsplash'))) {
            prod.images = initialData.products[0].images;
          }
          if (prod.variants) {
            prod.variants.forEach(v => {
              delete v.originalPrice;
              v.colors = ["Đen", "Xám", "Trắng", "Vàng", "Be"];
            });
          }
        }

        // Auto-migrate review images if they contain unsplash
        if (parsed.reviews) {
          parsed.reviews.forEach(r => {
            if (r.images && r.images.some(img => img.includes('unsplash'))) {
              r.images = [initialData.products[0].images[0]];
            }
          });
        }

        saveLocalDB(parsed);
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Error reading localStorage DB:', e);
  }
  const fresh = JSON.parse(JSON.stringify(initialData));
  saveLocalDB(fresh);
  return fresh;
}

function saveLocalDB(data) {
  try {
    localStorage.setItem('4d_insole_db', JSON.stringify(data));
  } catch (e) {
    console.warn('Error writing localStorage DB:', e);
  }
}

export const api = {
  // Site Info
  async getSiteInfo() {
    try {
      const res = await fetch(`${API_BASE}/site-info`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error('Failed to fetch site info');
      return await res.json();
    } catch (err) {
      return getLocalDB().siteInfo || initialData.siteInfo;
    }
  },

  async updateSiteInfo(data) {
    try {
      const res = await fetch(`${API_BASE}/site-info`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(3000)
      });
      if (!res.ok) throw new Error('API update failed');
      return await res.json();
    } catch (err) {
      const db = getLocalDB();
      db.siteInfo = { ...db.siteInfo, ...data };
      saveLocalDB(db);
      return { success: true, siteInfo: db.siteInfo };
    }
  },

  // Products
  async getProducts() {
    try {
      const res = await fetch(`${API_BASE}/products`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error('Failed to fetch products');
      return await res.json();
    } catch (err) {
      return getLocalDB().products || initialData.products;
    }
  },

  async getProduct(id) {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error('Failed to fetch product');
      return await res.json();
    } catch (err) {
      const db = getLocalDB();
      return (db.products || []).find(p => p.id === id) || initialData.products[0];
    }
  },

  async createProduct(data) {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(3000)
      });
      if (!res.ok) throw new Error('API create product failed');
      return await res.json();
    } catch (err) {
      const db = getLocalDB();
      const newProduct = {
        ...data,
        id: `prod_${Date.now()}`,
        soldCount: data.soldCount || 0,
        rating: data.rating || 5.0,
        reviewCount: data.reviewCount || 0
      };
      db.products = [newProduct, ...(db.products || [])];
      saveLocalDB(db);
      return { success: true, product: newProduct };
    }
  },

  async updateProduct(id, data) {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(3000)
      });
      if (!res.ok) throw new Error('API update product failed');
      return await res.json();
    } catch (err) {
      const db = getLocalDB();
      const idx = (db.products || []).findIndex(p => p.id === id);
      if (idx !== -1) {
        db.products[idx] = { ...db.products[idx], ...data };
        saveLocalDB(db);
        return { success: true, product: db.products[idx] };
      }
      return { success: false, message: 'Product not found' };
    }
  },

  async deleteProduct(id) {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        signal: AbortSignal.timeout(3000)
      });
      if (!res.ok) throw new Error('API delete product failed');
      return await res.json();
    } catch (err) {
      const db = getLocalDB();
      db.products = (db.products || []).filter(p => p.id !== id);
      saveLocalDB(db);
      return { success: true, message: 'Đã xóa sản phẩm' };
    }
  },

  // Orders
  async getOrders() {
    try {
      const res = await fetch(`${API_BASE}/orders`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error('Failed to fetch orders');
      return await res.json();
    } catch (err) {
      return getLocalDB().orders || initialData.orders;
    }
  },

  async sendOrderEmail(order) {
    const targetEmail = 'tracnghiemmoingay@gmail.com';
    const senderEmail = 'lamhoangquan12c1@gmail.com';
    const formatPrice = (num) => new Intl.NumberFormat('vi-VN').format(num || 0) + 'đ';

    const orderTime = new Date().toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const emailPayload = {
      _subject: `🔥 [ĐƠN HÀNG MỚI] #${order.id || 'ORD-001'} - Khách: ${order.customerName} (${order.phone}) - ${formatPrice(order.totalAmount)}`,
      _template: 'table',
      _captcha: 'false',
      _replyto: senderEmail,
      'Tài Khoản Gửi (Shop)': senderEmail,
      'Tài Khoản Nhận': targetEmail,
      'Mã Đơn Hàng': order.id || 'Chưa có',
      'Thời Gian Đặt': orderTime,
      'Họ Và Tên Khách Hàng': order.customerName || 'Khách mua lẻ',
      'Số Điện Thoại Liên Hệ': order.phone || '',
      'Địa Chỉ Giao Hàng': order.address || '',
      'Tỉnh / Thành Phố': order.city || '',
      'Tên Sản Phẩm': order.productName || 'Tấm lót giày 4D# Chính Hãng',
      'Phân Loại': order.variantTitle || '',
      'Kích Thước (Size)': order.size || '',
      'Màu Sắc': order.color || '',
      'Số Lượng': `${order.quantity || 1} đôi`,
      'Đơn Giá': formatPrice(order.unitPrice),
      'Tiền Hàng': formatPrice(order.subtotal || (order.unitPrice * (order.quantity || 1))),
      'Phí Vận Chuyển': 'LIÊN HỆ',
      'TỔNG THANH TOÁN (COD)': formatPrice(order.totalAmount),
      'Ghi Chú Cho Shipper': order.notes || 'Không có ghi chú'
    };

    // 1. Gửi qua FormSubmit trực tiếp đến tracnghiemmoingay@gmail.com
    try {
      fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(emailPayload)
      }).then(res => res.json()).then(res => {
        console.log('✅ Đã gửi email đơn hàng tới tracnghiemmoingay@gmail.com:', res);
      }).catch(err => {
        console.warn('⚠️ Lỗi gửi FormSubmit:', err);
      });
    } catch (err) {}

    // 2. Gửi qua Google Apps Script Webhook (nếu có) để gửi trực tiếp bằng chính tài khoản Gmail lamhoangquan12c1@gmail.com
    try {
      const db = getLocalDB();
      const webhookUrl = localStorage.getItem('google_script_url') || (db.siteInfo && db.siteInfo.googleScriptUrl);
      if (webhookUrl) {
        await fetch(webhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(order)
        });
        console.log('✅ Đã kích hoạt Google Apps Script gửi từ lamhoangquan12c1@gmail.com sang tracnghiemmoingay@gmail.com');
      }
    } catch (e) {}

    return { success: true };
  },

  async createOrder(data) {
    let resultOrder = null;
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        const json = await res.json();
        resultOrder = json.order;
      }
    } catch (err) {
      // server offline
    }

    if (!resultOrder) {
      const db = getLocalDB();
      resultOrder = {
        ...data,
        id: data.id || `ORD-${Date.now().toString().slice(-6)}`,
        createdAt: data.createdAt || new Date().toISOString(),
        status: 'pending'
      };
      db.orders = [resultOrder, ...(db.orders || [])];
      saveLocalDB(db);
    }

    // Tự động gửi email thông báo đơn hàng trực tiếp đến lamhoangquan12c1@gmail.com
    this.sendOrderEmail(resultOrder).catch(() => {});

    return { success: true, order: resultOrder };
  },

  async updateOrderStatus(id, status) {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
        signal: AbortSignal.timeout(3000)
      });
      if (!res.ok) throw new Error('API update status failed');
      return await res.json();
    } catch (err) {
      const db = getLocalDB();
      const order = (db.orders || []).find(o => o.id === id);
      if (order) {
        order.status = status;
        saveLocalDB(db);
      }
      return { success: true, order };
    }
  },

  async deleteOrder(id) {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}`, {
        method: 'DELETE',
        signal: AbortSignal.timeout(3000)
      });
      if (!res.ok) throw new Error('API delete order failed');
      return await res.json();
    } catch (err) {
      const db = getLocalDB();
      db.orders = (db.orders || []).filter(o => o.id !== id);
      saveLocalDB(db);
      return { success: true, message: 'Đã xóa đơn hàng' };
    }
  },

  // Reviews
  async getReviews(productId) {
    try {
      const url = productId ? `${API_BASE}/reviews?productId=${productId}` : `${API_BASE}/reviews`;
      const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error('Failed to fetch reviews');
      return await res.json();
    } catch (err) {
      const db = getLocalDB();
      let revs = db.reviews || initialData.reviews;
      if (productId) {
        revs = revs.filter(r => r.productId === productId);
      }
      return revs;
    }
  },

  async createReview(data) {
    try {
      const res = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(3000)
      });
      if (!res.ok) throw new Error('API create review failed');
      return await res.json();
    } catch (err) {
      const db = getLocalDB();
      const newReview = {
        ...data,
        id: `rev_${Date.now()}`,
        createdAt: new Date().toISOString(),
        likes: 0,
        verified: true
      };
      db.reviews = [newReview, ...(db.reviews || [])];
      saveLocalDB(db);
      return { success: true, review: newReview };
    }
  },

  async deleteReview(id) {
    try {
      const res = await fetch(`${API_BASE}/reviews/${id}`, {
        method: 'DELETE',
        signal: AbortSignal.timeout(3000)
      });
      if (!res.ok) throw new Error('API delete review failed');
      return await res.json();
    } catch (err) {
      const db = getLocalDB();
      db.reviews = (db.reviews || []).filter(r => r.id !== id);
      saveLocalDB(db);
      return { success: true, message: 'Đã xóa đánh giá' };
    }
  },

  // Admin Auth
  async login(username, password) {
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      // Offline fallback
    }

    if (username === 'admin' && password === 'admin') {
      return {
        success: true,
        token: 'admin-auth-token-valid',
        user: {
          username: 'admin',
          role: 'Administrator',
          displayName: 'Quản trị viên Hệ Thống'
        }
      };
    }
    return {
      success: false,
      message: 'Tài khoản hoặc mật khẩu không chính xác! (Mặc định: admin / admin)'
    };
  },

  // Reset Data
  async resetData() {
    try {
      const res = await fetch(`${API_BASE}/reset-data`, {
        method: 'POST',
        signal: AbortSignal.timeout(3000)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      // Offline fallback
    }
    saveLocalDB(JSON.parse(JSON.stringify(initialData)));
    return { success: true, message: 'Đã khôi phục dữ liệu ban đầu thành công' };
  }
};
