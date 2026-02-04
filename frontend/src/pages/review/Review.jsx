import { useState } from "react";
import { Link } from "react-router-dom";
import avatarImg from "../../assets/avatar.png";
import {
  FiStar,
  FiCalendar,
  FiThumbsUp,
  FiMessageSquare,
  FiSend,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import {
  useFetchAllReviewsQuery,
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useUpdateReviewMutation,
} from "../../app/features/review/reviewApi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { BsSortDown } from "react-icons/bs";

const Review = ({ bookId }) => {
  const { currentUser: user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [editingReviewId, setEditingReviewId] = useState(null);

  const {
    data: reviewData,
    isLoading,
    refetch,
  } = useFetchAllReviewsQuery({
    bookId: bookId,
    params: { sort: sortBy },
  });
  const reviews = reviewData?.data || [];

  const [createReview, { isLoading: isCreating }] = useCreateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();
  const [updateReview] = useUpdateReviewMutation();

  // Sort options
  const sortOptions = [
    { value: "latest", label: "Most Recent" },
    { value: "oldest", label: "Oldest" },
    { value: "mostHelpful", label: "Most Helpful" },
    { value: "negative", label: "Negative Reviews" },
  ];

  // Rating distribution
  const ratingDistribution = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  const handleEditReview = (review) => {
    setEditingReviewId(review._id);
    setRating(review.rating);
    setComment(review.comment);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write your review comment");
      return;
    }

    // 🔹 UPDATE MODE
    if (editingReviewId) {
      const updatePromise = updateReview({
        reviewId: editingReviewId,
        reviewData: {
          rating,
          comment: comment.trim(),
        },
      }).unwrap();

      toast.promise(updatePromise, {
        loading: "Updating review...",
        success: "Review updated successfully!",
        error: (err) => err?.data?.message || "Failed to update review",
      });

      await updatePromise;
    }
    // 🔹 CREATE MODE
    else {
      const createPromise = createReview({
        bookId,
        reviewData: {
          rating,
          comment: comment.trim(),
        },
      }).unwrap();

      toast.promise(createPromise, {
        loading: "Submitting your review...",
        success: "Review submitted successfully!",
        error: (err) => err?.data?.message || "Failed to submit review",
      });

      await createPromise;
    }

    setComment("");
    setRating(0);
    setEditingReviewId(null);
    refetch();
  };

  const handleDeleteReview = async (reviewId) => {
    const deletePromise = deleteReview(reviewId).unwrap();

    toast.promise(deletePromise, {
      loading: "Deleting review...",
      success: "Review deleted successfully!",
      error: (err) => err?.data?.message || "Failed to delete review",
    });

    await deletePromise;
    refetch();
  };

  const renderStars = (ratingValue, size = "md") => {
    const sizeClass = size === "lg" ? "w-6 h-6" : "w-4 h-4";
    return Array.from({ length: 5 }).map((_, i) => (
      <FiStar
        key={i}
        className={`${sizeClass} ${
          i < ratingValue ? "text-amber-400 fill-amber-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="mt-16 pt-8">
        <div className="h-8 w-48 bg-gray-200 rounded-lg mb-6 animate-pulse"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-gray-100 rounded-xl animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 pt-8">
      {/* Header - Responsive */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 md:mb-10">
        <div className="w-full lg:w-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Customer Reviews
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            See what other readers are saying about this book
          </p>
        </div>

        {/* Average Rating - Responsive */}
        <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 md:p-6 w-full lg:w-auto lg:min-w-[280px]">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <div className="text-3xl md:text-5xl font-bold text-gray-900">
              {reviewData?.meta?.averageRating}/5
            </div>
            <div>
              <div className="flex mb-1">
                {renderStars(Math.floor(reviewData?.meta?.averageRating), "md")}
              </div>
              <div className="text-xs md:text-sm text-gray-600">
                {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
          <div className="text-xs md:text-sm text-gray-500">
            Based on verified purchases
          </div>
        </div>
      </div>

      {/* Main Content Grid - Responsive */}
      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        {/* Left Column - Rating Summary */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* Rating Distribution */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6">
            <h3 className="font-semibold text-gray-900 mb-3 md:mb-4 text-lg md:text-xl">
              Rating Breakdown
            </h3>
            <div className="space-y-2 md:space-y-3">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingDistribution[star];
                const percentage =
                  reviews.length > 0 ? (count / reviews.length) * 100 : 0;

                return (
                  <div key={star} className="flex items-center gap-2 md:gap-3">
                    <div className="flex items-center gap-1 w-12 md:w-16">
                      <span className="text-xs md:text-sm text-gray-600">
                        {star}
                      </span>
                      <FiStar className="w-3 h-3 md:w-4 md:h-4 text-amber-400 fill-amber-400" />
                    </div>
                    <div className="flex-1">
                      <div className="h-1.5 md:h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-amber-400 to-orange-400 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 w-12 md:w-16 text-right">
                      {count} ({percentage.toFixed(0)}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Stats - Mobile Hidden on small screens, shown on md+ */}
        <div className="hidden md:block space-y-6">
          {/* Review Stats */}
          <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-xl md:rounded-2xl p-4 md:p-6">
            <h3 className="font-semibold text-gray-900 mb-3 md:mb-4 text-lg md:text-xl">
              Review Insights
            </h3>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm md:text-base text-gray-600">
                  Total Reviews
                </span>
                <span className="font-bold text-gray-900">
                  {reviews.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm md:text-base text-gray-600">
                  Verified Purchases
                </span>
                <span className="font-bold text-gray-900">
                  {reviews.filter((r) => r.status === "active").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm md:text-base text-gray-600">
                  Average Rating
                </span>
                <span className="font-bold text-gray-900">
                  {reviewData?.meta?.averageRating}/5
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm md:text-base text-gray-600">
                  5-Star Reviews
                </span>
                <span className="font-bold text-gray-900">
                  {ratingDistribution[5]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Stats - Only shown on small screens */}
      <div className="md:hidden mt-6">
        <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-xl p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Review Insights</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-xs text-gray-600">Total Reviews</span>
              <div className="font-bold text-gray-900">{reviews.length}</div>
            </div>
            <div>
              <span className="text-xs text-gray-600">Verified Purchases</span>
              <div className="font-bold text-gray-900">
                {reviews.filter((r) => r.status === "active").length}
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-600">Average Rating</span>
              <div className="font-bold text-gray-900">
                {reviewData?.meta?.averageRating}/5
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-600">5-Star Reviews</span>
              <div className="font-bold text-gray-900">
                {ratingDistribution[5]}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List and Form Layout - Responsive */}
      <div className="flex flex-col lg:flex-row justify-between gap-6 md:gap-8 pt-6 md:pt-10">
        {/* Reviews List Section */}
        <div className="lg:flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              {reviews.length} Customer Review{reviews.length !== 1 ? "s" : ""}
            </h3>
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
              <BsSortDown className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none focus:ring-0 focus:outline-none font-medium text-sm md:text-base appearance-none"
              >
                {sortOptions.map((option) => (
                  <option key={option?.value} value={option?.value}>
                    {option?.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="bg-white rounded-xl md:rounded-2xl p-8 md:p-12 text-center">
              <div className="text-4xl md:text-6xl mb-4">📝</div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                No reviews yet
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                Be the first to share your thoughts about this book
              </p>
            </div>
          ) : (
            <div className="space-y-4 md:space-y-6">
              {reviews?.map((review) => (
                <div
                  key={review._id}
                  className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 md:gap-4 mb-3 md:mb-4">
                    <div className="flex items-start gap-3 md:gap-4">
                      <img
                        src={review?.user?.avatar?.url || avatarImg}
                        alt="avatar"
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full ring-2 ring-indigo-100 object-cover object-center shrink-0"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm md:text-base">
                          {review.user.name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-1 md:gap-2 mt-1">
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-xs md:text-sm text-gray-600">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                      <button className="flex items-center gap-1 text-xs md:text-sm text-gray-600 hover:text-gray-900">
                        <FiThumbsUp className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="hidden sm:inline">Helpful</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                    {review.comment}
                  </p>

                  {/* Review Metadata */}
                  <div className="flex justify-between items-center gap-2 md:gap-4 mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-100 text-xs md:text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <FiCalendar className="w-3 h-3 md:w-4 md:h-4" />
                      <span>Reviewed on {formatDate(review.createdAt)}</span>
                    </div>
                    {user && user._id === review.user._id && (
                      <div className="flex gap-3 md:gap-4 items-center">
                        <button
                          onClick={() => handleEditReview(review)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-xs md:text-sm px-2 py-1 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <FiEdit2 />
                          Edit
                        </button>

                        <button
                          onClick={() => handleDeleteReview(review?._id)}
                          className="text-red-600 hover:text-red-800 font-medium text-xs md:text-sm px-2 py-1 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <FiTrash2 className="w-3 h-3 md:w-4 md:h-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More Button if needed */}
          {reviews.length > 5 && (
            <div className="mt-6 md:mt-8 text-center">
              <button className="px-4 py-2 md:px-6 md:py-3 border border-gray-300 text-gray-700 font-medium rounded-lg md:rounded-xl hover:bg-gray-50 transition-colors text-sm md:text-base">
                Load More Reviews
              </button>
            </div>
          )}
        </div>

        {/* Write Review Form - Responsive */}
        {user ? (
          <div className="lg:max-w-md w-full h-fit mt-6 lg:mt-12">
            <div className="bg-linear-to-r from-gray-50 to-gray-100 rounded-xl md:rounded-2xl p-4 md:p-6">
              <h3 className="font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2 text-lg md:text-xl">
                <FiEdit2 /> Write a Review
              </h3>
              <form
                onSubmit={handleSubmitReview}
                className="space-y-3 md:space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-1 md:gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-0.5 md:p-1 hover:scale-110 transition-transform"
                      >
                        <FiStar
                          className={`w-5 h-5 md:w-7 md:h-7 ${
                            star <= rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="ml-1 md:ml-2 text-gray-700 font-medium text-sm md:text-base">
                      {rating}/5
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this book. What did you like or dislike?"
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-sm md:text-base"
                    rows={3}
                    maxLength={500}
                  />
                  <div className="text-right text-xs md:text-sm text-gray-500 mt-1">
                    {comment.length}/500 characters
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isCreating || !comment.trim()}
                    className="px-4 py-2 md:px-6 md:py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg md:rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm md:text-base cursor-pointer"
                  >
                    <FiSend className="w-4 h-4 md:w-5 md:h-5" />
                    {editingReviewId ? "Update Review" : "Submit Review"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="lg:max-w-md w-full h-fit mt-6 lg:mt-12">
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl md:rounded-2xl p-4 md:p-6 text-center">
              <FiMessageSquare className="w-8 h-8 md:w-12 md:h-12 text-blue-400 mx-auto mb-3 md:mb-4" />
              <h3 className="font-semibold text-gray-900 mb-1 md:mb-2 text-lg md:text-xl">
                Share Your Thoughts
              </h3>
              <p className="text-gray-600 mb-3 md:mb-4 text-sm md:text-base">
                Login to share your experience with this book
              </p>
              <Link
                to="/login"
                className="px-4 py-2 md:px-6 md:py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all text-sm md:text-base"
              >
                Login to Review
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Review;
