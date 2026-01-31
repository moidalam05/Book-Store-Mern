import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}/api/v1/users`,
  credentials: "include",
  prepareHeaders: (Headers) => {
    const token = localStorage.getItem("token");
    if (token) Headers.set("Authorization", `Bearer ${token}`);
    return Headers;
  },
});

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery,
  tagTypes: ["Users", "Dashboard"],
  endpoints: (builder) => ({
    updateProfile: builder.mutation({
      query: ({ formData, userId }) => ({
        url: `/update-profile/${userId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result) => {
        const id = result?.data?._id || result?.user?._id;
        return [
          { type: "Users", id: "LIST" },
          { type: "Dashboard", id: "LIST" },
          ...(id ? [{ type: "Users", id }] : []),
        ];
      },
    }),

    fetchUsers: builder.query({
      query: (params) => ({
        url: "/all-users",
        method: "GET",
        params,
      }),
      providesTags: [
        { type: "Users", id: "LIST" },
        { type: "Dashboard", id: "LIST" },
      ],
    }),

    fetchUserById: builder.query({
      query: (userId) => ({
        url: `/${userId}`,
        method: "GET",
      }),
      providesTags: (result, error, userId) => [
        { type: "Users", id: userId },
        { type: "Dashboard", id: "LIST" },
      ],
    }),

    toggleUserStatus: builder.mutation({
      query: (userId) => ({
        url: `/status/${userId}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, userId) => [
        { type: "Users", id: "LIST" },
        { type: "Dashboard", id: "LIST" },
        { type: "Users", id: userId },
      ],
    }),

    getProfileStats: builder.query({
      query: () => ({
        url: "/profile-stats",
        method: "GET",
        providesTags: [
          { type: "Dashboard", id: "LIST" },
          { type: "Users", id: "LIST" },
        ],
      }),
    }),
  }),
});

export const {
  useUpdateProfileMutation,
  useFetchUsersQuery,
  useFetchUserByIdQuery,
  useToggleUserStatusMutation,
  useGetProfileStatsQuery,
} = usersApi;
