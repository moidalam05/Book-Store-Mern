import { useState, forwardRef } from "react";
import {
  BsEnvelope,
  BsSend,
  BsCheckCircle,
  BsArrowRight,
  BsBook,
  BsStar,
  BsPercent,
} from "react-icons/bs";

const Newsletter = forwardRef((props, ref) => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Subscribed:", email);
      setIsSubscribed(true);
      setEmail("");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div ref={ref} className="min-h-screen py-12">
      <div>
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Join Our{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-purple-600">
              Reading Community
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Get weekly book recommendations, exclusive offers, and literary
            insights delivered directly to your inbox.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Newsletter Form Section */}
          <div className="bg-linear-to-br from-white to-gray-50 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 mb-16">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left Side - Form */}
              <div className="p-10 md:p-12 lg:p-14">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-linear-to-br from-indigo-100 to-purple-100 rounded-xl">
                    <BsEnvelope className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Newsletter Subscription
                  </h2>
                </div>

                {/* Success Message */}
                {isSubscribed && (
                  <div className="mb-8 p-5 bg-linear-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                    <div className="flex items-start gap-4">
                      <BsCheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-green-800 text-lg">
                          Welcome to our community!
                        </p>
                        <p className="text-green-700 mt-2">
                          Thank you for subscribing. You'll receive your first
                          newsletter soon.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div>
                    <label className="block text-lg font-medium text-gray-800 mb-3">
                      Your Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full px-6 py-4 pl-14 text-lg border-2 border-gray-300 rounded-2xl focus:ring-3 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all bg-white"
                        required
                      />
                      <BsEnvelope className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-linear-to-r from-indigo-600 to-purple-600 text-white text-lg font-semibold rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <BsSend className="w-6 h-6" />
                        Subscribe to Newsletter
                        <BsArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-10 pt-8 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">
                        10,000+
                      </div>
                      <div className="text-gray-600 mt-2">Active Readers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">
                        4.8
                      </div>
                      <div className="text-gray-600 mt-2">Avg. Rating</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Benefits */}
              <div className="bg-linear-to-br from-indigo-600 to-purple-600 p-10 md:p-12 lg:p-14 text-white">
                <h3 className="text-2xl font-bold mb-8">What You'll Receive</h3>

                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                      <BsBook className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">
                        Weekly Book Picks
                      </h4>
                      <p className="text-indigo-100">
                        Handpicked recommendations based on your interests
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                      <BsPercent className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">
                        Exclusive Discounts
                      </h4>
                      <p className="text-indigo-100">
                        Members-only deals and early access to sales
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/20 rounded-xl">
                      <BsStar className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Author Updates</h4>
                      <p className="text-indigo-100">
                        Latest news about your favorite authors and new releases
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/30">
                  <h4 className="font-bold text-lg mb-4">Our Promise</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>No spam, ever</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>Unsubscribe anytime</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span>Privacy first</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-3">📧</div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Weekly Edition
              </h4>
              <p className="text-gray-600">Delivered every Monday morning</p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-3">🎯</div>
              <h4 className="font-semibold text-gray-800 mb-2">Personalized</h4>
              <p className="text-gray-600">
                Content tailored to your reading preferences
              </p>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-3">🆓</div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Completely Free
              </h4>
              <p className="text-gray-600">No charges, just valuable content</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Newsletter;
