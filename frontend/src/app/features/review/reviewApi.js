import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../../utils/baseUrl.js";

const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/v1/reviews`,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const reviewsApi = createApi({
  reducerPath: "reviewsApi",
  baseQuery,
  tagTypes: ["Reviews"],
  endpoints: (builder) => ({
    // ==================== FETCH ALL REVIEWS ====================
    fetchAllReviews: builder.query({
      query: ({ bookId, params = {} }) => {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, value);
          }
        });

        return {
          url: `/${bookId}`,
          params,
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((review) => ({
                type: "Reviews",
                id: review._id,
              })),
              { type: "Reviews", id: "LIST" },
            ]
          : [{ type: "Reviews", id: "LIST" }],
    }),

    // ==================== CREATE REVIEW ====================
    createReview: builder.mutation({
      query: ({ bookId, reviewData }) => ({
        url: `/create-review/${bookId}`,
        method: "POST",
        body: reviewData,
      }),
      invalidatesTags: [{ type: "Reviews", id: "LIST" }],
    }),

    // ==================== DELETE REVIEW ====================
    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, reviewId) => [
        { type: "Reviews", id: reviewId },
      ],
    }),

    // ==================== UPDATE REVIEW ====================
    updateReview: builder.mutation({
      query: ({ reviewId, reviewData }) => ({
        url: `/${reviewId}`,
        method: "PUT",
        body: reviewData,
      }),
      invalidatesTags: (result, error, { reviewId }) => [
        { type: "Reviews", id: reviewId },
      ],
    }),
  }),
});

export const {
  useFetchAllReviewsQuery,
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useUpdateReviewMutation,
} = reviewsApi;
