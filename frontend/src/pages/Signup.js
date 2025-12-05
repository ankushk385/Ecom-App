import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Signup({setUser, api}){
  const [form, setForm] = useState({username:'', email:'', password:'', confirm:''});
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (form.password !== form.confirm) return setErr('Passwords do not match');
    try {
      const res = await axios.post(api + '/auth/register', { username: form.username, email: form.email, password: form.password });
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/products');
    } catch(err){
      setErr(err.response?.data?.error || err.message);
    }
  };

  return (
    <div style={{maxWidth:420}}>
      <h2>Sign up</h2>
      <form onSubmit={submit}>
        <input placeholder="Username" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} required/><br/>
        <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/><br/>
        <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/><br/>
        <input placeholder="Confirm Password" type="password" value={form.confirm} onChange={e=>setForm({...form,confirm:e.target.value})} required/><br/>
        <button type="submit">Sign up</button>
      </form>
      {err && <p style={{color:'red'}}>{err}</p>}
    </div>
  );
}
