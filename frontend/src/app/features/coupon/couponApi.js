import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}/api/v1/coupons`,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const couponsApi = createApi({
  reducerPath: "couponsApi",
  baseQuery,
  tagTypes: ["Coupons"],
  endpoints: (builder) => ({
    // ==================== APPLY COUPON ====================
    applyCoupon: builder.mutation({
      query: ({ code }) => ({
        url: "/apply-coupon",
        method: "POST",
        body: { code },
      }),
      invalidatesTags: ["Cart"],
    }),

    // ==================== REMOVE COUPON ====================
    removeCoupon: builder.mutation({
      query: () => ({
        url: "/remove-coupon",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    // ==================== CREATE COUPON ====================
    createCoupon: builder.mutation({
      query: (data) => ({
        url: "/create-coupon",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Coupons"],
    }),

    // ==================== GET ALL COUPONS ====================
    getAllCoupons: builder.query({
      query: (params = {}) => ({
        url: "/",
        method: "GET",
        params,
      }),
      providesTags: ["Coupons"],
    }),

    // ==================== GET COUPON BY ID====================
    getCouponById: builder.query({
      query: (couponId) => ({
        url: `/${couponId}`,
        method: "GET",
      }),
      providesTags: ["Coupons"],
    }),

    // ==================== TOGGLE COUPON STATUS ====================
    toggleCouponStatus: builder.mutation({
      query: (couponId) => ({
        url: `/${couponId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Coupons"],
    }),

    // ==================== UPDATE COUPON ====================
    updateCoupon: builder.mutation({
      query: ({ couponId, data }) => ({
        url: `/${couponId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Coupons"],
    }),

    // ==================== DELETE COUPON ====================
    deleteCoupon: builder.mutation({
      query: (couponId) => ({
        url: `coupon/${couponId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coupons"],
    }),
  }),
});

export const {
  useApplyCouponMutation,
  useRemoveCouponMutation,
  useCreateCouponMutation,
  useGetAllCouponsQuery,
  useGetCouponByIdQuery,
  useToggleCouponStatusMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = couponsApi;
