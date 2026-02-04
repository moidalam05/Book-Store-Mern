import { MdOutlineConstruction, MdOutlineErrorOutline } from "react-icons/md";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen ">
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
        <div className="max-w-4xl w-full mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-linear-to-r from-purple-100 to-indigo-100 flex items-center justify-center border-4 border-white shadow-xl">
                  <MdOutlineErrorOutline className="text-4xl text-purple-600" />
                </div>
                <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-linear-to-r from-amber-500 to-orange-600 flex items-center justify-center border-4 border-white shadow-lg">
                  <MdOutlineConstruction className="text-xl text-white" />
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4">
              <span className="bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                404
              </span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              The page you're looking for doesn't exist or is currently under
              development. Our team is working hard to bring you amazing new
              features!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
