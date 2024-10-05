import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_BASE_URL }),
  reducerPath: "adminApi",
  tagTypes: ["Data", "Sales", "Overview"],
  endpoints: (build) => ({
    getData: build.query({
      query: ({ page, pageSize, sort, search }) => ({
        url: "api/action_history",
        method: "GET",
        params: { page, pageSize, sort, search },
      }),
      providesTags: ["Data"],
    }),
    getSales: build.query({
      query: () => "api/dashboard",
      providesTags: ["Sales"],
    }),
    getOverview: build.query({
      query: ({ page, pageSize, sort, search }) => ({
        url: "api/data_sensor",
        method: "GET",
        params: { page, pageSize, sort, search },
      }),
      providesTags: ["Overview"],
    }),
  }),
});

export const { useGetDataQuery, useGetSalesQuery, useGetOverviewQuery } = api;
