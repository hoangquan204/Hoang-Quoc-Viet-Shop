import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialData } from './initialData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initialize DB if not present
function getDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('Error reading DB:', err);
    return initialData;
  }
}

function saveDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing DB:', err);
    return false;
  }
}

// ------------------- ADMIN AUTH -------------------
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin') {
    return res.json({
      success: true,
      token: 'admin-auth-token-valid',
      user: {
        username: 'admin',
        role: 'Administrator',
        displayName: 'Quản trị viên Hệ Thống'
      }
    });
  }
  return res.status(401).json({
    success: false,
    message: 'Tài khoản hoặc mật khẩu không chính xác! (Mặc định: admin / admin)'
  });
});

// ------------------- SITE INFO -------------------
app.get('/api/site-info', (req, res) => {
  const db = getDB();
  res.json(db.siteInfo || {});
});

app.put('/api/site-info', (req, res) => {
  const db = getDB();
  db.siteInfo = {
    ...db.siteInfo,
    ...req.body
  };
  saveDB(db);
  res.json({ success: true, siteInfo: db.siteInfo });
});

// ------------------- PRODUCTS -------------------
app.get('/api/products', (req, res) => {
  const db = getDB();
  res.json(db.products || []);
});

app.get('/api/products/:id', (req, res) => {
  const db = getDB();
  const product = (db.products || []).find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
  }
  res.json(product);
});

app.post('/api/products', (req, res) => {
  const db = getDB();
  const newProduct = {
    id: 'prod-' + Date.now(),
    rating: 5.0,
    reviewCount: 0,
    soldCount: 0,
    ...req.body
  };
  db.products = db.products || [];
  db.products.push(newProduct);
  saveDB(db);
  res.json({ success: true, product: newProduct });
});

app.put('/api/products/:id', (req, res) => {
  const db = getDB();
  const idx = (db.products || []).findIndex(p => p.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
  }
  db.products[idx] = {
    ...db.products[idx],
    ...req.body
  };
  saveDB(db);
  res.json({ success: true, product: db.products[idx] });
});

app.delete('/api/products/:id', (req, res) => {
  const db = getDB();
  db.products = (db.products || []).filter(p => p.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, message: 'Đã xóa sản phẩm' });
});

// ------------------- ORDERS -------------------
app.get('/api/orders', (req, res) => {
  const db = getDB();
  res.json(db.orders || []);
});

app.post('/api/orders', (req, res) => {
  const db = getDB();
  const newOrder = {
    id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
    createdAt: new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
    status: 'Chờ xác nhận',
    ...req.body
  };
  db.orders = db.orders || [];
  db.orders.unshift(newOrder); // newest first

  // Increment sold count for the product
  if (newOrder.productId) {
    const prod = (db.products || []).find(p => p.id === newOrder.productId);
    if (prod) {
      prod.soldCount = (prod.soldCount || 0) + (newOrder.quantity || 1);
    }
  }

  saveDB(db);
  res.json({ success: true, order: newOrder });
});

app.put('/api/orders/:id/status', (req, res) => {
  const db = getDB();
  const order = (db.orders || []).find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
  }
  order.status = req.body.status || order.status;
  saveDB(db);
  res.json({ success: true, order });
});

app.delete('/api/orders/:id', (req, res) => {
  const db = getDB();
  db.orders = (db.orders || []).filter(o => o.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, message: 'Đã xóa đơn hàng' });
});

// ------------------- REVIEWS -------------------
app.get('/api/reviews', (req, res) => {
  const db = getDB();
  let reviews = db.reviews || [];
  if (req.query.productId) {
    reviews = reviews.filter(r => r.productId === req.query.productId);
  }
  res.json(reviews);
});

app.post('/api/reviews', (req, res) => {
  const db = getDB();
  const newReview = {
    id: 'rev-' + Date.now(),
    date: new Date().toISOString().split('T')[0],
    likes: 1,
    verified: true,
    ...req.body
  };
  db.reviews = db.reviews || [];
  db.reviews.unshift(newReview);

  // Recalculate product review count & average rating
  const prod = (db.products || []).find(p => p.id === newReview.productId);
  if (prod) {
    const prodReviews = db.reviews.filter(r => r.productId === prod.id);
    prod.reviewCount = prodReviews.length;
    const avg = prodReviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) / prodReviews.length;
    prod.rating = parseFloat(avg.toFixed(1));
  }

  saveDB(db);
  res.json({ success: true, review: newReview });
});

app.delete('/api/reviews/:id', (req, res) => {
  const db = getDB();
  db.reviews = (db.reviews || []).filter(r => r.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, message: 'Đã xóa đánh giá' });
});

// ------------------- RESET DATA -------------------
app.post('/api/reset-data', (req, res) => {
  saveDB(initialData);
  res.json({ success: true, message: 'Đã khôi phục dữ liệu ban đầu thành công' });
});

// Serve frontend in production
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    // If it's an API route that wasn't handled, return 404
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ message: 'API route not found' });
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
