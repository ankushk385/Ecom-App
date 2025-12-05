const express = require('express');
const bcrypt = require('bcryptjs');
const Seller = require('../models/Seller');
const Product = require('../models/Product');
const { productSchema } = require('../validation/productValidation');

const router = express.Router();

// Seller register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if(!username || !email || !password) return res.status(400).json({ error: 'Missing fields' });
    let exists = await Seller.findOne({ $or: [{username}, {email}] });
    if (exists) return res.status(400).json({ error: 'Seller already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const s = new Seller({ username, email, password: hashed });
    await s.save();
    res.json({ seller: { id: s._id, username: s.username, email: s.email } });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// Seller login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const s = await Seller.findOne({ username });
    if(!s) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, s.password);
    if(!ok) return res.status(400).json({ error: 'Invalid credentials' });
    res.json({ seller: { id: s._id, username: s.username } });
  } catch(err){ res.status(500).json({ error: err.message }); }
});

// Add product
router.post('/product', async (req, res) => {
  const { error } = productSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  try {
    // For simplicity: expect sellerId in body
    const { sellerId, title, description, category, price, stock } = req.body;
    const p = new Product({ seller: sellerId, title, description, category, price, stock });
    await p.save();
    res.json({ product: p });
  } catch(err) { res.status(500).json({ error: err.message }); }
});

// List seller products
router.get('/:sellerId/products', async (req, res) => {
  try {
    const products = await Product.find({ seller: req.params.sellerId });
    res.json({ products });
  } catch(err){ res.status(500).json({ error: err.message }); }
});

module.exports = router;
