import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
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
  );
};

export default Profile;
