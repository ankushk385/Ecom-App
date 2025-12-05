const express = require("express");
const bcrypt = require("bcryptjs");
const { registerSchema, loginSchema } = require("../validation/authValidation");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { username, email, password } = req.body;
  try {
    let exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) return res.status(400).json({ error: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashed,
      wallet: 100,
      coupons: [{ code: "WELCOME10", discount: 10 }],
    });
    await user.save();
    const safe = {
      id: user._id,
      username: user.username,
      email: user.email,
      wallet: user.wallet,
      coupons: user.coupons,
    };
    res.json({ user: safe });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User login
router.post("/login", async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });
    const safe = {
      id: user._id,
      username: user.username,
      email: user.email,
      wallet: user.wallet,
      coupons: user.coupons,
    };
    res.json({ user: safe });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
