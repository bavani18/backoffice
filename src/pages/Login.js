import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { BASE_URL } from "../config/api";
// ✅ image import (src/assets)
import cafeImg from "../assets/usg1.png";

{/* <h3 className="brand-name">SmartCafe</h3> */}

function Login() {
  const navigate = useNavigate();
 

  // ✅ form state (missing in your code)
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  // ✅ input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ submit
  const handleSubmit = async (e) => {
  e.preventDefault();

  console.log("Username:", form.username);
  console.log("Password:", form.password);

  try {
    const res = await fetch(`${BASE_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: form.username,
        password: form.password,
      }),
    });

    const data = await res.json();

    if (data.success) {
      // ✅ store user
      localStorage.setItem("user", JSON.stringify(data.user));
 
       // 🔥 ADD THIS LINE (IMPORTANT)
        localStorage.setItem("userId", data.user.UserId);

        console.log("Saved UserId:", data.user.UserId); 
      // ✅ navigate
      navigate("/home");
    } else {
      alert(data.message || "Invalid Username ❌");
    }

  } catch (err) {
    console.log(err);
    alert("Server error ❌");
  }
};

  return (
  <div className="login-page">
    <div className="login-wrapper">
      <div className="login-card">

        <div className="login-brand-container">
  <img src={cafeImg} alt="Cafe" className="login-logo" />
  <h3 className="login-brand-name">SmartCafe</h3>
</div>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            name="username"
            placeholder="Enter Username"
            value={form.username}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
          />

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

      </div>
    </div>
  </div>
);
}

export default Login;
