import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";

const Home = () => {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    contact: "",
    location: "",
    empId: "",
    title: "",
    joiningDate: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    photo: ""
  });

  const [originalData, setOriginalData] = useState({});
  const email = localStorage.getItem("email");

  useEffect(() => {
    if (!email) return (window.location.href = "/");

    axios
      .get(`http://localhost:5000/employee/${email}`)
      .then((res) => {
        console.log("✅ Employee fetched:", res.data);
        setFormData(res.data);
        setOriginalData(res.data);
      })
      .catch((err) => {
        console.error("❌ Failed to load data:", err);
        alert("Failed to load data");
      });
  }, [email]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!email) {
      alert("User not logged in");
      return;
    }

    const updatedFields = {
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      photo: formData.photo
    };

    axios
      .put(`http://localhost:5000/employee/update`, {
        email,
        ...updatedFields
      })
      .then((res) => {
        alert(res.data.message || "Saved successfully");
        setOriginalData({ ...originalData, ...updatedFields });
      })
      .catch((err) => {
        console.error("❌ Save failed:", err);
        alert("Failed to save");
      });
  };

  const handleCancel = () => {
    setFormData(originalData);
  };

  return (
    <div className="home-container">
      <div className="top-section">
        <div className="top-left">
          <span className="icon" onClick={() => window.location.reload()}>
            🏠
          </span>
          <span
            className="logout-text"
            onClick={() => {
              localStorage.removeItem("email");
              window.location.href = "/";
            }}
          >
            Logout
          </span>
        </div>
        <button className="privileged-btn">Privileged User</button>
      </div>

      <div className="tab-bar">
        {[
          "Employee Data", "View Compensation", "View Benefits", "Time Entry (weekly)",
          "View Projects", "View Payslips", "View Tax Summary", "Work Login"
        ].map((tab, index) => (
          <button key={index} className={`tab ${index === 0 ? "active" : ""}`}>
            {tab}
          </button>
        ))}
      </div>

      <h2 className="title">View Employee Data</h2>

      <div className="employee-section">
        <div className="employee-card">
          <h3>Basic Details</h3>
          <div className="input-group">
            <label>Employee Name:</label>
            <input name="name" value={formData.name} readOnly />
          </div>
          <div className="input-group">
            <label>Employment Type:</label>
            <input name="type" value={formData.type} readOnly />
          </div>
          <div className="input-group">
            <label>Contact Number:</label>
            <input name="contact" value={formData.contact} readOnly />
          </div>
          <div className="input-group">
            <label>Job Location:</label>
            <input name="location" value={formData.location} readOnly />
          </div>
        </div>

        <div className="employee-card">
          <h3>Job Details</h3>
          <div className="input-group">
            <label>Employee ID:</label>
            <input name="empId" value={formData.empId} readOnly />
          </div>
          <div className="input-group">
            <label>Job Title:</label>
            <input name="title" value={formData.title} readOnly />
          </div>
          <div className="input-group">
            <label>Date of Joining:</label>
            <input type="date" name="joiningDate" value={formData.joiningDate} readOnly />
          </div>
        </div>
      </div>

      <div className="bottom-section">
        <div className="address-section">
          <h3>Address:</h3>
          <input name="address" value={formData.address} onChange={handleChange} placeholder="Street Address" />
          <input name="city" value={formData.city} onChange={handleChange} placeholder="City" />
          <input name="state" value={formData.state} onChange={handleChange} placeholder="State" />
          <input name="zip" value={formData.zip} onChange={handleChange} placeholder="ZIP Code" />
          <div className="btns">
            <button className="submit" onClick={handleSave}>Save</button>
            <button className="cancel" onClick={handleCancel}>Cancel</button>
          </div>
        </div>

        <div className="upload-section">
          <div className="upload-box">
            <label htmlFor="imageUpload" style={{ cursor: 'pointer', display: 'block', marginBottom: '10px' }}>
              📸 Click to upload image
            </label>

            {formData.photo && (
              <img
                src={`http://localhost:5000${formData.photo}`}
                alt="Uploaded"
                style={{ width: "150px", display: "block", marginBottom: "10px" }}
              />
            )}

            <input
              type="file"
              id="imageUpload"
              accept=".png,.jpeg,.jpg"
              style={{ display: 'block' }}
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const form = new FormData();
                form.append('photo', file);

                try {
                  const res = await axios.post('http://localhost:5000/upload/photo', form, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                  });

                  const photoPath = res.data.path;
                  setFormData({ ...formData, photo: photoPath });

                  await axios.put('http://localhost:5000/employee/update', {
                    email,
                    address: formData.address,
                    photo: photoPath
                  });

                  alert('Photo uploaded successfully');
                } catch (err) {
                  alert(err.response?.data?.message || 'Upload failed');
                }
              }}
            />

            {formData.photo && (
              <p style={{ marginTop: '10px' }}>
                📎 <a
                  href={`http://localhost:5000${formData.photo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {formData.photo.split('/').pop()}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
