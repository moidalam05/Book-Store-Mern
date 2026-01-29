import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../../utils/baseUrl.js";

const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/v1/orders`,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});
export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery,
  tagTypes: ["Cart", "Orders", "Dashboard"],
  endpoints: (builder) => ({
    // ==================== CREATE ORDER ====================
    createOrder: builder.mutation({
      query: (newOrder) => ({
        url: "/create-order",
        method: "POST",
        body: newOrder,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: [
        "Cart",
        { type: "Orders", id: "LIST" },
        { type: "Dashboard", id: "LIST" },
      ],
    }),

    // ==================== VERIFY PAYMENT ====================
    verifyPayment: builder.mutation({
      query: (paymentData) => ({
        url: "/verify-payment",
        method: "POST",
        body: paymentData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: [
        "Cart",
        { type: "Orders", id: "LIST" },
        { type: "Dashboard", id: "LIST" },
      ],
    }),

    // ==================== VERIFY ORDER ====================
    verifyOrder: builder.mutation({
      query: (orderId) => ({
        url: `/verify/${orderId}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: [
        { type: "Orders", id: "LIST" },
        { type: "Dashboard", id: "LIST" },
      ],
    }),

    // ==================== GET ALL ORDERS (USER) ====================
    getMyOrders: builder.query({
      query: (params = {}) => ({
        url: "/my-orders",
        method: "GET",
        params,
      }),
      providesTags: ["Orders"],
    }),

    // ==================== GET ORDERS BY ID (USER) ====================
    getMyOrderById: builder.query({
      query: (orderId) => ({
        url: `/my-orders/${orderId}`,
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),

    // ==================== CANCEL ORDER (USER) ====================
    cancelOrder: builder.mutation({
      query: (orderId) => ({
        url: `/cancel/${orderId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Orders"],
    }),

    // ==================== GET ALL ORDERS (ADMIN) ====================
    getAllOrders: builder.query({
      query: (params = {}) => ({
        url: "/",
        method: "GET",
        params,
      }),
      providesTags: ["Orders"],
    }),

    // ==================== UPDATE ORDER STATUS (ADMIN) ====================
    updateOrderStatus: builder.mutation({
      query: ({ orderId, orderStatus }) => ({
        url: `/${orderId}`,
        method: "PATCH",
        body: { orderStatus },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Orders", { type: "Dashboard", id: "LIST" }],
    }),

    // ==================== GET ORDERS BY ID (ADMIN) ====================
    getOrderById: builder.query({
      query: (orderId) => ({
        url: `/${orderId}`,
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
  useVerifyOrderMutation,
  useGetMyOrdersQuery,
  useGetMyOrderByIdQuery,
  useCancelOrderMutation,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetOrderByIdQuery,
} = ordersApi;
