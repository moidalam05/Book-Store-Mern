import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}/api/v1/books`,
  credentials: "include",
  prepareHeaders: (Headers) => {
    const token = localStorage.getItem("token");
    if (token) Headers.set("Authorization", `Bearer ${token}`);
    return Headers;
  },
});

export const booksApi = createApi({
  reducerPath: "bookApi",
  baseQuery,
  tagTypes: ["Books"],
  endpoints: (builder) => ({
    // ==================== FETCH ALL ====================
    fetchAllBooks: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, value);
          }
        });

        return `/?${searchParams.toString()}`;
      },

      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((book) => ({
                type: "Books",
                id: book._id,
              })),
              { type: "Books", id: "LIST" },
            ]
          : [{ type: "Books", id: "LIST" }],
    }),

    // ==================== FETCH BY ID ====================
    fetchBookById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Books", id }],
    }),

    // ==================== CREATE BOOK ====================
    createBook: builder.mutation({
      query: (newBook) => ({
        url: "/create-book",
        method: "POST",
        body: newBook,
        credentials: "include",
      }),
      invalidatesTags: [{ type: "Books", id: "LIST" }],
    }),

    // ==================== GENERATE DESCRITION BY AI ====================
    generateDescriptionByAi: builder.mutation({
      query: ({title}) => ({
        url: "/generate-description",
        method: "POST",
        body: { title },
      }),
      invalidatesTags: [{ type: "Books", id: "LIST" }],
    }),

    // ==================== UPDATE BOOK ====================
    updateBook: builder.mutation({
      query: ({ id, ...updatedBook }) => ({
        url: `/edit/${id}`,
        method: "PUT",
        body: updatedBook,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Books", id },
        { type: "Books", id: "LIST" },
      ],
    }),

    // ==================== UPDATE BOOK STATUS ====================
    updateBookStatus: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Books", id },
        { type: "Books", id: "LIST" },
      ],
    }),

    // ==================== DELETE BOOK ====================
    deleteBook: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Books", id },
        { type: "Books", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useFetchAllBooksQuery,
  useFetchBookByIdQuery,
  useCreateBookMutation,
  useGenerateDescriptionByAiMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useUpdateBookStatusMutation,
} = booksApi;
