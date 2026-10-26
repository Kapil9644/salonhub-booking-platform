import {
  CalendarCheck,
  ChevronDown,
  CreditCard,
  Heart,
  HelpCircle,
  Mail,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  UserRound,
  Phone,
  ClipboardList,
  RefreshCw,
  Send,
  CheckCircle2,
  Clock3,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  createComplaint,
  getMyComplaints,
  trackComplaint,
} from "../../services/complaintService";

const DEFAULT_SUPPORT = {
  platformName: "Rupiva",
  supportEmail: "support@rupiva.com",
  supportPhone: "+919644319427",
};

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong. Please try again.";

const HelpSupport = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const [support, setSupport] = useState(DEFAULT_SUPPORT);
  const [supportLoading, setSupportLoading] = useState(true);

  const [complaintForm, setComplaintForm] = useState({
    category: "Booking Issue",
    subject: "",
    description: "",
    bookingId: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [complaintError, setComplaintError] = useState("");
  const [submittedComplaint, setSubmittedComplaint] = useState(null);

  const [complaints, setComplaints] = useState([]);
  const [complaintsLoading, setComplaintsLoading] = useState(false);
  const [complaintsError, setComplaintsError] = useState("");

  const [trackingId, setTrackingId] = useState("");
  const [trackingResult, setTrackingResult] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState("");

  const [showComplaintForm, setShowComplaintForm] = useState(false);

  const helpCategories = [
    {
      icon: CalendarCheck,
      title: "Bookings",
      description: "Manage appointments, slots and booking details.",
    },
    {
      icon: CreditCard,
      title: "Payments",
      description: "Get help with payment and transaction questions.",
    },
    {
      icon: Tag,
      title: "Offers",
      description: "Learn about offers, coupons and discounts.",
    },
    {
      icon: UserRound,
      title: "Account",
      description: "Manage your profile and account information.",
    },
    {
      icon: Heart,
      title: "Favorite Salons",
      description: "Manage and find your saved salons.",
    },
    {
      icon: ShieldCheck,
      title: "Safety & Privacy",
      description: "Learn how Rupiva protects your information.",
    },
  ];

  const faqs = [
    {
      question: "How do I book a salon appointment?",
      answer:
        "Find a salon, open its details page, select the services you want, choose an available date and time slot, and continue to confirm your appointment.",
    },
    {
      question: "Can I change my appointment?",
      answer:
        "If your booking supports rescheduling, you can update the appointment from your booking details. Available dates and time slots depend on the salon's working hours.",
    },
    {
      question: "Can I cancel my booking?",
      answer:
        "Cancellation availability can depend on the booking and salon policy. Open your booking details to check the available cancellation option.",
    },
    {
      question: "How do I select a salon as a favorite?",
      answer:
        "Tap the heart icon on a salon card or on the salon details page. Your saved salons can then be viewed from Favorite Salons.",
    },
    {
      question: "Where can I find my bookings?",
      answer:
        "Open your account menu and select My Bookings to view your appointment history and booking details.",
    },
    {
      question: "How do I use an offer?",
      answer:
        "Open the Offers page, choose an available offer and copy its coupon code. If the offer is applicable to your booking, enter or apply the code during the relevant booking process.",
    },
  ];

  useEffect(() => {
    let active = true;

    const loadSupportDetails = async () => {
      try {
        const response = await api.get("/settings/support");
        const settings = response?.data?.settings || response?.data || {};

        if (active) {
          setSupport({
            platformName: settings.platformName || "Rupiva",
            supportEmail: settings.supportEmail || DEFAULT_SUPPORT.supportEmail,
            supportPhone: settings.supportPhone || DEFAULT_SUPPORT.supportPhone,
          });
        }
      } catch (error) {
        // Keep the default support details visible if the request fails.
        console.error("Unable to load support details:", error);
      } finally {
        if (active) setSupportLoading(false);
      }
    };

    loadSupportDetails();

    return () => {
      active = false;
    };
  }, []);

  const filteredFaqs = faqs.filter((faq) =>
    `${faq.question} ${faq.answer}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  const toggleFaq = (index) => {
    setOpenFaq((current) => (current === index ? null : index));
  };

  const handleComplaintChange = (event) => {
    const { name, value } = event.target;
    setComplaintForm((current) => ({ ...current, [name]: value }));
  };

  const handleComplaintSubmit = async (event) => {
    event.preventDefault();
    setComplaintError("");
    setSubmittedComplaint(null);

    if (
      !complaintForm.category ||
      !complaintForm.subject.trim() ||
      !complaintForm.description.trim()
    ) {
      setComplaintError("Please complete all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        category: complaintForm.category,
        subject: complaintForm.subject.trim(),
        description: complaintForm.description.trim(),
        ...(complaintForm.bookingId.trim()
          ? { bookingId: complaintForm.bookingId.trim() }
          : {}),
      };

      const response = await createComplaint(payload);
      const result =
        response?.complaint || response?.data?.complaint || response;

      if (!result?.complaintId) {
        throw new Error(
          "Complaint submitted, but the server did not return a Complaint ID. Please check your complaints before submitting again.",
        );
      }

      setSubmittedComplaint(result);
      setComplaintForm({
        category: "Booking Issue",
        subject: "",
        description: "",
        bookingId: "",
      });

      await loadMyComplaints();
    } catch (error) {
      setComplaintError(
        getErrorMessage(error) +
          (error?.response?.status === 401
            ? " Please log in to submit a complaint."
            : ""),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const loadMyComplaints = async () => {
    setComplaintsLoading(true);
    setComplaintsError("");

    try {
      const response = await getMyComplaints();
      const list =
        response?.complaints ||
        response?.data?.complaints ||
        (Array.isArray(response?.data) ? response.data : []);

      setComplaints(Array.isArray(list) ? list : []);
    } catch (error) {
      setComplaintsError(
        error?.response?.status === 401
          ? "Please log in to view your complaints."
          : getErrorMessage(error),
      );
    } finally {
      setComplaintsLoading(false);
    }
  };

  const handleTrackComplaint = async (event) => {
    event.preventDefault();
    setTrackingError("");
    setTrackingResult(null);

    if (!trackingId.trim()) {
      setTrackingError("Enter your Complaint ID first.");
      return;
    }

    setTrackingLoading(true);

    try {
      const response = await trackComplaint(trackingId.trim());
      const result =
        response?.complaint || response?.data?.complaint || response;

      if (!result?.complaintId) {
        throw new Error("Complaint details could not be found.");
      }

      setTrackingResult(result);
    } catch (error) {
      setTrackingError(
        error?.response?.status === 401
          ? "Please log in to track your complaint."
          : getErrorMessage(error),
      );
    } finally {
      setTrackingLoading(false);
    }
  };

  const statusStyle = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-700";
      case "Closed":
        return "bg-slate-200 text-slate-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  const ComplaintDetails = ({ complaint }) => (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Complaint ID
          </p>
          <p className="mt-1 break-all font-bold text-purple-700">
            {complaint.complaintId}
          </p>
        </div>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusStyle(
            complaint.status,
          )}`}
        >
          {complaint.status || "Open"}
        </span>
      </div>

      <h4 className="mt-3 font-bold text-slate-900">{complaint.subject}</h4>
      <p className="mt-1 text-sm text-slate-600">{complaint.category}</p>
      {complaint.description && (
        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
          {complaint.description}
        </p>
      )}
      {complaint.adminResponse && (
        <div className="mt-3 rounded-xl bg-purple-50 p-3">
          <p className="text-sm font-bold text-purple-800">
            Response from Rupiva Support
          </p>
          <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">
            {complaint.adminResponse}
          </p>
        </div>
      )}
      {complaint.createdAt && (
        <p className="mt-3 text-xs text-slate-400">
          Submitted: {new Date(complaint.createdAt).toLocaleString()}
        </p>
      )}
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero / Search */}
      <section className="bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
              <HelpCircle size={25} strokeWidth={2} />
            </div>

            <p className="mt-4 text-sm font-bold uppercase tracking-wider text-purple-600">
              {support.platformName} Help Center
            </p>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              How can we help you?
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              Find answers to common questions about bookings, payments,
              accounts, offers and more.
            </p>

            <div className="mx-auto mt-6 flex max-w-2xl items-center rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100">
              <Search size={19} className="ml-3 shrink-0 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search for help..."
                className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section>
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-purple-600">
              Browse Help
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              What do you need help with?
            </h2>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {helpCategories.map((category) => {
              const Icon = category.icon;

              return (
                <button
                  key={category.title}
                  type="button"
                  onClick={() => setSearchQuery(category.title)}
                  className="group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-md"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600 transition group-hover:bg-purple-600 group-hover:text-white">
                    <Icon size={19} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-slate-900">
                      {category.title}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                      {category.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white">
        <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-purple-600">
              Frequently Asked Questions
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Quick answers
            </h2>
          </div>

          <div className="mt-6 space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => {
                const isOpen = openFaq === index;

                return (
                  <div
                    key={faq.question}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm font-bold text-slate-900 sm:text-base">
                        {faq.question}
                      </span>
                      <ChevronDown
                        size={19}
                        className={`shrink-0 text-slate-500 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="border-t border-slate-100 px-4 pb-4 pt-3 sm:px-5">
                        <p className="text-sm leading-6 text-slate-600">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
                <Search className="mx-auto text-slate-400" size={28} />
                <h3 className="mt-3 text-base font-bold text-slate-900">
                  No matching help articles
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Try searching with a different keyword.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Complaint form and tracking */}
      <section className="bg-slate-50">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-purple-600">
              Customer Support
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Complaints & Support Requests
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Submit a complaint and use your Complaint ID to track its status.
            </p>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {/* Submit complaint */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                  <Send size={21} />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900">
                    Submit a complaint
                  </h3>
                  <p className="text-sm text-slate-500">
                    Fields marked * are required.
                  </p>
                </div>
              </div>

              {submittedComplaint && (
                <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 p-4">
                  <div className="flex items-center gap-2 font-bold text-green-800">
                    <CheckCircle2 size={20} />
                    Complaint submitted
                  </div>
                  <p className="mt-2 text-sm text-green-800">
                    Save this Complaint ID to track your request:
                  </p>
                  <p className="mt-1 break-all text-lg font-extrabold text-green-900">
                    {submittedComplaint.complaintId}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setTrackingId(submittedComplaint.complaintId);
                      setTrackingResult(submittedComplaint);
                    }}
                    className="mt-3 text-sm font-bold text-green-800 underline underline-offset-2"
                  >
                    View complaint details
                  </button>
                </div>
              )}

              {complaintError && (
                <div
                  role="alert"
                  className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
                >
                  {complaintError}
                </div>
              )}

              <form onSubmit={handleComplaintSubmit} className="mt-5 space-y-4">
                <div>
                  <label
                    htmlFor="complaint-category"
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                  >
                    Complaint category *
                  </label>
                  <select
                    id="complaint-category"
                    name="category"
                    required
                    value={complaintForm.category}
                    onChange={handleComplaintChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  >
                    <option>Booking Issue</option>
                    <option>Salon Service</option>
                    <option>Payment Issue</option>
                    <option>Refund Request</option>
                    <option>Account Issue</option>
                    <option>Offer or Coupon</option>
                    <option>Safety & Privacy</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="complaint-subject"
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                  >
                    Subject *
                  </label>
                  <input
                    id="complaint-subject"
                    name="subject"
                    required
                    maxLength={150}
                    value={complaintForm.subject}
                    onChange={handleComplaintChange}
                    placeholder="Briefly describe your issue"
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="complaint-booking"
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                  >
                    Booking ID (optional)
                  </label>
                  <input
                    id="complaint-booking"
                    name="bookingId"
                    value={complaintForm.bookingId}
                    onChange={handleComplaintChange}
                    placeholder="Enter your booking ID, if applicable"
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="complaint-description"
                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                  >
                    Describe your complaint *
                  </label>
                  <textarea
                    id="complaint-description"
                    name="description"
                    required
                    rows={5}
                    maxLength={3000}
                    value={complaintForm.description}
                    onChange={handleComplaintChange}
                    placeholder="Explain what happened and how we can help..."
                    className="w-full resize-y rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  />
                  <p className="mt-1 text-right text-xs text-slate-400">
                    {complaintForm.description.length}/3000
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-bold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Submit Complaint
                    </>
                  )}
                </button>

                <p className="text-xs leading-5 text-slate-500">
                  You must be logged in to submit a complaint. Do not include
                  passwords, OTPs or other sensitive information.
                </p>
              </form>
            </div>

            {/* Track complaint */}
            <div className="space-y-5">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                    <ClipboardList size={21} />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900">
                      Track a complaint
                    </h3>
                    <p className="text-sm text-slate-500">
                      Enter your Complaint ID below.
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handleTrackComplaint}
                  className="mt-5 space-y-3"
                >
                  <input
                    value={trackingId}
                    onChange={(event) => setTrackingId(event.target.value)}
                    placeholder="e.g. RUP-20261017-AB12CD34"
                    aria-label="Complaint ID"
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  />
                  <button
                    type="submit"
                    disabled={trackingLoading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-5 py-3 font-bold text-purple-700 transition hover:bg-purple-100 disabled:opacity-60"
                  >
                    {trackingLoading ? (
                      <RefreshCw size={18} className="animate-spin" />
                    ) : (
                      <Search size={18} />
                    )}
                    {trackingLoading ? "Checking..." : "Track Complaint"}
                  </button>
                </form>

                {trackingError && (
                  <p role="alert" className="mt-3 text-sm text-red-600">
                    {trackingError}
                  </p>
                )}

                {trackingResult && (
                  <ComplaintDetails complaint={trackingResult} />
                )}
              </div>

              {/* Customer's complaints */}
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900">My complaints</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      View complaints linked to your account.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={loadMyComplaints}
                    disabled={complaintsLoading}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                  >
                    <RefreshCw
                      size={15}
                      className={complaintsLoading ? "animate-spin" : ""}
                    />
                    Refresh
                  </button>
                </div>

                {complaintsError && (
                  <p role="alert" className="mt-4 text-sm text-red-600">
                    {complaintsError}
                  </p>
                )}

                {complaintsLoading && (
                  <p className="mt-4 text-sm text-slate-500">
                    Loading your complaints...
                  </p>
                )}

                {!complaintsLoading && complaints.length === 0 && (
                  <div className="mt-4 rounded-xl bg-slate-50 p-4 text-center">
                    <MessageCircle
                      size={23}
                      className="mx-auto text-slate-400"
                    />
                    <p className="mt-2 text-sm text-slate-600">
                      No complaints loaded yet.
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Log in and select Refresh to load your complaints.
                    </p>
                  </div>
                )}

                {!complaintsLoading &&
                  complaints.map((complaint) => (
                    <button
                      type="button"
                      key={complaint._id || complaint.complaintId}
                      onClick={() => {
                        setTrackingId(complaint.complaintId);
                        setTrackingResult(complaint);
                        setTrackingError("");
                      }}
                      className="mt-3 block w-full rounded-xl border border-slate-200 p-3 text-left transition hover:border-purple-300 hover:bg-purple-50/50"
                    >
                      <span className="flex flex-wrap items-center justify-between gap-2">
                        <span className="break-all text-sm font-bold text-purple-700">
                          {complaint.complaintId}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusStyle(
                            complaint.status,
                          )}`}
                        >
                          {complaint.status || "Open"}
                        </span>
                      </span>
                      <span className="mt-2 block text-sm font-semibold text-slate-800">
                        {complaint.subject}
                      </span>
                      <span className="mt-1 block text-xs text-slate-500">
                        {complaint.category}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="bg-slate-50">
        <div className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 sm:pb-10 lg:px-8 lg:pb-12">
          <div className="rounded-3xl bg-purple-600 px-5 py-7 shadow-lg sm:px-8 sm:py-9">
            <div className="mx-auto max-w-3xl text-center">
              <MessageCircle className="mx-auto text-purple-200" size={27} />
              <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
                Still need help?
              </h2>
              <p className="mt-2 text-sm leading-6 text-purple-100">
                Contact our support team for help with your Rupiva experience.
              </p>

              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={`mailto:${support.supportEmail}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-purple-600 transition hover:bg-purple-50"
                >
                  <Mail size={17} />
                  {supportLoading ? "Loading email..." : support.supportEmail}
                </a>

                <a
                  href={`tel:${support.supportPhone.replace(/[^\d+]/g, "")}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  <Phone size={17} />
                  {supportLoading ? "Loading phone..." : support.supportPhone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust note */}
      <section className="bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-5 text-center text-xs text-slate-500 sm:py-6">
          <Sparkles size={15} className="text-purple-500" />
          <span>
            Rupiva is designed to make your salon booking experience simple and
            convenient.
          </span>
        </div>
      </section>
    </main>
  );
};

export default HelpSupport;
