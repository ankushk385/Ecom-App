import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Products({ api, user }) {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [view, setView] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [newTitle, setNewTitle] = useState("");

  const fetch = async () => {
    const res = await axios.get(api + "/products", { params: { q } });
    setProducts(res.data.products || []);
  };

  useEffect(() => {
    fetch();
  }, []);

  const openEditModal = (p) => {
    setEditProduct(p);
    setNewTitle(p.title);
  };

  const saveEdit = async () => {
    await axios.put(`${api}/products/${editProduct._id}`, {
      ...editProduct,
      title: newTitle,
    });
    setEditProduct(null);
    fetch();
  };

  const openDeleteModal = (p) => setDeleteProduct(p);

  const confirmDelete = async () => {
    await axios.delete(`${api}/products/${deleteProduct._id}`);
    setDeleteProduct(null);
    fetch();
  };

  const addToCart = (p) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push({ product: p._id, title: p.title, price: p.price, qty: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    toast.success(`${p.title} added to cart`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Products</h2>
      <div className="mb-4 d-flex gap-2">
        <input
          className="form-control"
          placeholder="Search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="btn btn-primary" onClick={fetch}>
          Search
        </button>
      </div>

      <div className="row g-3">
        {products.map((p) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={p._id}>
            <div className="card h-100 shadow-sm">
              {p.image ? (
                <img
                  src={`${process.env.REACT_APP_API_URL}/uploads/${p.image}`}
                  className="card-img-top"
                  style={{ objectFit: "cover", height: 200 }}
                  alt={p.title}
                />
              ) : (
                <div
                  className="card-img-top d-flex align-items-center justify-content-center bg-light"
                  style={{ height: 200 }}
                >
                  No Image
                </div>
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{p.title}</h5>
                <p className="card-text mb-1">Price: ${p.price}</p>
                <p className="card-text mb-1">Category: {p.category}</p>
                <p className="card-text mb-2">Stock: {p.stock}</p>
                <div className="mt-auto d-flex flex-wrap gap-1">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setView(p)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => openEditModal(p)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => openDeleteModal(p)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => addToCart(p)}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {view && (
        <div
          className="modal d-block"
          tabIndex="-1"
          onClick={() => setView(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{view.title}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setView(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>{view.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {editProduct && (
        <div
          className="modal d-block"
          tabIndex="-1"
          onClick={() => setEditProduct(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Product</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditProduct(null)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  className="form-control mb-3"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <button className="btn btn-primary w-100" onClick={saveEdit}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteProduct && (
        <div
          className="modal d-block"
          tabIndex="-1"
          onClick={() => setDeleteProduct(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Product</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDeleteProduct(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete{" "}
                  <strong>{deleteProduct.title}</strong>?
                </p>
                <button
                  className="btn btn-danger w-100"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
