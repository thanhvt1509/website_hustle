import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { DashboardStatistic, DateStatistics, MonthlyStatistics, OrderStatistics, ProductStatistics, QuarterlyStatistics } from "./statistic.interface";

const statisticsApi = createApi({
  reducerPath: "statistics",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api", 
  }),
  tagTypes: ["statistics"],
  endpoints: (builder) => ({
    getDashboardStatistic: builder.query<DashboardStatistic, void>({
      query: () => "/statistics",
      providesTags: ["statistics"],
    }),
    getProductRevenue: builder.query<ProductStatistics[], void>({
      query: () => "/statistics/product",
      providesTags: ["statistics"],
    }),
    getOrderRevenueByDate: builder.query<DateStatistics[], void>({
      query: () => "/statistics/order/date",
      providesTags: ["statistics"],
    }),
    getOrderRevenueByMonth: builder.query<MonthlyStatistics[], void>({
      query: () => "/statistics/order/month",
      providesTags: ["statistics"],
    }),
    getOrderRevenueByWeek: builder.query<DateStatistics[], void>({
      query: () => "/statistics/order/week",
      providesTags: ["statistics"],
    }),
    getOrderRevenueByQuarter: builder.query<QuarterlyStatistics[], void>({
      query: () => "/statistics/order/quarter",
      providesTags: ["statistics"],
    }),
    getOrderRevenue: builder.query<OrderStatistics[], void>({
      query: () => "/statistics/order",
      providesTags: ["statistics"],
    }),
  }),
});

export const {
  useGetProductRevenueQuery,
  useGetOrderRevenueByDateQuery,
  useGetOrderRevenueByMonthQuery,
  useGetOrderRevenueByWeekQuery,
  useGetOrderRevenueByQuarterQuery,
  useGetOrderRevenueQuery,
  useGetDashboardStatisticQuery
} = statisticsApi;

export default statisticsApi;