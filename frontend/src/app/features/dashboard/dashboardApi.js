import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../../utils/baseUrl.js";

const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/v1/dashboard`,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery,
  tagTypes: ["Dashboard", "Orders", "Users"],

  endpoints: (builder) => ({
    // ======================== FETCH DASHBOARD OVERVIEW ===============
    getDashboardOverview: builder.query({
      query: () => "/overview",
      providesTags: [{ type: "Dashboard", id: "LIST" }],
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }),

    // ======================== FETCH DASHBOARD CHARTS ===============
    getDashboardCharts: builder.query({
      query: () => "/charts",
      providesTags: [{ type: "Dashboard", id: "LIST" }],
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }),

    // ======================== FETCH DASHBOARD QUICK STATS ===============
    getDashboardQuickStats: builder.query({
      query: () => "/quick-stats",
      providesTags: [{ type: "Dashboard", id: "LIST" }],
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }),

    // ======================== FETCH DASHBOARD TOP PRODUCTS ===============
    getTopProducts: builder.query({
      query: () => "/top-products",
      providesTags: [{ type: "Dashboard", id: "LIST" }],
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }),

    // ======================== FETCH DASHBOARD RECENT DATA ===============
    getDashboardRecentData: builder.query({
      query: () => "/recent-data",
      providesTags: [{ type: "Dashboard", id: "LIST" }],
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    }),
  }),
});

export const {
  useGetDashboardOverviewQuery,
  useGetDashboardChartsQuery,
  useGetDashboardQuickStatsQuery,
  useGetTopProductsQuery,
  useGetDashboardRecentDataQuery,
} = dashboardApi;
