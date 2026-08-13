import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
} from "../../services/authService";

const compressProfileImage = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const MAX_SIZE = 500;

      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_SIZE) {
          height = Math.round((height * MAX_SIZE) / width);
          width = MAX_SIZE;
        }
      } else {
        if (height > MAX_SIZE) {
          width = Math.round((width * MAX_SIZE) / height);
          height = MAX_SIZE;
        }
      }

      const canvas = document.createElement("canvas");

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(objectUrl);

          if (!blob) {
            reject(new Error("Image compression failed."));
            return;
          }

          const compressedFile = new File([blob], "profile-image.webp", {
            type: "image/webp",
            lastModified: Date.now(),
          });

          resolve(compressedFile);
        },
        "image/webp",
        0.8,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Unable to process image."));
    };

    img.src = objectUrl;
  });
};

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editFullName, setEditFullName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const compressedImage = await compressProfileImage(file);

      console.log("Original image:", (file.size / 1024).toFixed(2), "KB");

      console.log(
        "Compressed image:",
        (compressedImage.size / 1024).toFixed(2),
        "KB",
      );

      setSelectedImage(compressedImage);
    } catch (error) {
      console.error("Image compression failed:", error);
    }

    e.target.value = "";
  };

  const handleEditProfile = () => {
    setEditFullName(profile?.fullName || "");
    setEditEmail(profile?.email || "");
    setSelectedImage(null);
    setIsEditing(true);
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      return;
    }

    const data = await uploadProfileImage(selectedImage);

    setProfile(data.user);
    updateUser(data.user);
    setSelectedImage(null);
  };

  const handleSaveProfile = async () => {
    try {
      setSavingProfile(true);

      const data = await updateProfile({
        fullName: editFullName,
        email: editEmail,
      });

      let updatedUser = data.user;

      if (selectedImage) {
        const imageData = await uploadProfileImage(selectedImage);

        updatedUser = imageData.user;
      }

      setProfile(updatedUser);
      updateUser(updatedUser);

      setSelectedImage(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setSavingProfile(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();

        setProfile(data.user);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.location.replace("/");
  };

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading profile...</p>;
  }

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        boxSizing: "border-box",
        padding: "40px 16px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          padding: "20px",
          boxSizing: "border-box",
          border: "1px solid #ddd",
          borderRadius: "10px",
        }}
      >
        <h1 className="text-3xl font-bold text-center mb-6">My Profile</h1>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "3px solid #7c3aed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f3f4f6",
            }}
          >
            {selectedImage ? (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Selected Profile"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : profile?.profileImage ? (
              <img
                src={profile.profileImage}
                alt="Profile"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <span
                style={{
                  fontSize: "42px",
                  color: "#9ca3af",
                }}
              >
                👤
              </span>
            )}
          </div>
          {isEditing && (
            <>
              <input
                type="file"
                accept="image/*"
                id="profileImageInput"
                style={{ display: "none" }}
                disabled={savingProfile}
                onChange={handleImageChange}
              />
              <button
                type="button"
                disabled={savingProfile}
                onClick={() =>
                  document.getElementById("profileImageInput").click()
                }
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: savingProfile ? "#9ca3af" : "#2563eb",
                  color: "white",
                  cursor: savingProfile ? "not-allowed" : "pointer",
                }}
              >
                {savingProfile ? "Saving..." : "Change Photo"}
              </button>
            </>
          )}
        </div>

        <div style={{ marginTop: "20px" }}>
          {isEditing ? (
            <div>
              <label>
                <strong>Full Name:</strong>
              </label>

              <input
                value={editFullName}
                onChange={(e) => setEditFullName(e.target.value)}
                style={{
                  display: "block",
                  marginTop: "8px",
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
          ) : (
            <p>
              <strong>Full Name:</strong> {profile?.fullName}
            </p>
          )}

          <p>
            <strong>Phone:</strong> {profile?.phone}
          </p>

          {isEditing ? (
            <div style={{ marginTop: "15px" }}>
              <label>
                <strong>Email:</strong>
              </label>

              <input
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                style={{
                  display: "block",
                  marginTop: "8px",
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
          ) : (
            <p>
              <strong>Email:</strong> {profile?.email || "Not Provided"}
            </p>
          )}

          <p>
            <strong>Role:</strong> {profile?.role}
          </p>
        </div>

        <div
          className="flex justify-center"
          style={{
            marginTop: "30px",
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            width: "100%",
          }}
        >
          {isEditing ? (
            <>
              <button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: savingProfile ? "#9ca3af" : "#16a34a",
                  color: "white",
                  cursor: savingProfile ? "not-allowed" : "pointer",
                  flex: "1 1 180px",
                }}
              >
                {savingProfile ? "Saving..." : "Save Changes"}
              </button>

              <button
                onClick={() => {
                  setSelectedImage(null);
                  setIsEditing(false);
                }}
                disabled={savingProfile}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#6b7280",
                  color: "white",
                  cursor: savingProfile ? "not-allowed" : "pointer",
                  flex: "1 1 180px",
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEditProfile}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#2563eb",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
