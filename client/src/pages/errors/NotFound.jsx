import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  return (
    <main
      role="main"
      className="
        min-h-screen
        flex items-center justify-center
        bg-gradient-to-br
        from-gray-100 to-gray-200
        dark:from-gray-900 dark:to-gray-950
        px-4
      "
    >
      <section
        aria-labelledby="not-found-title"
        className="
          bg-white dark:bg-gray-900
          rounded-3xl
          shadow-2xl
          p-10
          max-w-md w-full
          text-center
          border border-gray-200 dark:border-gray-800
        "
      >
        {/* ICON */}
        <AlertTriangle
          aria-hidden="true"
          className="w-14 h-14 text-indigo-600 mx-auto mb-4"
        />

        {/* TITLE */}
        <h1
          id="not-found-title"
          className="text-4xl font-extrabold text-gray-800 dark:text-white mb-2"
        >
          404
        </h1>

        {/* SUBTITLE */}
        <p className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-3">
          Page Not Found
        </p>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          The page you’re looking for doesn’t exist, was removed,
          or the URL may be incorrect.
        </p>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link
            to="/"
            className="
              px-6 py-2
              rounded-lg
              bg-indigo-600
              text-white
              font-medium
              hover:bg-indigo-700
              transition
            "
          >
            Go Home
          </Link>

          <Link
            to="/explore"
            className="
              px-6 py-2
              rounded-lg
              border border-indigo-600
              text-indigo-600
              hover:bg-indigo-50
              dark:hover:bg-gray-800
              transition
            "
          >
            Explore Talent
          </Link>
        </div>
      </section>
    </main>
  );
};

export default NotFound;
