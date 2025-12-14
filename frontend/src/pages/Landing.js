import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="container mt-5 text-center">
      <h1 className="display-4 mb-3">Welcome to Ecom Demo</h1>
      <p className="lead mb-4">
        Your one-stop demo ecommerce site. Explore amazing products, add to
        cart, and place orders easily!
      </p>
      <div className="d-flex justify-content-center gap-3 flex-wrap">
        <Link to="/products">
          <button className="btn btn-primary btn-lg"> Browse Products</button>
        </Link>
        <button className="btn btn-outline-primary btn-lg">Sign Up Now</button>
      </div>
      <div className="mt-5">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMyw0auaky4uvCpD1PLRw-yVPn61e5TMgpxw&s"
          className="img-fluid rounded shadow-sm"
          alt="Banner"
        />
      </div>
    </div>
  );
}
