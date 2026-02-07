import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const REDIRECT_SECONDS = 5;

const VerifiedPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(REDIRECT_SECONDS);

  /* ================= AUTO REDIRECT ================= */
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate("/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-emerald-100 to-green-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      
      <div
        className="
          bg-white dark:bg-gray-900
          rounded-3xl shadow-2xl
          p-8 md:p-10
          max-w-md w-full
          text-center
          animate-[fadeIn_0.4s_ease-in]
        "
      >
        {/* ICON */}
        <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-5 animate-bounce" />

        {/* TITLE */}
        <h1 className="text-3xl font-extrabold text-green-700 dark:text-green-400 mb-3">
          Verification Successful 🎉
        </h1>

        {/* DESCRIPTION */}
        <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          Your account has been verified successfully.
          <br />
          You can now log in and start using{" "}
          <span className="font-semibold text-indigo-600">
            TalentHub
          </span>.
        </p>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/login"
            className="
              px-6 py-2.5
              bg-green-600 text-white
              rounded-xl shadow
              font-semibold
              hover:bg-green-700
              transition
              hover:scale-105
            "
          >
            Go to Login
          </Link>

          <Link
            to="/"
            className="
              px-6 py-2.5
              border border-green-600
              text-green-600
              rounded-xl
              font-semibold
              hover:bg-green-50
              dark:hover:bg-gray-800
              transition
            "
          >
            Back to Home
          </Link>
        </div>

        {/* COUNTDOWN */}
        <p className="text-xs text-gray-400 mt-6">
          Redirecting to login in{" "}
          <span className="font-semibold">{countdown}</span>s...
        </p>
      </div>
    </div>
  );
};

export default VerifiedPage;
