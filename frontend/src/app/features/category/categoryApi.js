import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../../utils/baseUrl";

export const categoryApi = createApi({
  reducerPath: "categoryApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/v1/categories`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),

  tagTypes: ["Categories"],

  endpoints: (builder) => ({
    // ==================== CREATE CATEGORY ====================
    createCategory: builder.mutation({
      query: (data) => ({
        url: "/create-category",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),

    // ==================== FETCH ALL CATEGORIES ====================
    fetchAllCategories: builder.query({
      query: (params) => ({
        url: "/",
        params: params ?? undefined,
      }),
      providesTags: ["Categories"],
    }),

    // ==================== FETCH CATEGORY BY ID ====================
    fetchCategoryById: builder.query({
      query: (categoryId) => ({
        url: `/${categoryId}`,
      }),
      providesTags: ["Categories"],
    }),

    // ==================== UPDATE CATEGORY ====================
    updateCategory: builder.mutation({
      query: ({ categoryId, data }) => ({
        url: `/${categoryId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),

    // ==================== UPDATE CATEGORY STATUS ====================
    updateCategoryStatus: builder.mutation({
      query: (categoryId) => ({
        url: `/${categoryId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Categories"],
    }),

    // ==================== DELETE CATEGORY ====================
    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useFetchAllCategoriesQuery,
  useFetchCategoryByIdQuery,
  useUpdateCategoryMutation,
  useUpdateCategoryStatusMutation,
  useDeleteCategoryMutation,
} = categoryApi;
