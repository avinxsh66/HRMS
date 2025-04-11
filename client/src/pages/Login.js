import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  // ✅ Add background image class only on login page
  useEffect(() => {
    document.body.classList.add('login-bg');
    return () => {
      document.body.classList.remove('login-bg');
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://hrms-project-lx63.onrender.com', { email, password });
      localStorage.setItem('token', res.data.token);  // ✅ Store token
      localStorage.setItem('email', res.data.email);  // ✅ Store email for Home.js
      setMsg(res.data.message);
      window.location.href = '/home';
    } catch (err) {
      setMsg(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2>HRMS</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          className="login-input"
          placeholder="Your Email Id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="login-input"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-button">Login</button>
        <p>{msg}</p>
      </form>
      <p className="register-link">
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
}

export default Login;
