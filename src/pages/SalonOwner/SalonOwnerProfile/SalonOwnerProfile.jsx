import { useCallback, useEffect, useState } from "react";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  CircleUserRound,
  Clock3,
  Edit3,
  FileCheck2,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Store,
  User,
  X,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  getSalonOwnerProfile,
  updateSalonOwnerProfile,
  uploadSalonOwnerProfileImage,
} from "../../../services/salonOwnerService";
import { getMySalon } from "../../../services/salonService";
import { useSalonOwnerAuth } from "../../../context/SalonOwnerAuthContext";

const compressProfileImage = (file) =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      const maxSize = 600;
      const ratio = Math.min(1, maxSize / Math.max(image.width, image.height));

      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * ratio);
      canvas.height = Math.round(image.height * ratio);

      const context = canvas.getContext("2d");

      if (!context) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Unable to process the selected image."));
        return;
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(objectUrl);

          if (!blob) {
            reject(new Error("Image compression failed."));
            return;
          }

          resolve(
            new File([blob], "salon-owner-profile-image.webp", {
              type: "image/webp",
              lastModified: Date.now(),
            }),
          );
        },
        "image/webp",
        0.82,
      );
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Unable to read this image."));
    };

    image.src = objectUrl;
  });

function getErrorMessage(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

function SectionHeading({ icon: Icon, title, description }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
        <Icon size={20} />
      </div>

      <div className="min-w-0">
        <h2 className="text-base font-bold text-slate-900 sm:text-lg">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm leading-5 text-slate-500">{description}</p>
        )}
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  editing,
  onChange,
  disabled,
  type = "text",
  hint,
  placeholder,
  required = false,
}) {
  return (
    <div className="min-w-0">
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        <Icon size={16} className="shrink-0 text-purple-600" />
        {label}
        {editing && required && <span className="text-red-500">*</span>}
      </label>

      {editing ? (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          required={required}
          maxLength={type === "text" ? 100 : undefined}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          autoComplete={
            label === "Full Name"
              ? "name"
              : label === "Email Address"
                ? "email"
                : "off"
          }
          className="mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 disabled:cursor-not-allowed disabled:bg-slate-100"
        />
      ) : (
        <div className="mt-2 flex min-h-12 items-center break-words rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-800 [overflow-wrap:anywhere]">
          {value || "Not provided"}
        </div>
      )}

      {hint && <p className="mt-2 text-xs leading-5 text-slate-500">{hint}</p>}
    </div>
  );
}

function StatusBadge({ verified }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
        verified
          ? "bg-emerald-100 text-emerald-700"
          : "bg-amber-100 text-amber-800"
      }`}
    >
      {verified ? <CheckCircle2 size={14} /> : <Clock3 size={14} />}
      {verified ? "Verified" : "Verification pending"}
    </span>
  );
}

function LoadingSkeleton() {
  return (
    <div className="mx-auto w-full max-w-6xl animate-pulse space-y-6">
      <div className="h-36 rounded-3xl bg-slate-200" />
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <div className="h-8 w-48 rounded-lg bg-slate-200" />
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-20 rounded-xl bg-slate-100" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SalonOwnerProfile() {
  const navigate = useNavigate();
  const { updateSalonOwner } = useSalonOwnerAuth();

  const [profile, setProfile] = useState(null);
  const [salon, setSalon] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [editFullName, setEditFullName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [pageError, setPageError] = useState("");
  const [salonError, setSalonError] = useState("");
  const [notice, setNotice] = useState(null);
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const fetchProfileData = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setPageError("");
      setSalonError("");

      try {
        const profileData = await getSalonOwnerProfile();
        const user = profileData?.user;

        if (!user || user.role !== "salon") {
          throw new Error("This account is not a Salon Owner account.");
        }

        setProfile(user);
        updateSalonOwner(user);

        try {
          const salonData = await getMySalon();
          setSalon(salonData?.salon || null);
        } catch (error) {
          if (error?.response?.status === 404) {
            setSalon(null);
          } else {
            setSalonError(
              getErrorMessage(error, "Unable to load salon information."),
            );
          }
        }
      } catch (error) {
        console.error("Failed to fetch owner profile:", error);
        setPageError(getErrorMessage(error, "Unable to load your profile."));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [updateSalonOwner],
  );

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleEditProfile = () => {
    setEditFullName(profile?.fullName || "");
    setEditEmail(profile?.email || "");
    setSelectedImage(null);
    setImageError("");
    setNotice(null);
    setIsEditing(true);
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Please select a valid image.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setImageError("Image must be smaller than 10 MB.");
      return;
    }

    try {
      setImageError("");

      const compressedImage = await compressProfileImage(file);
      const previewUrl = URL.createObjectURL(compressedImage);

      setImagePreview((previousPreview) => {
        if (previousPreview) {
          URL.revokeObjectURL(previousPreview);
        }
        return previewUrl;
      });

      setSelectedImage(compressedImage);
    } catch (error) {
      console.error("Image processing failed:", error);
      setImageError(
        getErrorMessage(error, "Unable to process the selected image."),
      );
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedImage(null);
    setImageError("");
    setNotice(null);

    setImagePreview((previousPreview) => {
      if (previousPreview) URL.revokeObjectURL(previousPreview);
      return "";
    });
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();

    const fullName = editFullName.trim();
    const email = editEmail.trim();

    if (!fullName) {
      setNotice({
        type: "error",
        message: "Full name is required.",
      });
      return;
    }

    if (fullName.length < 2) {
      setNotice({
        type: "error",
        message: "Please enter a name with at least 2 characters.",
      });
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNotice({
        type: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    setSavingProfile(true);
    setNotice(null);

    try {
      const profileData = await updateSalonOwnerProfile({
        fullName,
        email,
      });

      let updatedUser = profileData?.user;

      if (!updatedUser) {
        throw new Error("Updated profile data was not returned by the server.");
      }

      if (selectedImage) {
        const imageData = await uploadSalonOwnerProfileImage(selectedImage);

        if (!imageData?.user) {
          throw new Error(
            "Profile image was uploaded, but user data was not returned.",
          );
        }

        updatedUser = imageData.user;
      }

      if (updatedUser.role !== "salon") {
        throw new Error("Invalid Salon Owner profile.");
      }

      setProfile(updatedUser);
      updateSalonOwner(updatedUser);
      setIsEditing(false);
      setSelectedImage(null);
      setImageError("");

      setImagePreview((previousPreview) => {
        if (previousPreview) URL.revokeObjectURL(previousPreview);
        return "";
      });

      setNotice({
        type: "success",
        message: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Failed to save owner profile:", error);
      setNotice({
        type: "error",
        message: getErrorMessage(error, "Failed to update profile."),
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const getSalonLocation = () => {
    if (!salon?.location) return "Location not set";

    const parts = [
      salon.location.area,
      salon.location.city,
      salon.location.state,
    ].filter(Boolean);

    return parts.length ? parts.join(", ") : "Location not set";
  };

  if (loading) {
    return (
      <div className="w-full p-4 sm:p-6 lg:p-8">
        <LoadingSkeleton />
      </div>
    );
  }

  if (pageError && !profile) {
    return (
      <div className="mx-auto w-full max-w-4xl p-4 sm:p-6 lg:p-8">
        <div className="rounded-3xl border border-red-200 bg-white p-6 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
            <XCircle size={28} />
          </div>

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Unable to load profile
          </h1>
          <p className="mt-2 break-words text-sm text-slate-600">{pageError}</p>

          <button
            type="button"
            onClick={() => fetchProfileData()}
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const verified = Boolean(profile?.isVerified);

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Page heading */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-purple-600 sm:text-sm">
            <Sparkles size={15} />
            Rupiva for Business
          </p>

          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Owner Profile
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            Manage your personal information, profile photo and account details.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchProfileData(true)}
          disabled={refreshing || savingProfile}
          className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-purple-200 hover:bg-purple-50 disabled:opacity-60 sm:self-auto"
        >
          <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      {pageError && (
        <div
          role="alert"
          className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"
        >
          {pageError}
        </div>
      )}

      {notice && (
        <div
          role={notice.type === "error" ? "alert" : "status"}
          className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
            notice.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {notice.type === "success" ? (
            <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
          ) : (
            <XCircle size={19} className="mt-0.5 shrink-0" />
          )}
          <p className="flex-1 break-words">{notice.message}</p>
          <button
            type="button"
            aria-label="Dismiss message"
            onClick={() => setNotice(null)}
            className="rounded-lg p-1 hover:bg-black/5"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Profile hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-700 via-purple-600 to-fuchsia-600 p-5 text-white shadow-lg shadow-purple-200/50 sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full border-[32px] border-white/10" />
        <div className="pointer-events-none absolute -bottom-24 right-1/3 h-48 w-48 rounded-full bg-fuchsia-400/20 blur-2xl" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative mx-auto shrink-0 sm:mx-0">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white/80 bg-white/20 shadow-xl sm:h-28 sm:w-28">
              {imagePreview || profile?.profileImage ? (
                <img
                  src={imagePreview || profile.profileImage}
                  alt={profile?.fullName || "Salon owner"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User size={46} className="text-white" />
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
                  onClick={() =>
                    document
                      .getElementById("salonOwnerProfileImageInput")
                      ?.click()
                  }
                  disabled={savingProfile}
                  aria-label="Change profile photo"
                  className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-2 border-purple-600 bg-white text-purple-700 shadow-md transition hover:bg-purple-50 disabled:opacity-60"
                >
                  <Camera size={18} />
                </button>
              </>
            )}
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-semibold">
                Salon Owner
              </span>
              <StatusBadge verified={verified} />
            </div>

            <h2 className="mt-3 break-words text-2xl font-extrabold sm:text-3xl">
              {profile?.fullName || "Salon Owner"}
            </h2>

            <p className="mt-2 break-words text-sm text-purple-100">
              {profile?.email || "Email address not provided"}
            </p>

            <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-purple-100 sm:justify-start">
              <Store size={15} />
              <span className="break-words">
                {salon?.name || "Salon profile not created"}
              </span>
            </p>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={handleEditProfile}
              className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/40 bg-white px-5 py-3 text-sm font-bold text-purple-700 shadow-sm transition hover:bg-purple-50"
            >
              <Edit3 size={17} />
              Edit Profile
            </button>
          )}
        </div>

        {imageError && (
          <p
            role="alert"
            className="relative mt-4 rounded-xl bg-red-950/20 p-3 text-sm text-white"
          >
            {imageError}
          </p>
        )}

        {isEditing && (
          <p className="relative mt-4 text-center text-xs text-purple-100 sm:text-left">
            Choose an image up to 10 MB. It will be compressed before upload.
          </p>
        )}
      </section>

      {/* Main information */}
      <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-8">
        <SectionHeading
          icon={CircleUserRound}
          title="Personal Information"
          description="Your personal and account details."
        />

        <form onSubmit={handleSaveProfile}>
          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
            <Field
              icon={User}
              label="Full Name"
              value={isEditing ? editFullName : profile?.fullName}
              editing={isEditing}
              onChange={setEditFullName}
              disabled={savingProfile}
              required
            />

            <Field
              icon={Phone}
              label="Phone Number"
              value={profile?.phone}
              hint="Your phone number cannot be changed here."
            />

            <Field
              icon={Mail}
              label="Email Address"
              value={isEditing ? editEmail : profile?.email}
              editing={isEditing}
              onChange={setEditEmail}
              disabled={savingProfile}
              type="email"
              placeholder="you@example.com"
              hint="Use an email address you can access."
            />

            <Field
              icon={ShieldCheck}
              label="Account Type"
              value="Salon Owner"
            />
          </div>

          <div className="my-8 border-t border-slate-100" />

          <SectionHeading
            icon={Store}
            title="Salon Information"
            description="Business details associated with your owner account."
          />

          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
            <Field
              icon={Store}
              label="Salon Name"
              value={salon?.name || "Salon profile not created"}
              hint="Manage your business name from My Salon."
            />

            <Field
              icon={MapPin}
              label="Salon Location"
              value={getSalonLocation()}
              hint="Manage your business location from My Salon."
            />
          </div>

          {salonError && (
            <div
              role="status"
              className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"
            >
              {salonError}
            </div>
          )}

          {isEditing && (
            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={savingProfile}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                <X size={17} />
                Cancel
              </button>

              <button
                type="submit"
                disabled={savingProfile}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingProfile ? (
                  <>
                    <RefreshCw size={17} className="animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={17} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </section>

      {/* Account verification */}
      <section className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
          <SectionHeading
            icon={ShieldCheck}
            title="Account Verification"
            description="Check the verification status of your account."
          />
        </div>

        <div className="p-5 sm:p-7">
          <div
            className={`rounded-2xl border p-5 sm:p-6 ${
              verified
                ? "border-emerald-200 bg-emerald-50/70"
                : "border-amber-200 bg-amber-50/70"
            }`}
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                  verified
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {verified ? <CheckCircle2 size={26} /> : <Clock3 size={26} />}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                    {verified
                      ? "Your account is verified"
                      : "Your account is not verified yet"}
                  </h3>
                  <StatusBadge verified={verified} />
                </div>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  {verified
                    ? "Your account is marked as verified. Keep your profile information up to date."
                    : "Complete your salon profile and keep your account information accurate. If additional verification is required, contact Rupiva support for the next steps."}
                </p>

                {!verified && (
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <button
                      type="button"
                      onClick={() => navigate("/salon-owner/salon-profile")}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-purple-700"
                    >
                      <FileCheck2 size={17} />
                      Review Salon Profile
                      <ArrowRight size={16} />
                    </button>

                    <p className="flex items-start gap-2 text-xs leading-5 text-slate-600 sm:max-w-xs sm:items-center">
                      <ShieldCheck
                        size={16}
                        className="mt-0.5 shrink-0 sm:mt-0"
                      />
                      Verification status is provided by your account data.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Keep your account information accurate
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Your profile details and salon information help keep your
                business account up to date.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick navigation */}
      <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="text-base font-bold text-slate-900">
          Need to update your business?
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Manage your salon information separately from your personal profile.
        </p>

        <button
          type="button"
          onClick={() => navigate("/salon-owner/salon-profile")}
          className="mt-5 flex min-h-14 w-full items-center gap-3 rounded-2xl border border-slate-200 p-4 text-left transition hover:border-purple-200 hover:bg-purple-50 sm:w-auto sm:min-w-72"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
            <Store size={20} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-800">Manage My Salon</p>
            <p className="mt-1 text-xs text-slate-500">
              Update business details and location
            </p>
          </div>

          <ArrowRight size={18} className="shrink-0 text-purple-600" />
        </button>
      </section>
    </main>
  );
}
