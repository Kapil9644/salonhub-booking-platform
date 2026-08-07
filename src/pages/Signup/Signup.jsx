import { useState } from "react";
import { registerUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await registerUser(formData);

      login(data.user, data.token);

      alert("Registration Successful 🎉");

      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h1>SalonHub Signup</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name</label>
          <br />
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              marginTop: "5px",
            }}
          />
        </div>

        <br />

        <div>
          <label>Phone Number</label>
          <br />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              marginTop: "5px",
            }}
          />
        </div>

        <br />

        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              marginTop: "5px",
            }}
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              marginTop: "5px",
            }}
          />
        </div>

        <br />

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
