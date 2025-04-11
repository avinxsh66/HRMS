import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    type: '',
    contact: '',
    location: '',
    empId: '',
    title: '',
    joiningDate: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const {
      email, password, name, type, contact, location,
      empId, title, joiningDate, address, city, state, zip
    } = formData;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !email || !password || !name || !type || !contact || !location ||
      !empId || !title || !joiningDate || !address || !city || !state || !zip
    ) {
      alert('❗ Please fill in all fields');
      return false;
    }

    if (!emailPattern.test(email)) {
      alert('❗ Please enter a valid email address');
      return false;
    }

    if (password.length < 6) {
      alert('❗ Password must be at least 6 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const res = await axios.post('http://localhost:5000/register', formData);
      alert(res.data.message);
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="login-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <input name="email" className="login-input" placeholder="Email" value={formData.email} onChange={handleChange} />
        <input name="password" className="login-input" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />
        <input name="name" className="login-input" placeholder="Employee Name" value={formData.name} onChange={handleChange} />
        <input name="type" className="login-input" placeholder="Employment Type" value={formData.type} onChange={handleChange} />
        <input name="contact" className="login-input" placeholder="Contact Number" value={formData.contact} onChange={handleChange} />
        <input name="location" className="login-input" placeholder="Job Location" value={formData.location} onChange={handleChange} />
        <input name="empId" className="login-input" placeholder="Employee ID" value={formData.empId} onChange={handleChange} />
        <input name="title" className="login-input" placeholder="Job Title" value={formData.title} onChange={handleChange} />
        <input name="joiningDate" className="login-input" type="date" value={formData.joiningDate} onChange={handleChange} />
        <input name="address" className="login-input" placeholder="Address" value={formData.address} onChange={handleChange} />
        <input name="city" className="login-input" placeholder="City" value={formData.city} onChange={handleChange} />
        <input name="state" className="login-input" placeholder="State" value={formData.state} onChange={handleChange} />
        <input name="zip" className="login-input" placeholder="ZIP" value={formData.zip} onChange={handleChange} />
        <button type="submit" className="login-button">Register</button>
      </form>
    </div>
  );
}

export default Register;
