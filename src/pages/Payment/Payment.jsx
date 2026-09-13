import {
  ArrowDownLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  IndianRupee,
  ReceiptText,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

const Payment = () => {
  const transactions = [
    {
      id: "RUP-10248",
      salon: "Premium Salon",
      service: "Haircut & Styling",
      date: "12 Sep 2026",
      time: "11:45 AM",
      method: "UPI",
      amount: 450,
      status: "Completed",
    },
    {
      id: "RUP-10192",
      salon: "Glow Beauty Studio",
      service: "Hair Spa",
      date: "05 Sep 2026",
      time: "04:20 PM",
      method: "Credit Card",
      amount: 700,
      status: "Completed",
    },
    {
      id: "RUP-10147",
      salon: "Style Point",
      service: "Beard Styling",
      date: "28 Aug 2026",
      time: "07:10 PM",
      method: "Cash",
      amount: 250,
      status: "Completed",
    },
  ];
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
              <CreditCard size={22} />
            </div>

            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-purple-600">
                Rupiva
              </p>

              <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                Payments
              </h1>

              <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                Manage your payments and view your transaction history.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Payment Overview */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Total Spent */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <IndianRupee size={20} />
              </div>

              <ArrowDownLeft size={18} className="text-slate-300" />
            </div>

            <p className="mt-4 text-xs font-semibold text-slate-500">
              Total Spent
            </p>

            <p className="mt-1 text-2xl font-extrabold text-slate-900">
              ₹1,400
            </p>
          </div>

          {/* Transactions */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <ReceiptText size={20} />
            </div>

            <p className="mt-4 text-xs font-semibold text-slate-500">
              Transactions
            </p>

            <p className="mt-1 text-2xl font-extrabold text-slate-900">
              {transactions.length}
            </p>
          </div>

          {/* Payment Security */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-2 lg:col-span-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <ShieldCheck size={20} />
            </div>

            <p className="mt-4 text-xs font-semibold text-slate-500">
              Payment Security
            </p>

            <p className="mt-1 text-base font-extrabold text-slate-900">
              Secure & Protected
            </p>
          </div>
        </section>

        {/* Payment Methods */}
        <section className="mt-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <WalletCards size={20} />
              </div>

              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Payment Methods
                </h2>

                <p className="text-xs text-slate-500">
                  Your available payment options
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-purple-600 shadow-sm">
                  <CreditCard size={18} />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Card Payment
                  </p>
                  <p className="text-xs text-slate-500">Debit / Credit Card</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-purple-600 shadow-sm">
                  <WalletCards size={18} />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">UPI</p>
                  <p className="text-xs text-slate-500">
                    Pay using your UPI app
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-purple-600 shadow-sm">
                  <IndianRupee size={18} />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Cash at Salon
                  </p>
                  <p className="text-xs text-slate-500">
                    Pay directly at the salon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Transaction History */}
        <section className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-purple-600">
                Payment History
              </p>

              <h2 className="mt-1 text-xl font-extrabold text-slate-900 sm:text-2xl">
                Recent Transactions
              </h2>
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="hidden grid-cols-[1.25fr_0.9fr_0.75fr_0.7fr_0.9fr_0.7fr] gap-3 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 md:grid">
              <span>Salon / Service</span>
              <span>Transaction ID</span>
              <span>Date</span>
              <span>Time</span>
              <span>Payment Method</span>
              <span>Amount / Status</span>
            </div>

            <div className="divide-y divide-slate-100">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="p-4 transition hover:bg-slate-50 sm:p-5 md:grid md:grid-cols-[1.25fr_0.9fr_0.75fr_0.7fr_0.9fr_0.7fr] md:items-center md:gap-3"
                >
                  {/* Salon / Service */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                      <ReceiptText size={17} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {transaction.salon}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {transaction.service}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Details */}
                  <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 md:hidden">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">
                        Transaction ID
                      </p>

                      <p className="mt-0.5 text-xs font-semibold text-slate-600">
                        {transaction.id}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">
                        Payment Date
                      </p>

                      <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-slate-600">
                        <CalendarDays size={13} />
                        {transaction.date}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">
                        Payment Time
                      </p>

                      <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-slate-600">
                        <Clock3 size={13} />
                        {transaction.time}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">
                        Payment Method
                      </p>

                      <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-slate-600">
                        <CreditCard size={13} />
                        {transaction.method}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">
                        Amount
                      </p>

                      <p className="mt-0.5 text-sm font-extrabold text-slate-900">
                        ₹{transaction.amount}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">
                        Status
                      </p>

                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-700">
                        <CheckCircle2 size={13} />
                        {transaction.status}
                      </span>
                    </div>
                  </div>

                  {/* Desktop Transaction ID */}
                  <p className="hidden truncate text-xs font-semibold text-slate-600 md:block">
                    {transaction.id}
                  </p>

                  {/* Desktop Date */}
                  <p className="hidden text-xs font-semibold text-slate-600 md:block">
                    {transaction.date}
                  </p>

                  {/* Desktop Time */}
                  <p className="hidden text-xs font-semibold text-slate-600 md:block">
                    {transaction.time}
                  </p>

                  {/* Desktop Payment Method */}
                  <div className="hidden items-center gap-1.5 md:flex">
                    <CreditCard
                      size={14}
                      className="shrink-0 text-purple-500"
                    />

                    <span className="truncate text-xs font-semibold text-slate-600">
                      {transaction.method}
                    </span>
                  </div>

                  {/* Desktop Amount + Status */}
                  <div className="hidden md:block">
                    <p className="text-sm font-extrabold text-slate-900">
                      ₹{transaction.amount}
                    </p>

                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-700">
                      <CheckCircle2 size={11} />
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Note */}
        <section className="mt-6 rounded-2xl border border-purple-100 bg-purple-50 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck
              size={19}
              className="mt-0.5 shrink-0 text-purple-600"
            />

            <div>
              <h3 className="text-sm font-bold text-purple-900">
                Your payments are important to us
              </h3>

              <p className="mt-1 text-xs leading-5 text-purple-700">
                Always verify the payment amount and booking details before
                completing a transaction. Never share your OTP, PIN or banking
                password with anyone.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Payment;
