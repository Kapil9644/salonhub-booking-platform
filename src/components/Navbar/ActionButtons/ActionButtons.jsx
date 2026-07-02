export default function ActionButtons() {
  return (
    <div className="flex items-center gap-4">
      <button className="rounded-2xl border border-purple-600 px-6 py-2 font-medium text-purple-600 transition-all duration-200 hover:bg-purple-50">
        Login
      </button>

      <button className="rounded-2xl bg-purple-600 px-6 py-2 font-medium text-white transition-all duration-200 hover:bg-purple-700">
        Sign Up
      </button>
    </div>
  );
}