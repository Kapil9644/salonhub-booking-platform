import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function ActionButtons({
  mobile = false,
  onClick = () => {},
  showUser = true,
}) {
  const { user, logout } = useAuth();
  return (
    <div className={mobile ? "flex flex-col gap-3" : "flex items-center gap-4"}>
      {user ? (
        <>
          {showUser && (
            <span className="font-medium text-gray-700">
              👤 {user.fullName}
            </span>
          )}

          <button
            onClick={() => {
              logout();
              onClick();
            }}
            className="rounded-2xl bg-red-500 px-6 py-2 text-white hover:bg-red-600"
          >
            Logout
          </button>
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
