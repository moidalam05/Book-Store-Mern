import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../../utils/baseUrl.js";

const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/v1/auth`,
  credentials: "include",
});

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery,
  tagTypes: ["Users"],
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
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),

    // ==================== CREATE ADMIN ====================
    createAdmin: builder.mutation({
      query: (newAdmin) => ({
        url: "/admin/register",
        method: "POST",
        body: newAdmin,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
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
} = usersApi;
