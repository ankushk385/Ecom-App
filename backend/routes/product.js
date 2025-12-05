const express = require("express");
const Product = require("../models/Product");
const { productSchema } = require("../validation/productValidation");

const router = express.Router();

// Create product (seller)
router.post("/", async (req, res) => {
  console.log("this ran in products");
  const { error } = productSchema.validate(req.body);

  if (error) return res.status(400).json({ error: error.details[0].message });
  try {
    const p = new Product(req.body);
    await p.save();
    res.json({ product: p });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List all products with optional search & category filter
router.get("/", async (req, res) => {
  console.log("this ran in products");
  const { q, category } = req.query;
  const filter = {};
  if (q) filter.title = new RegExp(q, "i");
  if (category) filter.category = category;
  try {
    const products = await Product.find(filter).limit(200);
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Single product
router.get("/:id", async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ error: "Not found" });
    res.json({ product: p });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
router.put("/:id", async (req, res) => {
  try {
    const { error } = productSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ product: p });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
