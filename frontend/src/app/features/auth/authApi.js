import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}/api/v1/auth`,
  credentials: "include",
  prepareHeaders: (Headers) => {
    const token = localStorage.getItem("token");
    if (token) Headers.set("Authorization", `Bearer ${token}`);
    return Headers;
  },
});

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  tagTypes: ["Users", "Dashboard"],
  endpoints: (builder) => ({
    // ==================== CREATE USER ====================
    createUser: builder.mutation({
      query: (newUser) => ({
        url: "/register",
        method: "POST",
        body: newUser,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: [
        { type: "Users", id: "LIST" },
        { type: "Dashboard", id: "LIST" },
      ],
    }),

    // ==================== CREATE ADMIN ====================
    createAdmin: builder.mutation({
      query: (newAdmin) => ({
        url: "/create-admin",
        method: "POST",
        body: newAdmin,
        credentials: "include",
      }),
      invalidatesTags: [
        { type: "Users", id: "LIST" },
        { type: "Dashboard", id: "LIST" },
      ],
    }),

    // ==================== LOGIN USER ====================
    loginUser: builder.mutation({
      query: (user) => ({
        url: "/login",
        method: "POST",
        body: user,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    // ==================== LOGOUT USER ====================
    logoutUser: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const {
  useCreateUserMutation,
  useCreateAdminMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
} = authApi;
