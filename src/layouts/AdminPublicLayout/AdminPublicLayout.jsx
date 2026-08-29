import { ShieldCheck } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

export default function AdminPublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Public Navbar */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link to="/admin/login" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <ShieldCheck size={21} />
            </div>

            <div>
              <h1 className="font-bold text-slate-900">Rupiva</h1>

              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </Link>

          {/* Back to Website */}
          <Link
            to="/"
            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-600"
          >
            Back to Website
          </Link>
        </div>
      </header>

      {/* Public Admin Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
