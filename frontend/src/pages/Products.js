import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Products({ api, user }) {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [view, setView] = useState(null);

  const fetch = async () => {
    const res = await axios.get(api + "/products", { params: { q, category } });
    setProducts(res.data.products || []);
  };

  useEffect(() => {
    fetch();
  }, []);

  const remove = async (id) => {
    if (!window.confirm("Delete?")) return;
    await axios.delete(api + "/products/" + id);
    fetch();
  };

  const update = async (p) => {
    const title = prompt("New title", p.title);
    if (!title) return;
    await axios.put(api + "/products/" + p._id, { ...p, title });
    fetch();
  };

  const addToCart = (p) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push({ product: p._id, title: p.title, price: p.price, qty: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
  };

  return (
    <div>
      <h2>Products</h2>
      <div style={{ marginBottom: 12 }}>
        <input
          placeholder="Search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button onClick={fetch}>Search</button>
      </div>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Image</th> {/* ADDED */}
            <th>Title</th>
            <th>Price</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>
                {p.image ? (
                  <img
                    src={`${api}/uploads/${p.image}`}
                    width={60}
                    height={60}
                    style={{ objectFit: "cover", borderRadius: 4 }}
                  />
                ) : (
                  "No Image"
                )}
              </td>

              <td>{p.title}</td>
              <td>{p.price}</td>
              <td>{p.category}</td>
              <td>{p.stock}</td>

              <td>
                <button onClick={() => setView(p)}>View</button>
                <button onClick={() => update(p)}>Update</button>
                <button onClick={() => remove(p._id)}>Delete</button>
                <button onClick={() => addToCart(p)}>Add to cart</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {view && (
        <div style={{ border: "1px solid #ccc", padding: 12, marginTop: 12 }}>
          <h3>{view.title}</h3>
          <p>{view.description}</p>
          <button onClick={() => setView(null)}>Close</button>
        </div>
      )}
    </div>
  );
}
