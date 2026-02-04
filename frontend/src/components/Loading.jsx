const Loading = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-white flex flex-col items-center justify-center p-4">
      {/* Book Logo with Animation */}
      <div className="relative mb-8">
        <div className="w-20 h-20 bg-linear-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
          <div className="w-10 h-12 bg-linear-to-br from-indigo-500 to-purple-600 rounded transform rotate-12 animate-pulse"></div>
        </div>

        {/* Page turning effect */}
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-linear-to-br from-indigo-600 to-purple-600 rounded-lg animate-flip"></div>
      </div>

      {/* Loading Text */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 animate-pulse">
          Loading
        </h2>
        <p className="text-gray-600">Getting things ready...</p>
      </div>

      {/* Simple Spinner */}
      <div className="w-16 h-16 border-4 border-gray-200 rounded-full relative">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-indigo-600 border-r-purple-600 rounded-full animate-spin"></div>
      </div>

      <style jsx>{`
        @keyframes flip {
          0%,
          100% {
            transform: rotateY(0deg);
          }
          50% {
            transform: rotateY(180deg);
          }
        }
        .animate-flip {
          animation: flip 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Loading;
