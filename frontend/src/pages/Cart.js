import React, {useState, useEffect} from 'react';
import axios from 'axios';

export default function Cart({api, user}){
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState('');
  const [useWallet, setUseWallet] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(()=> {
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
  }, []);

  const placeOrder = async ()=> {
    if (!user) return alert('Login required');
    const items = cart.map(c=> ({ product: c.product, qty: c.qty, price: c.price }));
    try {
      const res = await axios.post(api + '/orders', { userId: user.id, items, coupon, useWallet });
      setMessage('Order placed: ' + res.data.order._id);
      localStorage.removeItem('cart');
      setCart([]);
    } catch(err){
      setMessage(err.response?.data?.error || err.message);
    }
  };

  return (
    <div>
      <h2>Cart</h2>
      <ul>
        {cart.map((c,i)=> <li key={i}>{c.title} - {c.qty} x {c.price}</li>)}
      </ul>
      <div>
        <input placeholder="Coupon code" value={coupon} onChange={e=>setCoupon(e.target.value)}/>
        <label><input type="checkbox" checked={useWallet} onChange={e=>setUseWallet(e.target.checked)}/> Use wallet</label>
      </div>
      <button onClick={placeOrder}>Place order</button>
      {message && <p>{message}</p>}
    </div>
  );
}
