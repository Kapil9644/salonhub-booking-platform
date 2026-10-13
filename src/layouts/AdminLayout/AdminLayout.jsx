import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "../../components/Admin/AdminNavbar/AdminNavbar";
import AdminSidebar from "../../components/Admin/AdminSidebar/AdminSidebar";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar
        onMenuClick={() => setIsSidebarOpen((current) => !current)}
      />

      <div className="flex">
        <AdminSidebar
          isMobileOpen={isSidebarOpen}
          onMobileClose={handleCloseSidebar}
        />

        <main className="min-w-0 flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
