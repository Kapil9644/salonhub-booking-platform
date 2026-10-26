import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronRight,
  CreditCard,
  Heart,
  LogOut,
  Mail,
  MapPin,
  ShieldCheck,
  Star,
  UserRound,
  Pencil,
  X,
  Camera,
  LoaderCircle,
  Scissors,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useNotification } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
} from "../../services/authService";
import {
  getFavoriteSalons,
  toggleFavoriteSalon,
} from "../../services/favoriteService";

const compressProfileImage = (file) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      let width = image.width;
      let height = image.height;
      const maxSize = 500;

      if (width > maxSize || height > maxSize) {
        const scale = Math.min(maxSize / width, maxSize / height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(objectUrl);

          if (!blob) {
            reject(new Error("Image compression failed."));
            return;
          }

          resolve(
            new File([blob], "profile-image.webp", {
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
      reject(new Error("Unable to process image."));
    };

    image.src = objectUrl;
  });

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "U";

const getSalonId = (salon) => String(salon?._id || salon?.id || "");

const getSalonImage = (salon) => {
  const candidates = [
    salon?.images,
    salon?.photos,
    salon?.gallery,
    salon?.image,
    salon?.coverImage,
    salon?.salonImage,
    salon?.profileImage,
    salon?.thumbnail,
  ];

  const getUrl = (value) => {
    if (typeof value === "string" && value.trim()) return value;
    if (value && typeof value === "object") {
      return (
        value.url ||
        value.secure_url ||
        value.imageUrl ||
        value.src ||
        value.path ||
        ""
      );
    }
    return "";
  };

  for (const candidate of candidates) {
    const values = Array.isArray(candidate) ? candidate : [candidate];

    for (const value of values) {
      const url = getUrl(value);
      if (url) return url;
    }
  }

  return "";
};

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(user || {});
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [removingId, setRemovingId] = useState("");
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const { error: showError, success: showSuccess } = useNotification();

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        const data = await getProfile();

        if (active && data?.user) {
          setProfile(data.user);
          updateUser(data.user);
        }
      } catch (err) {
        console.error("Profile loading failed:", err);

        if (active) {
          showError(
            err.response?.data?.message ||
              "Profile could not be loaded. Please try again.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    const loadFavorites = async () => {
      try {
        const data = await getFavoriteSalons();
        if (active) setFavorites(data?.salons || []);
      } catch (err) {
        console.error("Favorites loading failed:", err);
      } finally {
        if (active) setFavoritesLoading(false);
      }
    };

    loadProfile();
    loadFavorites();

    return () => {
      active = false;
    };
  }, [updateUser]);

  useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(selectedImage);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [selectedImage]);

  const startEditing = () => {
    setEditName(profile?.fullName || "");
    setEditEmail(profile?.email || "");
    setSelectedImage(null);

    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setSelectedImage(null);
    setEditName(profile?.fullName || "");
    setEditEmail(profile?.email || "");
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showError("Please choose a valid image.");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showError("Please select an image smaller than 10 MB.");
      event.target.value = "";
      return;
    }

    try {
      setSelectedImage(await compressProfileImage(file));
    } catch (err) {
      console.error("Image processing failed:", err);
      showError("Image could not be processed. Please try another photo.");
    }

    event.target.value = "";
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();

    const fullName = editName.trim();
    const email = editEmail.trim();

    if (!fullName) {
      showError("Please enter your full name.");
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError("Please enter a valid email address.");
      return;
    }

    try {
      setSaving(true);

      const data = await updateProfile({ fullName, email });
      let updatedUser = data.user;

      if (selectedImage) {
        const imageData = await uploadProfileImage(selectedImage);
        updatedUser = imageData.user;
      }

      setProfile(updatedUser);
      updateUser(updatedUser);
      setSelectedImage(null);
      setIsEditing(false);
      showSuccess("Your profile has been updated successfully.");
    } catch (err) {
      console.error("Profile update failed:", err);
      showError(
        err.response?.data?.message ||
          "Unable to save your changes. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveFavorite = async (event, salonId) => {
    event.stopPropagation();
    event.preventDefault();

    if (!salonId) return;

    try {
      setRemovingId(salonId);

      const result = await toggleFavoriteSalon(salonId);

      if (result?.success && result?.isFavorite === false) {
        setFavorites((current) =>
          current.filter((salon) => getSalonId(salon) !== salonId),
        );
      } else {
        const refreshed = await getFavoriteSalons();
        setFavorites(refreshed?.salons || []);
      }
    } catch (err) {
      console.error("Removing favorite failed:", err);
      showError(
        err.response?.data?.message ||
          "Could not remove this salon from favorites.",
      );
    } finally {
      setRemovingId("");
    }
  };

  const handleLogout = async () => {
    try {
      if (typeof logout === "function") {
        await logout();
      } else {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    } catch (err) {
      console.error("Logout failed:", err);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }

    navigate("/", { replace: true });
  };

  const openSalon = (salon) => {
    const salonId = getSalonId(salon);
    if (!salonId) return;

    navigate(`/salons/${salonId}`);
  };

  const avatar = previewUrl || profile?.profileImage || "";
  const displayName = profile?.fullName || "Your name";
  const role = profile?.role || "Customer";

  if (loading) {
    return (
      <div className="flex min-h-[55vh] items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <LoaderCircle
            className="mx-auto animate-spin text-purple-600"
            size={30}
          />
          <p className="mt-3 text-sm font-medium text-slate-500">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/80 px-3 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-5 flex items-center justify-between gap-3 sm:mb-7">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-purple-200 hover:text-purple-700"
            >
              <ArrowLeft size={19} />
            </button>

            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-purple-600">
                Your account
              </p>
              <h1 className="truncate text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                My Profile
              </h1>
            </div>
          </div>

          {!isEditing && (
            <button
              type="button"
              onClick={startEditing}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-purple-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 sm:px-4"
            >
              <Pencil size={15} />
              <span className="hidden sm:inline">Edit profile</span>
              <span className="sm:hidden">Edit</span>
            </button>
          )}
        </header>

        {/* Profile header */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-20 bg-gradient-to-r from-purple-700 via-purple-600 to-fuchsia-500 sm:h-24" />

          <div className="flex flex-col gap-4 px-4 pb-5 sm:flex-row sm:items-center sm:gap-5 sm:px-7 sm:pb-6">
            <div className="-mt-12 flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-purple-100 text-2xl font-bold text-purple-700 shadow-md sm:-mt-10 sm:h-28 sm:w-28">
              {avatar ? (
                <img
                  src={avatar}
                  alt={`${displayName} profile`}
                  className="h-full w-full object-cover"
                />
              ) : (
                getInitials(displayName)
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="break-words text-xl font-bold leading-tight text-slate-900 sm:text-2xl">
                {displayName}
              </h2>

              <p className="mt-2 flex min-w-0 items-start gap-2 text-sm text-slate-600">
                <Mail size={16} className="mt-0.5 shrink-0 text-purple-600" />
                <span className="break-all">
                  {profile?.email || "Email not provided"}
                </span>
              </p>

              {isEditing && (
                <div className="mt-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={saving}
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg border border-purple-200 px-3 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-50 disabled:opacity-50"
                  >
                    <Camera size={16} />
                    Change photo
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="mt-5 grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(250px,0.85fr)]">
          {/* Personal information */}
          <section className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Personal information
                </h2>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Manage your account details.
                </p>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <UserRound size={18} />
              </span>
            </div>

            <form onSubmit={handleSaveProfile}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="min-w-0">
                  <label
                    htmlFor="profile-name"
                    className="mb-1.5 block text-xs font-semibold text-slate-600"
                  >
                    Full name
                  </label>

                  {isEditing ? (
                    <input
                      id="profile-name"
                      value={editName}
                      onChange={(event) => setEditName(event.target.value)}
                      autoComplete="name"
                      maxLength={100}
                      required
                      disabled={saving}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-50 disabled:bg-slate-50"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="flex min-h-11 items-center gap-2.5 rounded-xl bg-slate-50 px-3.5 py-3">
                      <UserRound
                        size={16}
                        className="shrink-0 text-slate-400"
                      />
                      <span className="min-w-0 break-words text-sm font-medium text-slate-800">
                        {profile?.fullName || "Not provided"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <label className="mb-1.5 block text-xs font-semibold text-slate-600">
                    Mobile number
                  </label>
                  <div className="flex min-h-11 items-center gap-2.5 rounded-xl bg-slate-50 px-3.5 py-3">
                    <MapPin size={16} className="shrink-0 text-slate-400" />
                    <span className="min-w-0 break-words text-sm font-medium text-slate-800">
                      {profile?.phone || "Not provided"}
                    </span>
                  </div>
                </div>

                <div className="min-w-0 sm:col-span-2">
                  <label
                    htmlFor="profile-email"
                    className="mb-1.5 block text-xs font-semibold text-slate-600"
                  >
                    Email address
                  </label>

                  {isEditing ? (
                    <input
                      id="profile-email"
                      type="email"
                      value={editEmail}
                      onChange={(event) => setEditEmail(event.target.value)}
                      autoComplete="email"
                      maxLength={254}
                      disabled={saving}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-50 disabled:bg-slate-50"
                      placeholder="you@example.com"
                    />
                  ) : (
                    <div className="flex min-h-11 items-center gap-2.5 rounded-xl bg-slate-50 px-3.5 py-3">
                      <Mail size={16} className="shrink-0 text-slate-400" />
                      <span className="min-w-0 break-all text-sm font-medium text-slate-800">
                        {profile?.email || "Not provided"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mt-5 flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={cancelEditing}
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    <X size={16} />
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? (
                      <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                      <Check size={16} />
                    )}
                    {saving ? "Saving changes..." : "Save changes"}
                  </button>
                </div>
              )}
            </form>
          </section>

          {/* Right sidebar */}
          <aside className="min-w-0 space-y-5">
            <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
              <h2 className="mb-3 text-base font-bold text-slate-900">
                Quick access
              </h2>

              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => navigate("/my-bookings")}
                  className="group flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-purple-50"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 group-hover:bg-white">
                    <CalendarDays size={19} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-800">
                      My bookings
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      View your appointments
                    </span>
                  </span>
                  <ChevronRight size={17} className="shrink-0 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/payment")}
                  className="group flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-purple-50"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-white">
                    <CreditCard size={19} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-800">
                      Payment history
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      Payments and refunds
                    </span>
                  </span>
                  <ChevronRight size={17} className="shrink-0 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/salons")}
                  className="group flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-purple-50"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-white">
                    <Scissors size={19} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-800">
                      Explore salons
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      Find your next style
                    </span>
                  </span>
                  <ChevronRight size={17} className="shrink-0 text-slate-400" />
                </button>
              </div>
            </section>

            {/* Favorite salons */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-slate-900">
                    Favorite salons
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Your saved places
                    {!favoritesLoading && ` · ${favorites.length} saved`}
                  </p>
                </div>

                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                  <Heart size={18} />
                </span>
              </div>

              {favoritesLoading ? (
                <div className="flex items-center justify-center py-6">
                  <LoaderCircle
                    size={22}
                    className="animate-spin text-purple-600"
                  />
                </div>
              ) : favorites.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center">
                  <Heart size={24} className="mx-auto text-slate-300" />
                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    No favorites yet
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Save salons you love to find them here.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate("/salons")}
                    className="mt-3 text-xs font-bold text-purple-600 hover:text-purple-800"
                  >
                    Explore salons
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    {favorites.slice(0, 3).map((salon) => {
                      const salonId = getSalonId(salon);
                      const salonName = salon?.name || "Salon";
                      const image = getSalonImage(salon);
                      const address =
                        salon?.location?.area ||
                        salon?.location?.city ||
                        salon?.address ||
                        "";

                      return (
                        <article
                          key={salonId || salonName}
                          role="link"
                          tabIndex={salonId ? 0 : -1}
                          onClick={() => openSalon(salon)}
                          onKeyDown={(event) => {
                            if (
                              salonId &&
                              (event.key === "Enter" || event.key === " ")
                            ) {
                              event.preventDefault();
                              openSalon(salon);
                            }
                          }}
                          className={`group flex min-w-0 items-center gap-3 rounded-xl border border-transparent p-2 transition ${
                            salonId
                              ? "cursor-pointer hover:border-purple-100 hover:bg-purple-50/70"
                              : ""
                          }`}
                        >
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-purple-50">
                            {image ? (
                              <img
                                src={image}
                                alt={salonName}
                                loading="lazy"
                                onError={(event) => {
                                  event.currentTarget.style.display = "none";
                                }}
                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <span className="flex h-full w-full items-center justify-center text-purple-600">
                                <Scissors size={22} />
                              </span>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-800 group-hover:text-purple-700">
                              {salonName}
                            </p>

                            {address && (
                              <p className="mt-1 flex items-center gap-1 truncate text-xs text-slate-500">
                                <MapPin size={12} className="shrink-0" />
                                {address}
                              </p>
                            )}

                            {salon?.rating != null && (
                              <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-amber-600">
                                <Star size={12} fill="currentColor" />
                                {Number(salon.rating).toFixed(1)}
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={(event) =>
                              handleRemoveFavorite(event, salonId)
                            }
                            disabled={!salonId || removingId === salonId}
                            aria-label={`Remove ${salonName} from favorites`}
                            title="Remove favorite"
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-100 hover:text-rose-600 disabled:opacity-40"
                          >
                            {removingId === salonId ? (
                              <LoaderCircle
                                size={15}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2 size={15} />
                            )}
                          </button>
                        </article>
                      );
                    })}
                  </div>

                  {favorites.length > 3 && (
                    <button
                      type="button"
                      onClick={() => navigate("/favorites")}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-purple-100 bg-purple-50 px-3 py-3 text-sm font-semibold text-purple-700 transition hover:border-purple-200 hover:bg-purple-100"
                    >
                      View all favourite salons
                      <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-purple-700">
                        {favorites.length}
                      </span>
                      <ExternalLink size={15} />
                    </button>
                  )}

                  {favorites.length <= 3 && (
                    <button
                      type="button"
                      onClick={() => navigate("/favorites")}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
                    >
                      Open favourite salons
                      <ChevronRight size={16} />
                    </button>
                  )}
                </>
              )}
            </section>

            {/* Sign out */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-between gap-3 rounded-2xl border border-rose-100 bg-white px-4 py-3.5 text-left shadow-sm transition hover:border-rose-200 hover:bg-rose-50"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                  <LogOut size={17} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-800">
                    Sign out
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    Log out of your account
                  </span>
                </span>
              </span>
              <ChevronRight size={17} className="text-slate-400" />
            </button>
          </aside>
        </div>

        <footer className="mt-6 flex items-center justify-center gap-2 pb-2 text-xs text-slate-400">
          <ShieldCheck size={14} />
          Your Rupiva account
        </footer>
      </div>
    </main>
  );
};

export default Profile;
