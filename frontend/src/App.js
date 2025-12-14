import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Products from "./pages/Products";
import CreateProduct from "./pages/CreateProduct";
import Cart from "./pages/Cart";
import ProtectedRoute from "./pages/ProtectedRoute";

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          Ecomm
        </Link>
        <ul className="navbar-nav ms-auto d-flex align-items-center">
          {user ? (
            <>
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/products">
                  Products
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/create">
                  Create Product
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/cart">
                  Cart
                </Link>
              </li>
              <li className="nav-item">
                <span className="nav-link disabled">Hi, {user.username}</span>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-outline-danger btn-sm ms-2"
                  onClick={onLogout}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/login">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-dark" to="/signup">
                  Sign up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

function AppRoutes({ user, setUser }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/products" replace />
              ) : (
                <Login setUser={setUser} api="http://localhost:5000/api" />
              )
            }
          />
          <Route
            path="/signup"
            element={
              user ? (
                <Navigate to="/products" replace />
              ) : (
                <Signup setUser={setUser} api="http://localhost:5000/api" />
              )
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute user={user}>
                <Products api="http://localhost:5000/api" user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute user={user}>
                <CreateProduct api="http://localhost:5000/api" user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute user={user}>
                <Cart api="http://localhost:5000/api" user={user} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default function App() {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <BrowserRouter>
      <AppRoutes user={user} setUser={setUser} />
    </BrowserRouter>
  );
}
