import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { getSalonReviews } from "../../services/reviewService";

export default function ReviewsSection({ salonId }) {
  const [reviews, setReviews] = useState([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getSalonReviews(salonId);

        setReviews(data.reviews || []);
        setTotalReviews(data.totalReviews || 0);
        setAverageRating(data.averageRating);
      } catch (error) {
        console.error("Failed to fetch salon reviews:", error);

        setError(error.response?.data?.message || "Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    };

    if (salonId) {
      fetchReviews();
    }
  }, [salonId]);

  return (
    <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:mt-7 sm:rounded-3xl sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold leading-6 text-slate-900 sm:text-xl">
            Customer Reviews
          </h2>

          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            See what customers are saying about this salon.
          </p>
        </div>

        {totalReviews > 0 && (
          <div className="flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1.5">
            <Star size={15} className="fill-yellow-400 text-yellow-400" />

            <span className="text-sm font-bold text-slate-900">
              {averageRating}
            </span>

            <span className="text-xs text-gray-500">({totalReviews})</span>
          </div>
        )}
      </div>

      {loading ? (
        <p className="mt-5 text-sm text-gray-500">Loading reviews...</p>
      ) : error ? (
        <p className="mt-5 text-sm text-red-500">{error}</p>
      ) : reviews.length === 0 ? (
        <div className="mt-5 rounded-xl bg-gray-50 p-4 text-center">
          <p className="text-sm font-medium text-gray-600">No reviews yet.</p>

          <p className="mt-1 text-xs text-gray-500">
            Be the first customer to share your experience.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {reviews.map((review) => (
            <article
              key={review._id}
              className="rounded-xl border border-gray-100 bg-gray-50 p-3.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  {review.customer?.profileImage ? (
                    <img
                      src={review.customer.profileImage}
                      alt={review.customer.fullName}
                      className="h-9 w-9 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
                      {review.customer?.fullName?.charAt(0)?.toUpperCase() ||
                        "C"}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-slate-900">
                      {review.customer?.fullName || "Customer"}
                    </h3>

                    <p className="text-[11px] text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      className={
                        star <= review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
              </div>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                {review.comment}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
