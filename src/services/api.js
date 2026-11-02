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
        }

        // Auto-migrate product images if they contain unsplash
        if (parsed.products && parsed.products[0]) {
          const prod = parsed.products[0];
          if (!prod.images || prod.images.some(img => img.includes('unsplash'))) {
            prod.images = initialData.products[0].images;
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

  async createOrder(data) {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(3000)
      });
      if (!res.ok) throw new Error('API create order failed');
      return await res.json();
    } catch (err) {
      const db = getLocalDB();
      const newOrder = {
        ...data,
        id: `ORD-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };
      db.orders = [newOrder, ...(db.orders || [])];
      saveLocalDB(db);
      return { success: true, order: newOrder };
    }
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
