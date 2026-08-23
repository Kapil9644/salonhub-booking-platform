import { Outlet } from "react-router-dom";
import AdminNavbar from "../../components/Admin/AdminNavbar/AdminNavbar";
import AdminSidebar from "../../components/Admin/AdminSidebar/AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <div className="flex">
        <AdminSidebar />

        <main className="min-w-0 flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
