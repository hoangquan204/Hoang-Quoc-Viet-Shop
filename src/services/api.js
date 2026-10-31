const API_BASE = '/api';

export const api = {
  // Site Info
  async getSiteInfo() {
    try {
      const res = await fetch(`${API_BASE}/site-info`);
      if (!res.ok) throw new Error('Failed to fetch site info');
      return await res.json();
    } catch (err) {
      console.warn('API getSiteInfo error, using fallback:', err);
      return null;
    }
  },

  async updateSiteInfo(data) {
    const res = await fetch(`${API_BASE}/site-info`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  // Products
  async getProducts() {
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (!res.ok) throw new Error('Failed to fetch products');
      return await res.json();
    } catch (err) {
      console.warn('API getProducts error:', err);
      return [];
    }
  },

  async getProduct(id) {
    const res = await fetch(`${API_BASE}/products/${id}`);
    return await res.json();
  },

  async createProduct(data) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  async updateProduct(id, data) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  async deleteProduct(id) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
    });
    return await res.json();
  },

  // Orders
  async getOrders() {
    const res = await fetch(`${API_BASE}/orders`);
    return await res.json();
  },

  async createOrder(data) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  async updateOrderStatus(id, status) {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    return await res.json();
  },

  async deleteOrder(id) {
    const res = await fetch(`${API_BASE}/orders/${id}`, {
      method: 'DELETE',
    });
    return await res.json();
  },

  // Reviews
  async getReviews(productId) {
    const url = productId ? `${API_BASE}/reviews?productId=${productId}` : `${API_BASE}/reviews`;
    const res = await fetch(url);
    return await res.json();
  },

  async createReview(data) {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return await res.json();
  },

  async deleteReview(id) {
    const res = await fetch(`${API_BASE}/reviews/${id}`, {
      method: 'DELETE',
    });
    return await res.json();
  },

  // Admin Auth
  async login(username, password) {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return await res.json();
  },

  // Reset
  async resetData() {
    const res = await fetch(`${API_BASE}/reset-data`, {
      method: 'POST',
    });
    return await res.json();
  }
};

