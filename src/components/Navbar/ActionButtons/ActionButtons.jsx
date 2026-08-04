import { Link } from "react-router-dom";

export default function ActionButtons({ mobile = false, onClick = () => {} }) {
  return (
    <div className={mobile ? "flex flex-col gap-3" : "flex items-center gap-4"}>
      <Link
        to="/login"
        onClick={onClick}
        className="rounded-2xl border border-purple-600 px-6 py-2 text-center font-medium text-purple-600 transition-all duration-200 hover:bg-purple-50"
      >
        Login
      </Link>

      <Link
        to="/signup"
        onClick={onClick}
        className="rounded-2xl bg-purple-600 px-6 py-2 text-center font-medium text-white transition-all duration-200 hover:bg-purple-700"
      >
        Sign Up
      </Link>
    </div>
  );
}
