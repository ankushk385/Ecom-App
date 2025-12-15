import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Signup({ setUser, api }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const res = await axios.post(api + "/auth/register", form);
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/products");
    } catch (err) {
      setErr(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: 420, width: "100%" }}>
        <h2 className="text-center mb-4">Sign Up</h2>

        <form onSubmit={submit}>
          <div className="mb-3">
            <input
              className="form-control"
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <input
              className="form-control"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <input
              className="form-control"
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button className="btn btn-primary w-100" type="submit">
            Sign Up
          </button>
        </form>

        <p className="text-center mt-3">
          Already have an account? <Link to="/login">Login</Link>
        </p>

        {err && <p className="text-danger text-center mt-3">{err}</p>}
      </div>
    </div>
  );
}
