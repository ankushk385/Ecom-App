const express = require("express");
const Product = require("../models/Product");
const upload = require("../middlewears/upload");
const { productSchema } = require("../validation/productValidation");

const router = express.Router();

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { error } = productSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const body = req.body;

    if (req.file) {
      body.image = req.file.filename;
    }

    const product = new Product(body);
    await product.save();

    res.json({ product });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
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

router.get("/:id", async (req, res) => {
  try {
    const p = await Product.findById(req.params.id);
    if (!p) return res.status(404).json({ error: "Not found" });

    res.json({ product: p });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { error } = productSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const body = req.body;

    if (req.file) {
      body.image = req.file.filename;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, body, {
      new: true,
    });

    res.json({ product: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
