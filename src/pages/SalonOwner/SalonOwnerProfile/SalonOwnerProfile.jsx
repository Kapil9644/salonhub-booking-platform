import { useEffect, useState } from "react";
import {
  Camera,
  Edit3,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Store,
  User,
} from "lucide-react";

import {
  getSalonOwnerProfile,
  updateSalonOwnerProfile,
  uploadSalonOwnerProfileImage,
} from "../../../services/salonOwnerService";

import { getMySalon } from "../../../services/salonService";

import { useSalonOwnerAuth } from "../../../context/SalonOwnerAuthContext";

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

          const compressedFile = new File(
            [blob],
            "salon-owner-profile-image.webp",
            {
              type: "image/webp",
              lastModified: Date.now(),
            },
          );

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

export default function SalonOwnerProfile() {
  const { updateSalonOwner } = useSalonOwnerAuth();

  const [profile, setProfile] = useState(null);
  const [salon, setSalon] = useState(null);

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [editFullName, setEditFullName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);

        // Fetch owner profile independently
        const profileData = await getSalonOwnerProfile();

        if (profileData.user?.role !== "salon") {
          throw new Error("This account is not a Salon Owner account.");
        }

        setProfile(profileData.user);
        updateSalonOwner(profileData.user);

        // Fetch salon separately.
        // A 404 is expected when the owner has not created a salon yet.
        try {
          const salonData = await getMySalon();
          setSalon(salonData.salon || null);
        } catch (salonError) {
          if (salonError.response?.status === 404) {
            setSalon(null);
          } else {
            console.error("Failed to fetch salon:", salonError);
            setSalon(null);
          }
        }
      } catch (error) {
        console.error("Failed to fetch salon owner profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [updateSalonOwner]);

  const handleEditProfile = () => {
    setEditFullName(profile?.fullName || "");
    setEditEmail(profile?.email || "");
    setSelectedImage(null);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview("");
    }

    setIsEditing(true);
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const compressedImage = await compressProfileImage(file);

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      const previewUrl = URL.createObjectURL(compressedImage);

      setSelectedImage(compressedImage);
      setImagePreview(previewUrl);
    } catch (error) {
      console.error("Image compression failed:", error);

      alert("Unable to process the selected image.");
    }

    event.target.value = "";
  };

  const handleSaveProfile = async () => {
    if (!editFullName.trim()) {
      alert("Full name is required.");
      return;
    }

    try {
      setSavingProfile(true);

      const profileData = await updateSalonOwnerProfile({
        fullName: editFullName.trim(),
        email: editEmail.trim(),
      });

      let updatedUser = profileData.user;

      if (selectedImage) {
        const imageData = await uploadSalonOwnerProfileImage(selectedImage);

        updatedUser = imageData.user;
      }

      if (updatedUser?.role !== "salon") {
        throw new Error("Invalid Salon Owner profile.");
      }

      setProfile(updatedUser);
      updateSalonOwner(updatedUser);

      setSelectedImage(null);

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview("");
      }

      setIsEditing(false);

      alert("Profile updated successfully.");
    } catch (error) {
      console.error("Failed to save salon owner profile:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to update profile.",
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    setSelectedImage(null);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview("");
    }

    setIsEditing(false);
  };

  const getSalonLocation = () => {
    if (!salon?.location) {
      return "Location not set";
    }

    const parts = [
      salon.location.area,
      salon.location.city,
      salon.location.state,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(", ") : "Location not set";
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
            SalonHub for Business
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Owner Profile
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your personal information and account details.
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Page Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
          SalonHub for Business
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Owner Profile
        </h1>

        <p className="mt-2 text-gray-500">
          Manage your personal information and account details.
        </p>
      </div>

      {/* Main Profile Card */}
      <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        {/* Profile Header */}
        <div className="border-b border-gray-100 bg-gray-50 px-6 py-8 sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            {" "}
            <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-5">
              {" "}
              {/* Profile Image */}
              <div className="relative shrink-0">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-purple-100 shadow-sm sm:h-28 sm:w-28">
                  {" "}
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Selected profile"
                      className="h-full w-full object-cover"
                    />
                  ) : profile?.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt={profile?.fullName || "Salon Owner"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User size={48} className="text-purple-500" />
                  )}
                </div>

                {isEditing && (
                  <>
                    <input
                      type="file"
                      id="salonOwnerProfileImageInput"
                      accept="image/*"
                      className="hidden"
                      disabled={savingProfile}
                      onChange={handleImageChange}
                    />

                    <button
                      type="button"
                      disabled={savingProfile}
                      onClick={() =>
                        document
                          .getElementById("salonOwnerProfileImageInput")
                          ?.click()
                      }
                      className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-purple-600 text-white shadow-sm transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                      aria-label="Change profile photo"
                    >
                      <Camera size={17} />
                    </button>
                  </>
                )}
              </div>
              {/* Owner Details */}
              <div className="min-w-0 flex-1">
                <h2 className="whitespace-nowrap text-xl font-bold text-slate-900 sm:text-2xl">
                  {profile?.fullName || "Salon Owner"}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Personal account profile
                </p>

                <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                  Salon Owner
                </span>
              </div>
            </div>
            {/* Edit Button */}
            {!isEditing && (
              <button
                type="button"
                onClick={handleEditProfile}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-purple-300 px-5 py-3 font-semibold text-purple-700 transition hover:bg-purple-50 sm:w-auto"
              >
                <Edit3 size={18} />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Personal Information */}
        <div className="p-6 sm:p-8">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Full Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <User size={17} />
                Full Name
              </label>

              {isEditing ? (
                <input
                  type="text"
                  value={editFullName}
                  onChange={(event) => setEditFullName(event.target.value)}
                  disabled={savingProfile}
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-gray-100"
                />
              ) : (
                <p className="mt-2 rounded-xl bg-gray-50 px-4 py-3 text-gray-800">
                  {profile?.fullName || "Not provided"}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Phone size={17} />
                Phone Number
              </label>

              <p className="mt-2 rounded-xl bg-gray-50 px-4 py-3 text-gray-800">
                {profile?.phone || "Not provided"}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Phone number cannot be changed here.
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Mail size={17} />
                Email Address
              </label>

              {isEditing ? (
                <input
                  type="email"
                  value={editEmail}
                  onChange={(event) => setEditEmail(event.target.value)}
                  disabled={savingProfile}
                  placeholder="Enter your email address"
                  className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-gray-100"
                />
              ) : (
                <p className="mt-2 rounded-xl bg-gray-50 px-4 py-3 text-gray-800">
                  {profile?.email || "Not provided"}
                </p>
              )}
            </div>

            {/* Account Type */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <ShieldCheck size={17} />
                Account Type
              </label>

              <p className="mt-2 rounded-xl bg-gray-50 px-4 py-3 font-medium text-purple-700">
                Salon Owner
              </p>
            </div>
          </div>

          {/* Salon Information */}
          <div className="my-8 border-t border-gray-100" />

          <div className="grid gap-6 md:grid-cols-2">
            {/* Salon Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Store size={17} />
                Salon Name
              </label>

              <p className="mt-2 rounded-xl bg-gray-50 px-4 py-3 text-gray-800">
                {salon?.name || "Salon profile not created"}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                This is your salon/business name.
              </p>
            </div>

            {/* Salon Location */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <MapPin size={17} />
                Salon Location
              </label>

              <p className="mt-2 rounded-xl bg-gray-50 px-4 py-3 text-gray-800">
                {getSalonLocation()}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                This is your salon/business location.
              </p>
            </div>
          </div>

          {/* Verification */}
          <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={21}
                className={
                  profile?.isVerified
                    ? "mt-0.5 text-green-600"
                    : "mt-0.5 text-gray-400"
                }
              />

              <div>
                <h3 className="font-semibold text-slate-900">
                  Account Verification
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {profile?.isVerified
                    ? "Your account is verified."
                    : "Your account is not verified yet."}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Actions */}
          {isEditing && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={savingProfile}
                className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingProfile ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
