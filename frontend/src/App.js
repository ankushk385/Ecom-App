import React, {useState, useEffect} from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Products from './pages/Products';
import CreateProduct from './pages/CreateProduct';
import Cart from './pages/Cart';

const API = process.env.REACT_APP_API || 'http://localhost:5000/api';

function Navbar({user, onLogout}) {
  return (
    <nav style={{display:'flex',gap:16,padding:12,justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid #ddd'}}>
      <div><Link to="/">Ecom</Link></div>
      <div style={{display:'flex',gap:12,alignItems:'center'}}>
        <Link to="/products">Products</Link>
        <Link to="/create">Create Product</Link>
        <Link to="/cart">Cart</Link>
        {user ? (
          <>
            <span>Hi, {user.username}</span>
            <button onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default function App(){
  const [user, setUser] = useState(()=> JSON.parse(localStorage.getItem('user') || 'null'));

  const handleLogout = ()=> {
    setUser(null);
    localStorage.removeItem('user');
  };

  useEffect(()=> {
    if (user) localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={handleLogout} />
      <div style={{padding:20}}>
        <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/signup" element={<Signup setUser={setUser} api={API}/>} />
          <Route path="/login" element={<Login setUser={setUser} api={API}/>} />
          <Route path="/products" element={<Products api={API} user={user}/>} />
          <Route path="/create" element={<CreateProduct api={API} user={user}/>} />
          <Route path="/cart" element={<Cart api={API} user={user}/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
