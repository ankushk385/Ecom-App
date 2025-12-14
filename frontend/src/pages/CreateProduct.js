import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateProduct({ api, user }) {
  const [form, setForm] = useState({
    title: "",
    price: 0,
    description: "",
    category: "",
    stock: 0,
    image: null,
  });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Login required to create product");

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("stock", form.stock);
      formData.append("seller", user.id);

      if (form.image) formData.append("image", form.image);

      await axios.post(api + "/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product created successfully");
      navigate("/products");
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: 600 }}>
      <h2 className="mb-3">Create Product</h2>
      <form onSubmit={submit} className="d-flex flex-column gap-3">
        <input
          className="form-control"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          className="form-control"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: parseFloat(e.target.value) })
          }
          required
        />
        <input
          className="form-control"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <textarea
          className="form-control"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          className="form-control"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) =>
            setForm({ ...form, stock: parseInt(e.target.value) })
          }
          required
        />
        <input
          className="form-control"
          type="file"
          accept="image/*"
          onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
        />
        <button type="submit" className="btn btn-primary">
          Create
        </button>
      </form>
    </div>
  );
}
