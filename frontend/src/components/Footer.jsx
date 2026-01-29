import footerLogo from "../assets/footer-logo.png";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaPinterestP,
  FaBook,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaShippingFast,
} from "react-icons/fa";
import {
  BsArrowRight,
  BsShieldCheck,
  BsCreditCard,
  BsHeadphones,
  BsGift,
} from "react-icons/bs";

const Footer = () => {
  const footerLinks = {
    "Shop By Category": [
      { name: "Fiction", count: 245 },
      { name: "Non-Fiction", count: 189 },
      { name: "Business", count: 156 },
      { name: "Technology", count: 134 },
      { name: "Self-Help", count: 98 },
      { name: "Biographies", count: 76 },
    ],
    "Quick Links": [
      "Home",
      "Best Sellers",
      "New Arrivals",
      "Featured Books",
      "Authors",
      "Book Clubs",
    ],
    "Customer Service": [
      "My Account",
      "Order Tracking",
      "Shipping Info",
      "Returns & Exchanges",
      "FAQ",
      "Contact Us",
    ],
  };

  const features = [
    {
      icon: <BsShieldCheck />,
      title: "Secure Payment",
      desc: "100% secure transactions",
    },
    {
      icon: <FaShippingFast />,
      title: "Free Shipping",
      desc: "On orders over $50",
    },
    {
      icon: <BsHeadphones />,
      title: "24/7 Support",
      desc: "Dedicated customer service",
    },
    { icon: <BsGift />, title: "Gift Cards", desc: "Perfect for book lovers" },
    {
      icon: <BsCreditCard />,
      title: "Easy Returns",
      desc: "30-day return policy",
    },
  ];

  return (
    <footer className="bg-linear-to-b from-gray-900 to-gray-950 text-white">
      {/* Features Banner */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 hover:bg-gray-800/30 rounded-xl transition-colors group"
              >
                <div className="p-3 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                  <span className="text-xl">{feature.icon}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">{feature.title}</h4>
                  <p className="text-sm text-gray-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-linear-to-r from-indigo-500 to-purple-600 rounded-lg">
                <FaBook className="text-xl" />
              </div>
              <img src={footerLogo} alt="BookStore Logo" className="h-10" />
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Your trusted online bookstore since 2010. We bring the world's
              best literature to your doorstep with curated collections and
              personalized recommendations.
            </p>

            {/* Contact Info */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-gray-400" />
                <span className="text-gray-300">
                  123 Book Street, Literary City
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FaPhone className="text-gray-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3">
                <FaEnvelope className="text-gray-400" />
                <span className="text-gray-300">support@bookstore.com</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <div key={category}>
              <h4 className="text-lg font-semibold mb-6 relative pb-2 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-12 after:h-0.5 after:bg-linear-to-r after:from-indigo-500 after:to-purple-600">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white hover:translate-x-1 transition-all flex items-center justify-between group"
                    >
                      <span className="flex items-center gap-2">
                        {typeof link === "object" ? (
                          <>
                            {link.name}
                            <span className="text-xs px-1.5 py-0.5 bg-gray-800 rounded-full text-gray-400">
                              {link.count}
                            </span>
                          </>
                        ) : (
                          link
                        )}
                      </span>
                      <BsArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Copyright */}
            <div className="text-gray-500 text-sm">
              <p>
                &copy; {new Date().getFullYear()} BookStore. All rights
                reserved.
              </p>
              <p className="mt-1">Made with ❤️ for book lovers worldwide</p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-sm mr-2">Follow us:</span>
              {[
                { icon: <FaFacebookF />, label: "Facebook" },
                { icon: <FaTwitter />, label: "Twitter" },
                { icon: <FaInstagram />, label: "Instagram" },
                { icon: <FaLinkedinIn />, label: "LinkedIn" },
                { icon: <FaYoutube />, label: "YouTube" },
                { icon: <FaPinterestP />, label: "Pinterest" },
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className="p-2 bg-gray-800 hover:bg-linear-to-r hover:from-indigo-600 hover:to-purple-600 rounded-lg transition-all hover:scale-110"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap gap-4 text-sm">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Cookie Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Accessibility
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Sitemap
              </a>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <p className="text-gray-400 text-sm mb-4">We accept:</p>
            <div className="flex flex-wrap gap-4">
              {[
                "Visa",
                "MasterCard",
                "PayPal",
                "Apple Pay",
                "Google Pay",
                "Amex",
              ].map((method, index) => (
                <div
                  key={index}
                  className="px-3 py-1.5 bg-gray-800/50 rounded-lg text-sm text-gray-300"
                >
                  {method}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 p-3 bg-linear-to-r from-indigo-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all z-50"
        aria-label="Back to top"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;
