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
} from "lucide-react";
import { useState } from "react";

const HelpSupport = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

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

  const filteredFaqs = faqs.filter((faq) =>
    `${faq.question} ${faq.answer}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  const toggleFaq = (index) => {
    setOpenFaq((current) => (current === index ? null : index));
  };

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
              Rupiva Help Center
            </p>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              How can we help you?
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              Find answers to common questions about bookings, payments,
              accounts, offers and more.
            </p>

            {/* Search */}
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

      {/* Contact Support */}
      <section className="bg-slate-50">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="rounded-3xl bg-purple-600 px-5 py-7 shadow-lg sm:px-8 sm:py-9">
            <div className="mx-auto max-w-3xl text-center">
              <MessageCircle className="mx-auto text-purple-200" size={27} />

              <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
                Still need help?
              </h2>

              <p className="mt-2 text-sm leading-6 text-purple-100">
                If you can't find the answer you're looking for, our support
                team can help you with your Rupiva experience.
              </p>

              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href="mailto:support@rupiva.com"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-purple-600 transition hover:bg-purple-50"
                >
                  <Mail size={17} />
                  Email Support
                </a>

                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  <MessageCircle size={17} />
                  Contact Support
                </button>
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
