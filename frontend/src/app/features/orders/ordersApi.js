import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../../utils/baseUrl.js";

const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/v1/orders`,
  credentials: "include",
});

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery,
  tagTypes: ["Orders"],
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
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),

    // ==================== FETCH ALL ORDERS ====================
    getAllOrders: builder.query({
      query: () => "/",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((order) => ({
                type: "Orders",
                id: order._id,
              })),
              { type: "Orders", id: "LIST" },
            ]
          : [{ type: "Orders", id: "LIST" }],
    }),

    // ==================== FETCH ORDER BY ID ====================
    getOrderById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Orders", id }],
    }),

    // ==================== FETCH ORDER BY ID ====================
    getAllOrdersByUserEmail: builder.query({
      query: (email) => `/email/${email}`,
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((order) => ({
                type: "Orders",
                id: order._id,
              })),
              { type: "Orders", id: "LIST" },
            ]
          : [{ type: "Orders", id: "LIST" }],
    }),

    // ==================== UPDATE ORDER STATUS ====================
    updateOrderStatus: builder.mutation({
      query: ({ id, ...updatedOrder }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: updatedOrder,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Orders", id },
        { type: "Orders", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useGetAllOrdersByUserEmailQuery,
  useUpdateOrderStatusMutation,
} = ordersApi;
