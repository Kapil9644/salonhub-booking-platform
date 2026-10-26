import { useEffect, useState } from "react";
import {
  Camera,
  CheckCircle2,
  Edit3,
  Eye,
  EyeOff,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Save,
  Store,
  XCircle,
} from "lucide-react";

import {
  createSalon,
  getMySalon,
  updateSalon,
  uploadSalonProfileImage,
  uploadSalonGalleryImages,
  deleteSalonGalleryImage,
} from "../../services/salonService";

const emptyForm = {
  name: "",
  about: "",
  address: "",
  area: "",
  city: "",
  state: "",
  pincode: "",
  latitude: null,
  longitude: null,
  phone: "",
  email: "",
};

export default function SalonProfile() {
  const [formData, setFormData] = useState(emptyForm);

  const [salonExists, setSalonExists] = useState(false);
  const [salon, setSalon] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profileImage, setProfileImage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [approvalStatus, setApprovalStatus] = useState("Not Created");
  const [isListed, setIsListed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [deletingImageId, setDeletingImageId] = useState(null);

  useEffect(() => {
    const fetchSalon = async () => {
      try {
        setLoading(true);

        const data = await getMySalon();
        const currentSalon = data.salon;

        setSalon(currentSalon);
        setSalonExists(true);

        setFormData({
          name: currentSalon.name || "",
          about: currentSalon.about || "",
          address: currentSalon.location?.address || "",
          area: currentSalon.location?.area || "",
          city: currentSalon.location?.city || "",
          state: currentSalon.location?.state || "",
          pincode: currentSalon.location?.pincode || "",
          latitude: currentSalon.location?.latitude ?? null,
          longitude: currentSalon.location?.longitude ?? null,
          phone: currentSalon.phone || "",
          email: currentSalon.email || "",
        });

        setProfileImage(currentSalon.profileImage || "");
        setApprovalStatus(currentSalon.approvalStatus || "Pending");
        setIsListed(Boolean(currentSalon.isListed));
        setIsOpen(Boolean(currentSalon.isOpen));
      } catch (error) {
        if (error.response?.status === 404) {
          setSalon(null);
          setSalonExists(false);
          setFormData(emptyForm);
          setApprovalStatus("Not Created");
          setIsEditing(true);
        } else {
          console.error("Failed to load salon:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSalon();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Location is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setFormData((current) => ({
          ...current,
          latitude,
          longitude,
        }));

        alert("Current location captured successfully.");
      },
      (error) => {
        console.error("Location error:", error);

        if (error.code === 1) {
          alert(
            "Location permission was denied. Please allow location access.",
          );
        } else if (error.code === 2) {
          alert("Your location could not be detected. Please try again.");
        } else if (error.code === 3) {
          alert("Location request timed out. Please try again.");
        } else {
          alert("Unable to get your current location.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const handleCancel = () => {
    if (salon) {
      setFormData({
        name: salon.name || "",
        about: salon.about || "",
        address: salon.location?.address || "",
        area: salon.location?.area || "",
        city: salon.location?.city || "",
        state: salon.location?.state || "",
        pincode: salon.location?.pincode || "",
        latitude: salon.location?.latitude ?? null,
        longitude: salon.location?.longitude ?? null,
        phone: salon.phone || "",
        email: salon.email || "",
      });

      setProfileImage(salon.profileImage || "");
    }

    setSelectedImage(null);
    setImagePreview("");
    setIsEditing(false);
  };

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      event.target.value = "";
      return;
    }

    setSelectedImage(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    event.target.value = "";
  };

  const handleGallerySelect = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = "";

    if (selectedFiles.length === 0) return;

    const invalidFile = selectedFiles.find(
      (file) => !file.type.startsWith("image/"),
    );

    if (invalidFile) {
      alert("Please select valid image files only.");
      return;
    }

    const existingCount = salon?.galleryImages?.length || 0;
    const pendingCount = galleryFiles.length;
    const availableSlots = 10 - existingCount - pendingCount;

    if (availableSlots <= 0) {
      alert("Your gallery can contain a maximum of 10 images.");
      return;
    }

    const acceptedFiles = selectedFiles.slice(0, availableSlots);

    if (acceptedFiles.length < selectedFiles.length) {
      alert(`You can select only ${availableSlots} more image(s).`);
    }

    setGalleryFiles((current) => [...current, ...acceptedFiles]);

    setGalleryPreviews((current) => [
      ...current,
      ...acceptedFiles.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const removePendingGalleryImage = (index) => {
    URL.revokeObjectURL(galleryPreviews[index]);

    setGalleryFiles((current) =>
      current.filter((_, fileIndex) => fileIndex !== index),
    );

    setGalleryPreviews((current) =>
      current.filter((_, previewIndex) => previewIndex !== index),
    );
  };

  const handleGalleryUpload = async () => {
    if (!salonExists || galleryFiles.length === 0) return;

    try {
      setGalleryUploading(true);

      const response = await uploadSalonGalleryImages(galleryFiles);

      const updatedSalon = response.salon;

      setSalon(updatedSalon);
      setGalleryFiles([]);
      galleryPreviews.forEach((url) => URL.revokeObjectURL(url));
      setGalleryPreviews([]);

      alert("Gallery images uploaded successfully.");
    } catch (error) {
      console.error("Gallery upload failed:", error);

      alert(
        error.response?.data?.message ||
          "Failed to upload gallery images. Please try again.",
      );
    } finally {
      setGalleryUploading(false);
    }
  };

  const handleGalleryDelete = async (imageId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this gallery image?",
    );

    if (!confirmed) return;

    try {
      setDeletingImageId(imageId);

      const response = await deleteSalonGalleryImage(imageId);

      setSalon(response.salon);

      alert("Gallery image deleted successfully.");
    } catch (error) {
      console.error("Gallery image deletion failed:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete the image. Please try again.",
      );
    } finally {
      setDeletingImageId(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      alert("Salon name is required.");
      return;
    }

    try {
      setSaving(true);

      const salonData = {
        name: formData.name.trim(),
        about: formData.about.trim(),
        location: {
          address: formData.address.trim(),
          area: formData.area.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
          latitude: formData.latitude,
          longitude: formData.longitude,
        },
        phone: formData.phone.trim(),
        email: formData.email.trim(),
      };

      // Save salon information first
      const data = salonExists
        ? await updateSalon(salonData)
        : await createSalon(salonData);

      let updatedSalon = data.salon;

      setSalon(updatedSalon);
      setSalonExists(true);

      // Upload selected image only after Save Changes
      if (selectedImage) {
        const imageData = await uploadSalonProfileImage(selectedImage);

        updatedSalon = imageData.salon;

        setSalon(updatedSalon);
        setProfileImage(updatedSalon.profileImage || "");

        setSelectedImage(null);
        setImagePreview("");
      } else {
        setProfileImage(updatedSalon.profileImage || "");
      }

      setFormData({
        name: updatedSalon.name || "",
        about: updatedSalon.about || "",
        address: updatedSalon.location?.address || "",
        area: updatedSalon.location?.area || "",
        city: updatedSalon.location?.city || "",
        state: updatedSalon.location?.state || "",
        pincode: updatedSalon.location?.pincode || "",
        phone: updatedSalon.phone || "",
        email: updatedSalon.email || "",
      });

      setApprovalStatus(updatedSalon.approvalStatus || "Pending");
      setIsListed(Boolean(updatedSalon.isListed));
      setIsOpen(Boolean(updatedSalon.isOpen));

      setIsEditing(false);

      alert(
        salonExists
          ? "Salon profile updated successfully."
          : "Salon profile created successfully.",
      );
    } catch (error) {
      console.error("Save salon error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to save salon information. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const getApprovalStyles = () => {
    if (approvalStatus === "Approved") {
      return {
        wrapper: "bg-green-100 text-green-700",
        icon: <CheckCircle2 size={16} />,
      };
    }

    if (approvalStatus === "Rejected") {
      return {
        wrapper: "bg-red-100 text-red-700",
        icon: <XCircle size={16} />,
      };
    }

    return {
      wrapper: "bg-yellow-100 text-yellow-700",
      icon: <span className="h-2 w-2 rounded-full bg-yellow-500" />,
    };
  };

  const approvalStyles = getApprovalStyles();

  const getLocationText = () => {
    const parts = [
      formData.area,
      formData.city,
      formData.state,
      formData.pincode,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(", ") : "Location not added";
  };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
            Rupiva for Business
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">My Salon</h1>

          <p className="mt-2 text-gray-500">
            Manage your salon's business information.
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <p className="text-gray-500">Loading salon information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      {/* Page Header */}
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
          Rupiva for Business
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">My Salon</h1>

        <p className="mt-2 text-gray-500">
          Manage your salon's business information and public details.
        </p>
      </div>

      {/* Salon Header Card */}
      <section className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-gray-50 px-5 py-6 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Salon Identity */}
            <div className="flex min-w-0 items-center gap-4 sm:gap-5">
              {/* TOP IMAGE - NO CAMERA BUTTON */}
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-purple-100 shadow-sm sm:h-28 sm:w-28">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={formData.name || "Salon"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Store size={42} className="text-purple-500" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="whitespace-nowrap text-xl font-bold text-slate-900 sm:text-2xl">
                  {formData.name || "Your Salon"}
                </h2>

                <div className="mt-1 flex items-start gap-1.5 text-sm text-gray-500">
                  <MapPin size={16} className="mt-0.5 shrink-0" />

                  <span className="line-clamp-2">{getLocationText()}</span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${approvalStyles.wrapper}`}
                  >
                    {approvalStyles.icon}

                    {approvalStatus === "Pending"
                      ? "Pending Approval"
                      : approvalStatus}
                  </span>

                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                      isListed
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {isListed ? <Eye size={14} /> : <EyeOff size={14} />}

                    {isListed ? "Listed" : "Hidden"}
                  </span>

                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                      isOpen
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isOpen ? "bg-green-600" : "bg-gray-500"
                      }`}
                    />

                    {isOpen ? "Open" : "Closed"}
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            {!isEditing && salonExists && (
              <button
                type="button"
                onClick={handleEdit}
                className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-purple-300 px-5 py-3 font-semibold text-purple-700 transition hover:bg-purple-50 sm:w-auto"
              >
                <Edit3 size={18} />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Approval Message */}
        <div className="border-b border-gray-100 px-5 py-5 sm:px-8">
          {approvalStatus === "Pending" && (
            <p className="text-sm leading-6 text-gray-600">
              Your salon profile is waiting for admin approval. Customers will
              not be able to see your salon until it has been approved.
            </p>
          )}

          {approvalStatus === "Approved" && (
            <p className="text-sm leading-6 text-gray-600">
              Your salon has been approved. You can manage your salon
              information and visibility from this dashboard.
            </p>
          )}

          {approvalStatus === "Rejected" && (
            <p className="text-sm leading-6 text-gray-600">
              Your salon application was rejected. Please review your salon
              information and contact Rupiva support.
            </p>
          )}
        </div>
      </section>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Basic Information */}
        <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <Store size={21} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Basic Information
              </h2>

              <p className="text-sm text-gray-500">
                Tell customers about your salon.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Salon Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                required
                placeholder="Enter salon name"
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100 disabled:cursor-not-allowed disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                About Salon
              </label>

              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                disabled={!isEditing}
                rows={5}
                placeholder="Describe your salon, services and experience..."
                className="mt-2 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100 disabled:cursor-not-allowed disabled:bg-gray-50"
              />
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <MapPin size={21} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Salon Location
              </h2>

              <p className="text-sm text-gray-500">
                Add your salon's location details.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-gray-700">
                Address
              </label>

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Full salon address"
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100 disabled:cursor-not-allowed disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Area
              </label>

              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="e.g. MP Nagar"
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100 disabled:cursor-not-allowed disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                City
              </label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="e.g. Bhopal"
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100 disabled:cursor-not-allowed disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                State
              </label>

              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="e.g. Madhya Pradesh"
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100 disabled:cursor-not-allowed disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Pincode
              </label>

              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="e.g. 462011"
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100 disabled:cursor-not-allowed disabled:bg-gray-50"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={!isEditing}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-purple-300 bg-purple-50 px-4 py-3 text-sm font-semibold text-purple-700 transition hover:bg-purple-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                <Navigation size={17} />
                Use My Current Location
              </button>

              {formData.latitude !== null && formData.longitude !== null && (
                <p className="mt-2 text-xs text-gray-500">
                  Location coordinates captured successfully.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <Phone size={21} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Contact Information
              </h2>

              <p className="text-sm text-gray-500">
                Contact details customers can use to reach your salon.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Phone size={16} />
                Phone Number
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Salon phone number"
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100 disabled:cursor-not-allowed disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Mail size={16} />
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Salon email"
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100 disabled:cursor-not-allowed disabled:bg-gray-50"
              />
            </div>
          </div>
        </section>

        {/* Salon Profile Photo */}
        <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <Camera size={21} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Salon Profile Photo
              </h2>

              <p className="text-sm text-gray-500">
                Use a clear photo that represents your salon.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center">
            {/* Bottom Photo Preview */}
            <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
              {imagePreview || profileImage ? (
                <img
                  src={imagePreview || profileImage}
                  alt={formData.name || "Salon"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Store size={42} className="text-gray-400" />
              )}
            </div>

            {/* Change Photo */}
            <div className="min-w-0">
              <label
                htmlFor="salon-profile-image"
                className={`inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 sm:w-auto ${
                  !isEditing
                    ? "pointer-events-none cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
              >
                <Camera size={18} />
                Change Photo
              </label>

              <input
                id="salon-profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                disabled={!isEditing}
                className="hidden"
              />

              <p className="mt-3 text-sm leading-5 text-gray-500">
                JPG, PNG or WebP. Choose a clear photo of your salon.
              </p>

              {selectedImage && (
                <p className="mt-2 text-sm font-medium text-purple-600">
                  New photo selected. Click Save Changes to upload it.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Salon Photo Gallery */}
        {salonExists && (
          <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Salon Photo Gallery
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Add photos of your salon interior, chairs, services and
                  facilities.
                </p>
              </div>

              <span className="w-fit rounded-full bg-purple-50 px-3 py-1 text-sm font-semibold text-purple-700">
                {(salon?.galleryImages?.length || 0) + galleryFiles.length}/10
                photos
              </span>
            </div>

            <div className="mt-5">
              <label
                htmlFor="salon-gallery-images"
                className={`inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-purple-200 px-5 py-3 font-semibold text-purple-700 transition hover:bg-purple-50 sm:w-auto ${
                  galleryUploading ||
                  (salon?.galleryImages?.length || 0) + galleryFiles.length >=
                    10
                    ? "pointer-events-none opacity-50"
                    : ""
                }`}
              >
                <Camera size={18} />
                Select Gallery Photos
              </label>

              <input
                id="salon-gallery-images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleGallerySelect}
                disabled={
                  galleryUploading ||
                  (salon?.galleryImages?.length || 0) + galleryFiles.length >=
                    10
                }
                className="hidden"
              />

              <p className="mt-2 text-xs text-gray-500">
                Select multiple images. Maximum 10 gallery photos per salon.
              </p>
            </div>

            {(salon?.galleryImages?.length > 0 ||
              galleryPreviews.length > 0) && (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {(salon?.galleryImages || []).map((image) => (
                  <div
                    key={image._id || image.publicId}
                    className="group relative overflow-hidden rounded-xl border border-gray-200"
                  >
                    <img
                      src={image.url}
                      alt="Salon gallery"
                      className="h-32 w-full object-cover sm:h-40"
                    />

                    <button
                      type="button"
                      onClick={() => handleGalleryDelete(image._id)}
                      disabled={Boolean(deletingImageId) || galleryUploading}
                      aria-label="Delete gallery image"
                      className="absolute right-2 top-2 rounded-full bg-white/95 p-2 text-red-600 shadow transition hover:bg-red-50 disabled:opacity-50"
                    >
                      {deletingImageId === image._id ? (
                        <span className="text-xs">...</span>
                      ) : (
                        <XCircle size={19} />
                      )}
                    </button>
                  </div>
                ))}

                {galleryPreviews.map((preview, index) => (
                  <div
                    key={preview}
                    className="relative overflow-hidden rounded-xl border border-dashed border-purple-300"
                  >
                    <img
                      src={preview}
                      alt={`Selected gallery photo ${index + 1}`}
                      className="h-32 w-full object-cover sm:h-40"
                    />

                    <button
                      type="button"
                      onClick={() => removePendingGalleryImage(index)}
                      disabled={galleryUploading}
                      aria-label="Remove selected photo"
                      className="absolute right-2 top-2 rounded-full bg-white/95 p-2 text-red-600 shadow hover:bg-red-50 disabled:opacity-50"
                    >
                      <XCircle size={19} />
                    </button>

                    <span className="absolute bottom-0 left-0 right-0 bg-purple-700/90 px-2 py-1 text-center text-xs font-medium text-white">
                      Pending upload
                    </span>
                  </div>
                ))}
              </div>
            )}

            {galleryFiles.length > 0 && (
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={handleGalleryUpload}
                  disabled={galleryUploading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  <Save size={18} />
                  {galleryUploading
                    ? "Uploading Photos..."
                    : `Upload ${galleryFiles.length} Photo(s)`}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    galleryPreviews.forEach((url) => URL.revokeObjectURL(url));
                    setGalleryFiles([]);
                    setGalleryPreviews([]);
                  }}
                  disabled={galleryUploading}
                  className="w-full rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 sm:w-auto"
                >
                  Clear Selected
                </button>
              </div>
            )}
          </section>
        )}

        {/* Actions */}
        {isEditing && salonExists && (
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 px-7 py-3.5 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-7 py-3.5 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <Save size={19} />

              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}

        {/* Create Salon */}
        {/* Create Salon */}
        {!salonExists && (
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-7 py-3.5 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <Save size={19} />

              {saving ? "Creating..." : "Create Salon Profile"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
