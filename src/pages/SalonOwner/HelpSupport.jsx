import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  CalendarDays,
  CreditCard,
  Store,
  Scissors,
  UserRound,
  ShieldCheck,
  CircleHelp,
  ChevronDown,
  ChevronUp,
  Send,
  RefreshCw,
  LoaderCircle,
  CheckCircle2,
  Clock3,
  AlertCircle,
  MessageCircle,
  Phone,
  LifeBuoy,
  FileText,
  Wrench,
  ArrowRight,
  X,
  ClipboardList,
} from "lucide-react";
import api from "../../services/api";

const categories = [
  {
    title: "Salon Profile",
    description: "Salon details, verification and visibility.",
    icon: Store,
    keywords: "salon profile verification visibility address",
  },
  {
    title: "Services & Pricing",
    description: "Manage your services, prices and availability.",
    icon: Scissors,
    keywords: "services pricing duration service",
  },
  {
    title: "Appointments",
    description: "Bookings, schedules and customer appointments.",
    icon: CalendarDays,
    keywords: "appointments bookings schedule customers",
  },
  {
    title: "Payments & Payouts",
    description: "Payment status, payouts and transactions.",
    icon: CreditCard,
    keywords: "payments payouts transactions money",
  },
  {
    title: "Account & Login",
    description: "Login, profile and account security.",
    icon: UserRound,
    keywords: "account login password profile security",
  },
  {
    title: "Technical Issues",
    description: "Report errors or problems using Rupiva.",
    icon: Wrench,
    keywords: "technical issue error bug website",
  },
];

const faqs = [
  {
    category: "Salon Profile",
    question: "How can I update my salon details?",
    answer:
      "Open My Salon from your dashboard to access your salon profile. Update the available details and save your changes. If a field cannot be edited, submit a support request.",
  },
  {
    category: "Salon Profile",
    question: "Why is my salon information not visible?",
    answer:
      "Check that your salon profile is complete and that any required verification has been completed. If your salon information still does not appear, contact Rupiva Admin through a support request.",
  },
  {
    category: "Services & Pricing",
    question: "How can I add or update a service?",
    answer:
      "Open Services in your Salon Owner dashboard. Use the available controls to manage your services and pricing. If your changes do not appear, submit a support request with the service details.",
  },
  {
    category: "Appointments",
    question: "Where can I manage customer appointments?",
    answer:
      "Open Appointments from your Salon Owner dashboard to view and manage your bookings using the options available to your account.",
  },
  {
    category: "Appointments",
    question: "What should I do if a booking looks incorrect?",
    answer:
      "Review the appointment details first. If the booking information still looks incorrect, submit a complaint under Appointments & Bookings and include the relevant booking details in your description.",
  },
  {
    category: "Payments & Payouts",
    question: "What should I do if I have not received a payout?",
    answer:
      "Review your payment information and available transaction details. If the payout is still missing, submit a support request under Payments & Payouts with the relevant date and transaction details. Do not include passwords, OTPs or full payment credentials.",
  },
  {
    category: "Payments & Payouts",
    question: "How can I report an incorrect payment status?",
    answer:
      "Submit a complaint under Payments & Payouts. Describe the transaction, the displayed status and when the issue occurred. The Rupiva Admin team can review your report.",
  },
  {
    category: "Account & Login",
    question: "What if I cannot log in to my account?",
    answer:
      "Check that you are using the correct login details and try the available password recovery option. If you still cannot access your account, submit a support request when possible.",
  },
  {
    category: "Technical Issues",
    question: "What should I include when reporting a technical issue?",
    answer:
      "Describe what you were trying to do, what happened instead, and the page where the issue occurred. Include the approximate time and any visible error message. Never share passwords or OTPs.",
  },
  {
    category: "Other",
    question: "How can I follow up on an existing complaint?",
    answer:
      "Use the Track a Complaint section and enter the complaint ID. You can also review your complaint history and any Admin responses in My Complaints.",
  },
];

const statusStyles = {
  Open: "bg-blue-50 text-blue-700 ring-blue-200",
  "In Progress": "bg-amber-50 text-amber-700 ring-amber-200",
  Resolved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Closed: "bg-gray-100 text-gray-600 ring-gray-200",
};

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    "Something went wrong. Please try again."
  );
}

function formatDate(date) {
  if (!date) return "—";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ status }) {
  const currentStatus = statusStyles[status] ? status : "Open";

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyles[currentStatus]}`}
    >
      {currentStatus === "Resolved" ? (
        <CheckCircle2 size={14} />
      ) : currentStatus === "In Progress" ? (
        <Clock3 size={14} />
      ) : (
        <AlertCircle size={14} />
      )}
      {currentStatus}
    </span>
  );
}

export default function SalonOwnerHelpSupport() {
  const [search, setSearch] = useState("");
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeCategory, setActiveCategory] = useState("");
  const [trackId, setTrackId] = useState("");
  const [trackResult, setTrackResult] = useState(null);
  const [trackError, setTrackError] = useState("");

  const [form, setForm] = useState({
    category: "",
    subject: "",
    description: "",
  });

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/complaints/salon-owner/my");
      const data = response?.data;

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.complaints)
          ? data.complaints
          : Array.isArray(data?.data)
            ? data.data
            : [];

      setComplaints(list);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const filteredFaqs = useMemo(() => {
    const term = search.trim().toLowerCase();

    return faqs.filter((faq) => {
      const matchesSearch =
        !term ||
        `${faq.question} ${faq.answer} ${faq.category}`
          .toLowerCase()
          .includes(term);

      const matchesCategory =
        !activeCategory || faq.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const openCount = complaints.filter((item) => item.status === "Open").length;

  const progressCount = complaints.filter(
    (item) => item.status === "In Progress",
  ).length;

  const resolvedCount = complaints.filter((item) =>
    ["Resolved", "Closed"].includes(item.status),
  ).length;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFormError("");
    setNotice("");
  };

  const scrollToForm = (category = "") => {
    setForm((previous) => ({
      ...previous,
      category: category || previous.category,
    }));

    document.getElementById("owner-support-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setSearch("");
    setActiveFaq(null);

    document.getElementById("owner-support-faqs")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    setNotice("");

    const category = form.category.trim();
    const subject = form.subject.trim();
    const description = form.description.trim();

    if (!category || !subject || !description) {
      setFormError("Please complete all required fields.");
      return;
    }

    if (subject.length > 150 || description.length > 3000) {
      setFormError("Please check the subject and description length.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post("/complaints/salon-owner", {
        category,
        subject,
        description,
      });

      const created = response?.data?.complaint;

      setForm({
        category: "",
        subject: "",
        description: "",
      });

      setNotice(
        created?.complaintId
          ? `Support request submitted successfully. Your Complaint ID is ${created.complaintId}.`
          : "Your support request has been submitted successfully.",
      );

      await fetchComplaints();

      if (created?.complaintId) {
        setTrackId(created.complaintId);
      }
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrack = (event) => {
    event.preventDefault();
    setTrackError("");
    setTrackResult(null);

    const normalizedId = trackId.trim().toUpperCase();

    if (!normalizedId) {
      setTrackError("Please enter your Complaint ID.");
      return;
    }

    // Owner complaints are searched only within the authenticated
    // owner's already-authorized complaint list.
    const match = complaints.find(
      (item) => item.complaintId?.toUpperCase() === normalizedId,
    );

    if (match) {
      setTrackResult(match);
    } else if (loading) {
      setTrackError("Please wait until your complaints finish loading.");
    } else if (error) {
      setTrackError("Unable to load complaints. Refresh and try again.");
    } else {
      setTrackError(
        "Complaint ID was not found in your account. Check the ID or refresh your complaints.",
      );
    }
  };

  return (
    <main className="min-w-0 space-y-8 pb-10">
      {/* Hero and help search */}
      <section className="scroll-mt-24 overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-600 px-5 py-9 text-center text-white shadow-sm sm:px-8 sm:py-12">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
          <CircleHelp size={27} />
        </div>

        <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-purple-100">
          Rupiva Partner Help Center
        </p>

        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
          How can we help your salon?
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-purple-100 sm:text-base">
          Find answers about your salon profile, services, appointments, payouts
          and account.
        </p>

        <div className="mx-auto mt-6 flex max-w-2xl items-center gap-3 rounded-xl bg-white px-4 py-1 shadow-lg">
          <Search size={20} className="shrink-0 text-gray-400" />

          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setActiveCategory("");
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                document
                  .getElementById("owner-support-faqs")
                  ?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            placeholder="Search payouts, bookings, salon profile..."
            aria-label="Search support articles"
            className="min-w-0 flex-1 border-0 bg-transparent py-3 text-sm text-slate-800 outline-none placeholder:text-gray-400 focus:ring-0"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="rounded-lg p-1 text-gray-500 hover:bg-gray-100"
            >
              <X size={17} />
            </button>
          )}
        </div>

        {search && (
          <p className="mt-3 text-xs text-purple-100">
            {filteredFaqs.length} matching help article
            {filteredFaqs.length === 1 ? "" : "s"} below
          </p>
        )}
      </section>

      {/* Browse categories */}
      <section className="scroll-mt-24" id="owner-support-categories">
        <div className="mb-5 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-600">
            Browse Business Help
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            What do you need help with?
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Choose a topic to find relevant answers.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <button
                type="button"
                key={category.title}
                onClick={() => handleCategoryClick(category.title)}
                className={`group flex min-w-0 items-center gap-3 rounded-2xl border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-md ${
                  activeCategory === category.title
                    ? "border-purple-400 ring-2 ring-purple-100"
                    : "border-gray-200"
                }`}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition group-hover:bg-purple-100">
                  <Icon size={21} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-slate-900">
                    {category.title}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-gray-500">
                    {category.description}
                  </span>
                </span>

                <ArrowRight
                  size={17}
                  className="shrink-0 text-gray-400 transition group-hover:translate-x-1 group-hover:text-purple-600"
                />
              </button>
            );
          })}
        </div>
      </section>

      {/* FAQ accordion */}
      <section
        className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
        id="owner-support-faqs"
      >
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-600">
            Frequently Asked Questions
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
            Quick answers
          </h2>
        </div>

        {activeCategory && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-purple-50 px-4 py-3">
            <p className="text-sm font-semibold text-purple-800">
              Topic: {activeCategory}
            </p>
            <button
              type="button"
              onClick={() => setActiveCategory("")}
              className="text-sm font-semibold text-purple-700 underline underline-offset-2"
            >
              Show all topics
            </button>
          </div>
        )}

        <div className="mx-auto mt-5 max-w-4xl space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = activeFaq === faq.question;

              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-xl border border-gray-200"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setActiveFaq(isOpen ? null : faq.question)}
                    className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-gray-50 sm:px-5"
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-bold leading-6 text-slate-900 sm:text-base">
                        {faq.question}
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        {faq.category}
                      </span>
                    </span>

                    {isOpen ? (
                      <ChevronUp
                        size={19}
                        className="shrink-0 text-purple-600"
                      />
                    ) : (
                      <ChevronDown
                        size={19}
                        className="shrink-0 text-gray-500"
                      />
                    )}
                  </button>

                  {isOpen && (
                    <div className="border-t border-gray-100 bg-gray-50/70 px-4 py-4 sm:px-5">
                      <p className="text-sm leading-7 text-gray-600">
                        {faq.answer}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          scrollToForm(
                            faq.category === "Other"
                              ? ""
                              : faq.category === "Appointments"
                                ? "Appointments & Bookings"
                                : faq.category === "Payments & Payouts"
                                  ? "Payments & Payouts"
                                  : faq.category === "Technical Issues"
                                    ? "Technical Issues"
                                    : faq.category === "Services & Pricing"
                                      ? "Services & Pricing"
                                      : faq.category === "Account & Login"
                                        ? "Account & Login"
                                        : "Salon Profile & Verification",
                          )
                        }
                        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-purple-700 hover:text-purple-900"
                      >
                        Still need help? Submit a request
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="rounded-xl border border-dashed border-gray-200 px-4 py-10 text-center">
              <Search size={25} className="mx-auto text-gray-400" />
              <h3 className="mt-3 font-semibold text-slate-800">
                No matching answers found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try a different search term or submit a support request.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("");
                }}
                className="mt-3 text-sm font-semibold text-purple-700 underline underline-offset-2"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Complaint statistics */}
      <section className="scroll-mt-24" id="owner-support-complaints">
        <div className="mb-5 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-purple-600">
            Partner Support
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Complaints & Support Requests
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Contact Rupiva Admin and follow the progress of your request.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Open</p>
              <AlertCircle size={19} className="text-blue-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {openCount}
            </p>
            <p className="mt-1 text-xs text-gray-500">Awaiting action</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">In Progress</p>
              <Clock3 size={19} className="text-amber-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {progressCount}
            </p>
            <p className="mt-1 text-xs text-gray-500">Being reviewed</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Resolved</p>
              <CheckCircle2 size={19} className="text-emerald-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {resolvedCount}
            </p>
            <p className="mt-1 text-xs text-gray-500">Resolved or closed</p>
          </div>
        </div>
      </section>

      {/* Submit complaint */}
      <section
        id="owner-support-form"
        className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6"
      >
        <div className="mb-5 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
            <Send size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Submit a Complaint
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Tell us about your business issue. Fields marked * are required.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="owner-complaint-category"
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              Complaint Category <span className="text-red-500">*</span>
            </label>
            <select
              id="owner-complaint-category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
            >
              <option value="">Select your issue category</option>
              {[
                "Salon Profile & Verification",
                "Services & Pricing",
                "Appointments & Bookings",
                "Payments & Payouts",
                "Customer Disputes",
                "Account & Login",
                "Technical Issues",
                "Other",
              ].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="owner-complaint-subject"
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              id="owner-complaint-subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              maxLength={150}
              placeholder="Briefly describe your issue"
              className="w-full rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
            />
            <p className="mt-1 text-right text-xs text-gray-400">
              {form.subject.length}/150
            </p>
          </div>

          <div>
            <label
              htmlFor="owner-complaint-description"
              className="mb-1.5 block text-sm font-semibold text-slate-700"
            >
              Describe Your Complaint <span className="text-red-500">*</span>
            </label>
            <textarea
              id="owner-complaint-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              maxLength={3000}
              rows={5}
              placeholder="Explain what happened and include relevant details..."
              className="w-full resize-y rounded-xl border border-gray-200 px-3 py-3 text-sm leading-6 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
            />
            <p className="mt-1 text-right text-xs text-gray-400">
              {form.description.length}/3000
            </p>
          </div>

          {formError && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {formError}
            </div>
          )}

          {notice && (
            <div
              role="status"
              className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
            >
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              <span>{notice}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {submitting ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <Send size={17} />
              )}
              {submitting ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </form>
      </section>

      {/* Track complaint */}
      <section className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <ClipboardList size={21} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Track a Complaint
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Enter your Complaint ID to find its latest status.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleTrack}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <input
            value={trackId}
            onChange={(event) => {
              setTrackId(event.target.value);
              setTrackError("");
              setTrackResult(null);
            }}
            placeholder="e.g. RUP-20261026-AB12CD34"
            aria-label="Complaint ID"
            className="min-h-11 min-w-0 flex-1 rounded-xl border border-gray-200 px-3 py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
          />

          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-5 py-3 text-sm font-semibold text-purple-700 transition hover:bg-purple-100 disabled:opacity-60"
          >
            <Search size={17} />
            Track Complaint
          </button>
        </form>

        <p className="mt-2 text-xs leading-5 text-gray-500">
          For privacy, tracking only searches complaints associated with your
          signed-in Salon Owner account.
        </p>

        {trackError && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {trackError}
          </p>
        )}

        {trackResult && (
          <article className="mt-4 rounded-xl border border-purple-200 bg-purple-50/50 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="break-all text-xs font-semibold text-purple-700">
                  {trackResult.complaintId}
                </p>
                <h3 className="mt-2 break-words font-bold text-slate-900">
                  {trackResult.subject}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {trackResult.category}
                </p>
              </div>
              <StatusBadge status={trackResult.status} />
            </div>

            <p className="mt-3 text-xs text-gray-500">
              Submitted: {formatDate(trackResult.createdAt)}
            </p>

            <div className="mt-4 rounded-xl bg-white p-3 sm:p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Admin Response
              </p>
              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                {trackResult.adminResponse?.trim() ||
                  "No response has been added yet."}
              </p>
            </div>
          </article>
        )}
      </section>

      {/* My complaints */}
      <section className="scroll-mt-24 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">My Complaints</h2>
            <p className="mt-1 text-sm text-gray-500">
              Review your requests, status and responses from Rupiva Admin.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchComplaints}
            disabled={loading}
            className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-xl border border-gray-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-gray-50 disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={fetchComplaints}
              className="mt-2 font-semibold underline underline-offset-2"
            >
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex min-h-40 flex-col items-center justify-center gap-3 text-sm text-gray-500">
            <LoaderCircle size={25} className="animate-spin text-purple-600" />
            Loading your complaints...
          </div>
        ) : !error && complaints.length === 0 ? (
          <div className="mt-5 flex flex-col items-center rounded-xl border border-dashed border-gray-200 px-4 py-10 text-center">
            <MessageCircle size={27} className="text-purple-500" />
            <h3 className="mt-3 font-semibold text-slate-800">
              No complaints yet
            </h3>
            <p className="mt-1 max-w-sm text-sm leading-6 text-gray-500">
              Submitted complaints will appear here with their status and
              responses.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {complaints.map((complaint) => (
              <article
                key={complaint._id || complaint.complaintId}
                className="min-w-0 rounded-xl border border-gray-200 p-4 transition hover:border-purple-200 sm:p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="break-all text-xs font-semibold text-purple-700">
                      {complaint.complaintId || "Complaint ID pending"}
                    </p>
                    <h3 className="mt-2 break-words font-bold text-slate-900">
                      {complaint.subject}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {complaint.category}
                    </p>
                  </div>
                  <div className="shrink-0 self-start">
                    <StatusBadge status={complaint.status} />
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-gray-50 p-3 sm:p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Your Complaint
                  </p>
                  <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                    {complaint.description}
                  </p>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                  <span>Submitted: {formatDate(complaint.createdAt)}</span>
                  {complaint.updatedAt && (
                    <span>Updated: {formatDate(complaint.updatedAt)}</span>
                  )}
                </div>

                <div className="mt-4 border-t border-gray-100 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Response from Rupiva Admin
                  </p>

                  {complaint.adminResponse?.trim() ? (
                    <p className="mt-2 whitespace-pre-wrap break-words rounded-xl border border-purple-100 bg-purple-50/70 p-3 text-sm leading-6 text-slate-700 sm:p-4">
                      {complaint.adminResponse}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      No response yet. Please check back later for updates.
                    </p>
                  )}
                </div>

                {complaint.complaintId && (
                  <button
                    type="button"
                    onClick={() => {
                      setTrackId(complaint.complaintId);
                      setTrackResult(complaint);
                      setTrackError("");
                      document
                        .getElementById("owner-support-track")
                        ?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                    }}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-purple-700 hover:text-purple-900"
                  >
                    Track this complaint
                    <ArrowRight size={15} />
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Still need help */}
      <section className="rounded-2xl bg-gradient-to-br from-purple-700 to-indigo-600 px-5 py-9 text-center text-white shadow-sm sm:px-8 sm:py-10">
        <Phone size={29} className="mx-auto text-purple-100" />

        <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">
          Still need help?
        </h2>

        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-purple-100">
          Contact our support team for help with your Rupiva business account,
          salon, bookings or payments.
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
          {/* Support Email */}
          <a
            href="mailto:kapilkhandelwar12@gmail.com"
            className="inline-flex min-h-11 max-w-full items-center justify-center gap-2 break-all rounded-full bg-white px-5 py-3 text-sm font-semibold text-purple-700 transition hover:bg-purple-50"
          >
            <Send size={17} className="shrink-0" />
            kapilkhandelwar12@gmail.com
          </a>

          {/* Support Phone */}
          <a
            href="tel:6232962995"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <Phone size={17} />
            6232962995
          </a>
        </div>

        <p className="mt-5 text-xs leading-5 text-purple-100">
          Please never share your password, OTP or sensitive payment
          credentials.
        </p>
      </section>
    </main>
  );
}
