import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}/api/v1/cart`,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery,
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    // ==================== FETCH ALL CART ITEMS ====================
    getCart: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      providesTags: ["Cart"],
      refetchOnMountOrArgChange: true,
    }),

    // ==================== ADD TO CART ====================
    addToCart: builder.mutation({
      query: ({ bookId, quantity = 1 }) => ({
        url: "/add-to-cart",
        method: "POST",
        body: { bookId, quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

    // ==================== REMOVE ITEM FROM CART ====================
    removeFromCart: builder.mutation({
      query: (bookId) => ({
        url: `/remove-item/${bookId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    // ==================== CLEAR CART =============================
    clearCart: builder.mutation({
      query: () => ({
        url: "/",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    // ==================== UPDATE CART =============================
    updateCart: builder.mutation({
      query: ({ bookId, quantity }) => ({
        url: `/update-cart/${bookId}`,
        method: "PUT",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
  useUpdateCartMutation,
} = cartApi;
