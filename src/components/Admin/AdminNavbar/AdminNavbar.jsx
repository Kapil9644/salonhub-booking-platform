import { Bell, ShieldCheck } from "lucide-react";

export default function AdminNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
            <ShieldCheck size={21} />
          </div>

          <div>
            <h1 className="font-bold text-slate-900">SalonHub</h1>

            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="relative rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-purple-600"
            aria-label="Notifications"
          >
            <Bell size={21} />

            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <div className="hidden h-8 w-px bg-gray-200 sm:block" />

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-600">
              A
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">
                Administrator
              </p>

              <p className="text-xs text-gray-500">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
