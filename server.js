require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

// Middlewares & Routes Imports
const securityMiddleware = require('./middleware/security');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Express Body Parsers & Cookie Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Security Middleware (Custom security.js file එක)
app.use(securityMiddleware);

// Session Management
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Passport Setup
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');

// Static Files Serve කිරීම (Public & Views folders සදහා)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

// Template Engine Configuration (HTML Render කිරීම සදහා)
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// ─── HTML Page Routing System ───
const viewsPath = path.join(__dirname, 'views');

// Helper to send HTML file with error logging
function sendHTML(res, fileName) {
  const filePath = path.join(viewsPath, fileName);
  console.log(`Serving: ${filePath}`);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(`Error serving ${fileName}:`, err);
      res.status(404).send(`Page not found: ${fileName}`);
    }
  });
}

// Pages Routes
app.get('/', (req, res) => sendHTML(res, '1_index.html'));
app.get('/login', (req, res) => sendHTML(res, '2_auth_login.html'));
app.get('/register', (req, res) => sendHTML(res, '3_auth_register.html'));
app.get('/marketplace', (req, res) => sendHTML(res, '4_marketplace.html'));
app.get('/order', (req, res) => sendHTML(res, '5_order.html'));
app.get('/profile', (req, res) => sendHTML(res, '6_user_profile.html'));
app.get('/my-orders', (req, res) => sendHTML(res, '7_user_orders.html'));
app.get('/terms', (req, res) => sendHTML(res, '8_terms.html'));
app.get('/privacy', (req, res) => sendHTML(res, '9_privacy.html'));

// Secret Admin Hub Route (Original Path)
app.get('/secret-malindu-admin-hub-x99', (req, res) => sendHTML(res, '10_secret_admin_dashboard.html'));

// Test Route
app.get('/test', (req, res) => res.send('✅ Server is alive!'));

// Catch-All 404 Route
app.use((req, res) => {
  res.status(404).send('404 Page Not Found');
});

app.listen(PORT, () => console.log(`✅ ApexWeb running smoothly on http://localhost:${PORT}`));