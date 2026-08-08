import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.location.replace("/");
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
      }}
    >
      <h1>My Profile</h1>

      <div style={{ marginTop: "20px" }}>
        <p>
          <strong>Full Name:</strong> {user?.fullName}
        </p>

        <p>
          <strong>Phone:</strong> {user?.phone}
        </p>

        <p>
          <strong>Email:</strong> {user?.email || "Not Provided"}
        </p>

        <p>
          <strong>Role:</strong> {user?.role}
        </p>
      </div>

      <div style={{ marginTop: "30px" }}>
        <button
          onClick={() => navigate("/my-bookings")}
          style={{
            marginRight: "10px",
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#7c3aed",
            color: "white",
            cursor: "pointer",
          }}
        >
          My Bookings
        </button>

        <button
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#ef4444",
            color: "white",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
