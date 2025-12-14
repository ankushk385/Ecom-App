const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const { orderSchema } = require("../validation/orderValidation");

const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = orderSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { userId, items, coupon, useWallet } = req.body;

  try {
    let total = items.reduce((s, i) => s + i.qty * i.price, 0);

    let discount = 0;
    if (coupon) {
      if (coupon === "WELCOME10") discount = Math.min(10, total * 0.1);
      if (coupon === "FLAT50") discount = 50;
    }
    total = total - discount;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (useWallet) {
      const take = Math.min(user.wallet, total);
      total = total - take;
      user.wallet -= take;
      await user.save();
    }

    for (const it of items) {
      const p = await Product.findById(it.product);
      if (!p) return res.status(400).json({ error: "Product not found" });
      if (p.stock < it.qty)
        return res
          .status(400)
          .json({ error: `Insufficient stock for ${p.title}` });
      p.stock -= it.qty;
      await p.save();
    }

    const order = new Order({ user: userId, items, total, status: "success" });
    await order.save();
    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).populate(
      "items.product"
    );
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
