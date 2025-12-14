import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Cart({ api, user }) {
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState("");
  const [useWallet, setUseWallet] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart") || "[]"));
  }, []);

  const placeOrder = async () => {
    if (!user) return alert("Login required");
    const items = cart.map((c) => ({
      product: c.product,
      qty: c.qty,
      price: c.price,
    }));
    try {
      const res = await axios.post(api + "/orders", {
        userId: user.id,
        items,
        coupon,
        useWallet,
      });
      setMessage("Order placed: " + res.data.order._id);
      localStorage.removeItem("cart");
      setCart([]);
    } catch (err) {
      setMessage(err.response?.data?.error || err.message);
    }
  };

  const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Title</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((c, i) => (
                <tr key={i}>
                  <td>{c.title}</td>
                  <td>{c.qty}</td>
                  <td>${c.price}</td>
                  <td>${c.qty * c.price}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="3" className="text-end fw-bold">
                  Total:
                </td>
                <td className="fw-bold">${total}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="d-flex gap-2 flex-wrap mb-3">
        <input
          className="form-control w-auto"
          placeholder="Coupon code"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
        />
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={useWallet}
            onChange={(e) => setUseWallet(e.target.checked)}
            id="walletCheck"
          />
          <label className="form-check-label" htmlFor="walletCheck">
            Use Wallet
          </label>
        </div>
      </div>

      <button
        className="btn btn-success"
        onClick={placeOrder}
        disabled={cart.length === 0}
      >
        Place Order
      </button>
      {message && <div className="alert alert-info mt-3">{message}</div>}
    </div>
  );
}
