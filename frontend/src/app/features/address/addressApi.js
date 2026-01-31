import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}/api/v1/addresses`,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const addressApi = createApi({
  reducerPath: "addressApi",
  baseQuery,
  tagTypes: ["Address"],
  endpoints: (builder) => ({
    // ==================== FETCH ALL ADDRESSES ====================
    getAddresses: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      providesTags: ["Address"],
    }),

    // ==================== ADD ADDRESS ====================
    createAddress: builder.mutation({
      query: (data) => ({
        url: "/create-address",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Address"],
    }),

    // ==================== UPDATE ADDRESS ====================
    updateAddress: builder.mutation({
      query: ({ addressId, data }) => ({
        url: `/${addressId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Address"],
    }),

    // ==================== SET DEFAULT ADDRESS ====================
    setDefaultAddress: builder.mutation({
      query: ({ addressId }) => ({
        url: `/${addressId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Address"],
    }),

    // ==================== DELETE ADDRESS ====================
    deleteAddress: builder.mutation({
      query: ({ addressId }) => ({
        url: `/${addressId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Address"],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} = addressApi;
