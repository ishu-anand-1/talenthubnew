import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-16 grid gap-12 md:grid-cols-4">

        {/* ================= BRAND ================= */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">
            🎵 TalentHub
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            The modern platform connecting world-class talent with the
            industry's best recruiters.
          </p>
        </div>

        {/* ================= FOR ARTISTS ================= */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            For Artists
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/learn" className="hover:text-white transition">
                Browse Tutorials
              </Link>
            </li>
            <li>
              <Link to="/upload" className="hover:text-white transition">
                Upload Portfolio
              </Link>
            </li>
            <li>
              <Link to="/talent" className="hover:text-white transition">
                Hiring Tips
              </Link>
            </li>
          </ul>
        </div>

        {/* ================= FOR RECRUITERS ================= */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            For Recruiters
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/recruiter/dashboard" className="hover:text-white transition">
                Discover Talent
              </Link>
            </li>
            <li>
              <Link to="/recruiter/dashboard" className="hover:text-white transition">
                Recruiter Dashboard
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="hover:text-white transition">
                Pricing
              </Link>
            </li>
          </ul>
        </div>

        {/* ================= COMPANY ================= */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            Company
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/about" className="hover:text-white transition">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-white transition">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-sm text-gray-400">
          © 2026 <span className="text-white font-semibold">TalentHub</span>. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
