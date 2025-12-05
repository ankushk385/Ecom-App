import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login({setUser, api}){
  const [form, setForm] = useState({username:'', password:''});
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await axios.post(api + '/auth/login', form);
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/products');
    } catch(err){
      setErr(err.response?.data?.error || err.message);
    }
  };

  return (
    <div style={{maxWidth:420}}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input placeholder="Username" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} required/><br/>
        <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/><br/>
        <button type="submit">Login</button>
      </form>
      {err && <p style={{color:'red'}}>{err}</p>}
    </div>
  );
}
