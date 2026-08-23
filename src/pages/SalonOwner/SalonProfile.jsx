import { useEffect, useState } from "react";
import { Camera, MapPin, Save, Store } from "lucide-react";
import {
  createSalon,
  getMySalon,
  updateSalon,
  uploadSalonProfileImage,
} from "../../services/salonService";

const emptyForm = {
  name: "",
  about: "",
  address: "",
  area: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
  email: "",
};

export default function SalonProfile() {
  const [formData, setFormData] = useState(emptyForm);
  const [salonExists, setSalonExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("Pending");

  useEffect(() => {
    const fetchSalon = async () => {
      try {
        setLoading(true);

        const data = await getMySalon();
        const salon = data.salon;

        setSalonExists(true);

        setFormData({
          name: salon.name || "",
          about: salon.about || "",
          address: salon.location?.address || "",
          area: salon.location?.area || "",
          city: salon.location?.city || "",
          state: salon.location?.state || "",
          pincode: salon.location?.pincode || "",
          phone: salon.phone || "",
          email: salon.email || "",
        });
        setProfileImage(salon.profileImage || "");
        setApprovalStatus(salon.approvalStatus || "Pending");
      } catch (error) {
        if (error.response?.status === 404) {
          setSalonExists(false);
          setFormData(emptyForm);
        } else {
          console.error("Failed to load salon:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSalon();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    try {
      setUploadingImage(true);

      const data = await uploadSalonProfileImage(file);

      setProfileImage(data.salon.profileImage || "");

      alert("Salon profile photo updated successfully.");
    } catch (error) {
      console.error("Salon image upload error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to upload salon image. Please try again.",
      );
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const salonData = {
        name: formData.name,
        about: formData.about,
        location: {
          address: formData.address,
          area: formData.area,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        phone: formData.phone,
        email: formData.email,
      };

      const data = salonExists
        ? await updateSalon(salonData)
        : await createSalon(salonData);

      setSalonExists(true);

      setFormData({
        name: data.salon.name || "",
        about: data.salon.about || "",
        address: data.salon.location?.address || "",
        area: data.salon.location?.area || "",
        city: data.salon.location?.city || "",
        state: data.salon.location?.state || "",
        pincode: data.salon.location?.pincode || "",
        phone: data.salon.phone || "",
        email: data.salon.email || "",
      });

      setApprovalStatus(data.salon.approvalStatus || "Pending");

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

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-gray-500">Loading salon information...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-purple-600">
          Salon Profile
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">My Salon</h1>

        <p className="mt-2 text-gray-500">
          Manage your salon's basic information and location.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        {/* Approval Status */}
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Approval Status
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your salon's current approval status on SalonHub.
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
                approvalStatus === "Approved"
                  ? "bg-green-100 text-green-700"
                  : approvalStatus === "Rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {approvalStatus}
            </span>
          </div>

          <div className="mt-5 rounded-2xl bg-gray-50 p-4">
            {approvalStatus === "Pending" && (
              <p className="text-sm leading-6 text-gray-600">
                Your salon profile has been submitted and is waiting for admin
                approval. It will not appear publicly on SalonHub until it is
                approved.
              </p>
            )}

            {approvalStatus === "Approved" && (
              <p className="text-sm leading-6 text-gray-600">
                Your salon has been approved by SalonHub. You can now manage
                your salon and make it visible to customers.
              </p>
            )}

            {approvalStatus === "Rejected" && (
              <p className="text-sm leading-6 text-gray-600">
                Your salon profile was rejected by the admin. Please review your
                information and contact SalonHub support.
              </p>
            )}
          </div>
        </section>

        {/* Salon Profile Photo */}
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <Camera size={21} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Salon Profile Photo
              </h2>

              <p className="text-sm text-gray-500">
                Add a photo that represents your salon.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center gap-5 sm:flex-row">
            <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Salon"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Store size={42} className="text-gray-400" />
              )}
            </div>

            <div>
              <label
                htmlFor="salon-profile-image"
                className={`inline-flex cursor-pointer items-center gap-2 rounded-full bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 ${
                  uploadingImage ? "pointer-events-none opacity-60" : ""
                }`}
              >
                <Camera size={18} />

                {uploadingImage ? "Uploading..." : "Upload Photo"}
              </label>

              <input
                id="salon-profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploadingImage}
              />

              <p className="mt-3 text-sm text-gray-500">
                JPG, PNG or WebP. Choose a clear photo of your salon.
              </p>
            </div>
          </div>
        </section>

        {/* Basic Information */}

        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
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
                required
                placeholder="Enter salon name"
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
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
                rows={5}
                placeholder="Describe your salon, services and experience..."
                className="mt-2 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
              />
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
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
                placeholder="Full salon address"
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
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
                placeholder="e.g. MP Nagar"
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
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
                placeholder="e.g. Bhopal"
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
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
                placeholder="e.g. Madhya Pradesh"
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
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
                placeholder="e.g. 462011"
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
              />
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Contact Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Contact details customers can use to reach your salon.
            </p>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Phone Number
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Salon phone number"
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Salon email"
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-purple-600 focus:ring-2 focus:ring-purple-100"
              />
            </div>
          </div>
        </section>

        {/* Save */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-full bg-purple-600 px-8 py-3.5 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={19} />

            {saving
              ? "Saving..."
              : salonExists
                ? "Save Changes"
                : "Create Salon Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
