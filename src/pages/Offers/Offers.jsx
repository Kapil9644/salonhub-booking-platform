import {
  ArrowRight,
  CalendarCheck,
  Check,
  Clock3,
  Copy,
  Gift,
  Percent,
  Sparkles,
  Tag,
} from "lucide-react";
import { useState } from "react";

const Offers = () => {
  const [copiedCode, setCopiedCode] = useState("");

  const offers = [
    {
      id: 1,
      title: "Welcome Offer",
      discount: "20% OFF",
      description: "Get 20% off on your first salon booking with Rupiva.",
      code: "WELCOME20",
      validity: "For new customers",
      icon: Gift,
    },
    {
      id: 2,
      title: "Beauty Treat",
      discount: "₹200 OFF",
      description: "Enjoy ₹200 off when you book eligible salon services.",
      code: "BEAUTY200",
      validity: "Limited time offer",
      icon: Sparkles,
    },
    {
      id: 3,
      title: "Weekend Glow",
      discount: "15% OFF",
      description:
        "Give yourself a weekend refresh with a special salon discount.",
      code: "GLOW15",
      validity: "Valid on weekends",
      icon: CalendarCheck,
    },
  ];

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);

      setTimeout(() => {
        setCopiedCode("");
      }, 1800);
    } catch (error) {
      console.error("Failed to copy offer code:", error);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
              <Percent size={24} strokeWidth={2} />
            </div>

            <p className="mt-4 text-sm font-bold uppercase tracking-wider text-purple-600">
              Rupiva Offers
            </p>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              More Beauty,
              <span className="text-purple-600"> More Savings.</span>
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              Discover special deals and offers designed to make your next salon
              experience even better.
            </p>
          </div>
        </div>
      </section>

      {/* Offers */}
      <section>
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-purple-600">
                Available Offers
              </p>

              <h2 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                Save on your next visit
              </h2>
            </div>

            <span className="hidden rounded-full bg-purple-100 px-3 py-1.5 text-xs font-bold text-purple-700 sm:block">
              {offers.length} Offers
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer) => {
              const Icon = offer.icon;
              const isCopied = copiedCode === offer.code;

              return (
                <article
                  key={offer.id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-purple-300 hover:shadow-md"
                >
                  {/* Offer Header */}
                  <div className="relative bg-purple-600 px-5 py-5">
                    <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-white/10" />

                    <div className="relative flex items-start justify-between gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 text-white">
                        <Icon size={21} />
                      </div>

                      <span className="rounded-full bg-white px-3 py-1 text-sm font-extrabold text-purple-600">
                        {offer.discount}
                      </span>
                    </div>

                    <h3 className="relative mt-4 text-lg font-bold text-white">
                      {offer.title}
                    </h3>
                  </div>

                  {/* Offer Body */}
                  <div className="p-5">
                    <p className="text-sm leading-6 text-slate-600">
                      {offer.description}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500">
                      <Clock3 size={15} />
                      {offer.validity}
                    </div>

                    {/* Coupon */}
                    <div className="mt-5 flex items-center gap-2 rounded-xl border border-dashed border-purple-300 bg-purple-50 p-2">
                      <div className="flex min-w-0 flex-1 items-center gap-2 px-2">
                        <Tag size={16} className="shrink-0 text-purple-600" />

                        <span className="truncate text-sm font-extrabold tracking-wide text-purple-700">
                          {offer.code}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => copyCode(offer.code)}
                        className="flex shrink-0 items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-2 text-xs font-bold text-white transition hover:bg-purple-700"
                      >
                        {isCopied ? (
                          <>
                            <Check size={14} />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            Copy
                          </>
                        )}
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-xs text-slate-500">
                        Apply at booking
                      </span>

                      <span className="flex items-center gap-1 text-xs font-bold text-purple-600">
                        View details
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* How to use */}
      <section className="bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-wider text-purple-600">
              How to use
            </p>

            <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Redeem your offer in 3 simple steps
            </h2>
          </div>

          <div className="mx-auto mt-7 grid max-w-4xl gap-4 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Choose an Offer",
                description: "Pick the offer that works best for you.",
              },
              {
                number: "02",
                title: "Copy the Code",
                description: "Copy the coupon code with one tap.",
              },
              {
                number: "03",
                title: "Book & Save",
                description: "Apply the offer during your booking.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center"
              >
                <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-sm font-extrabold text-purple-600">
                  {step.number}
                </span>

                <h3 className="mt-3 text-base font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-slate-50">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="rounded-3xl bg-purple-600 px-5 py-7 text-center shadow-lg sm:px-8 sm:py-9">
            <Sparkles className="mx-auto text-purple-200" size={25} />

            <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
              Ready for your next beauty appointment?
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-purple-100">
              Find a salon near you and make your appointment with Rupiva.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Offers;
