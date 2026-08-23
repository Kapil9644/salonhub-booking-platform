import { Bell, Store } from "lucide-react";

export default function SalonOwnerNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-5 sm:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600">
            <Store size={21} className="text-white" />
          </div>

          <div>
            <h1 className="font-bold text-slate-900">SalonHub</h1>

            <p className="text-xs text-gray-500">For Business</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <button
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-purple-600"
            aria-label="Notifications"
          >
            <Bell size={21} />
          </button>

          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 font-semibold text-purple-600">
              SO
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Salon Owner
              </p>

              <p className="text-xs text-gray-500">Owner Account</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
