import TopNavbar from "../components/admin/TopNavbar";

function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0B1120]">

      <TopNavbar />

      <main className="max-w-[1700px] mx-auto px-8 py-8">

        {children}

      </main>

    </div>
  );
}

export default AdminLayout;