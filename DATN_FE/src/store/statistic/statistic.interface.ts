import { IReview, IReviewDashboard } from "../reviews/review.interface";

export interface Statistics {
  month?: string;
  day?: string;
  quarter?: string;
  totalOrders: number;
  totalOrderValue: number;
  totalRevenue: number;
  totalProfit: number;
  totalQuantitySold: number;
  totalCostPrice: number;
}
export interface ProductStatistics {
  productId: string;
  productName: string;
  quantitySold: number;
  totalOrders: number;
  totalRevenue: number;
  profit: number;
}
export type MonthlyStatistics = Statistics & { month: string };
export type DateStatistics = Statistics & { day: string };
export type QuarterlyStatistics = Statistics & { quarter: string };
export interface OrderStatistics {
  orderId: string;
  customerName: string;
  totalQuantitySold: number;
  totalRevenue: number;
  totalProfit: number;
  totalCostPrice: number;
}
export interface DashboardStatistic {
  _id: string;
  revenue: string;
  profit: string;
  newReviews: IReviewDashboard[];
  newUsersCount: number;
  newOrdersCount: number;
  bestSellingProduct: {
    _id: string;
    title: string;
    images: string[];
    totalQuantitySold: number
  }[];
}

export interface IStatisticState {
  satistics: DashboardStatistic[]
}