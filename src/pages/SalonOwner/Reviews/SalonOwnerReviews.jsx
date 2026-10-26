import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Star,
  Search,
  RefreshCw,
  MessageSquareText,
  Users,
  TrendingUp,
  LoaderCircle,
  CalendarDays,
} from "lucide-react";
import salonOwnerApi from "../../../services/salonOwnerApi";

const formatDate = (value) => {
  if (!value) return "Date unavailable";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function Stars({ rating = 0, size = 16 }) {
  return (
    <span
      className="inline-flex items-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
          }
        />
      ))}
    </span>
  );
}

export default function SalonOwnerReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // This endpoint must be implemented in the backend as described below.
      const response = await salonOwnerApi.get("/reviews/owner");
      const data = response.data;

      setReviews(Array.isArray(data.reviews) ? data.reviews : []);
    } catch (err) {
      console.error("Failed to load salon reviews:", err);
      setError(
        err?.response?.data?.message ||
          "Reviews couldn't be loaded. Please check the backend reviews endpoint.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const stats = useMemo(() => {
    const total = reviews.length;
    const average = total
      ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) /
        total
      : 0;

    return {
      total,
      average: average.toFixed(1),
      fiveStar: reviews.filter((review) => Number(review.rating) === 5).length,
    };
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    const query = search.trim().toLowerCase();

    return reviews.filter((review) => {
      if (
        ratingFilter !== "all" &&
        Number(review.rating) !== Number(ratingFilter)
      ) {
        return false;
      }

      const customer = review.customer || {};
      const searchable = [
        customer.fullName,
        customer.name,
        review.comment,
        review.salon?.name,
        ...(review.booking?.services || []).map((service) => service.name),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return !query || searchable.includes(query);
    });
  }, [reviews, search, ratingFilter]);

  const ratingCounts = useMemo(
    () =>
      [5, 4, 3, 2, 1].map((rating) => ({
        rating,
        count: reviews.filter((review) => Number(review.rating) === rating)
          .length,
      })),
    [reviews],
  );

  return (
    <main className="min-w-0 space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-purple-700">
            Rupiva for Business
          </p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Reviews &amp; Feedbacks
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Understand customer experiences and keep improving your salon
            service.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchReviews}
          disabled={loading}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
        >
          {loading ? (
            <LoaderCircle size={17} className="animate-spin" />
          ) : (
            <RefreshCw size={17} />
          )}
          Refresh reviews
        </button>
      </header>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>{error}</p>
          <p className="mt-2 text-xs leading-5">
            The frontend page is ready, but the protected GET
            /api/salon-owner-auth/reviews endpoint must return reviews belonging
            to the logged-in owner's salon.
          </p>
        </div>
      )}

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          {
            label: "Total Reviews",
            value: loading ? "—" : stats.total,
            icon: MessageSquareText,
            iconClass: "bg-purple-50 text-purple-700",
          },
          {
            label: "Average Rating",
            value: loading ? "—" : `${stats.average} / 5`,
            icon: Star,
            iconClass: "bg-amber-50 text-amber-600",
          },
          {
            label: "5-Star Reviews",
            value: loading ? "—" : stats.fiveStar,
            icon: TrendingUp,
            iconClass: "bg-emerald-50 text-emerald-700",
          },
        ].map(({ label, value, icon: Icon, iconClass }) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-extrabold text-slate-900">
                  {value}
                </p>
              </div>
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
              >
                <Icon size={21} />
              </span>
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0 space-y-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">Search reviews</span>
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search customer or feedback..."
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              />
            </label>

            <label className="sm:w-48">
              <span className="sr-only">Filter by rating</span>
              <select
                value={ratingFilter}
                onChange={(event) => setRatingFilter(event.target.value)}
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              >
                <option value="all">All ratings</option>
                <option value="5">5 stars</option>
                <option value="4">4 stars</option>
                <option value="3">3 stars</option>
                <option value="2">2 stars</option>
                <option value="1">1 star</option>
              </select>
            </label>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="font-bold text-slate-900">Customer feedback</h2>
              <p className="mt-1 text-xs text-slate-500">
                {loading
                  ? "Loading reviews..."
                  : `${filteredReviews.length} review${filteredReviews.length === 1 ? "" : "s"} shown`}
              </p>
            </div>

            {loading ? (
              <div className="flex min-h-56 flex-col items-center justify-center p-8">
                <LoaderCircle
                  size={28}
                  className="animate-spin text-purple-600"
                />
                <p className="mt-3 text-sm text-slate-500">
                  Loading customer reviews...
                </p>
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="px-5 py-14 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <MessageSquareText size={25} />
                </span>
                <h3 className="mt-4 font-bold text-slate-900">
                  {reviews.length ? "No matching reviews" : "No reviews yet"}
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  {reviews.length
                    ? "Try changing your search or rating filter."
                    : "Customer ratings and feedback will appear here after customers submit reviews for your salon."}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredReviews.map((review) => {
                  const customerName =
                    review.customer?.fullName ||
                    review.customer?.name ||
                    "Customer";

                  const serviceNames = (review.booking?.services || [])
                    .map((service) => service.name)
                    .filter(Boolean);

                  return (
                    <article
                      key={review._id}
                      className="p-5 transition hover:bg-slate-50/70"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-extrabold text-purple-700">
                          {customerName.trim().charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <h3 className="break-words font-bold text-slate-900">
                                {customerName}
                              </h3>
                              <div className="mt-1 flex flex-wrap items-center gap-2">
                                <Stars rating={Number(review.rating) || 0} />
                                <span className="text-xs font-semibold text-slate-600">
                                  {Number(review.rating) || 0}.0 / 5
                                </span>
                              </div>
                            </div>

                            <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                              <CalendarDays size={14} />
                              {formatDate(review.createdAt)}
                            </span>
                          </div>

                          <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                            {review.comment}
                          </p>

                          {serviceNames.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {serviceNames.map((service, index) => (
                                <span
                                  key={`${service}-${index}`}
                                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                                >
                                  {service}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
              <Users size={20} />
            </span>
            <div>
              <h2 className="font-bold text-slate-900">Rating breakdown</h2>
              <p className="text-xs text-slate-500">Reviews by star rating</p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {ratingCounts.map(({ rating, count }) => {
              const percentage = reviews.length
                ? (count / reviews.length) * 100
                : 0;

              return (
                <div key={rating}>
                  <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-slate-600">
                      <Star
                        size={13}
                        className="fill-amber-400 text-amber-400"
                      />
                      {rating} star{rating === 1 ? "" : "s"}
                    </span>
                    <span className="font-bold text-slate-700">{count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">
            Listen to customer feedback to identify what your salon is doing
            well and where it can improve.
          </p>
        </aside>
      </section>
    </main>
  );
}
