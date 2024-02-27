import moment from "moment/moment.js";
import Order from "../models/order.js";
import "moment-timezone";
import User from "../models/user.js";
import Review from "../models/review.js";
export const productRevenue = async (req, res) => {
  try {
    const productRevenue = await Order.find({
    }).populate({
      path: "orderDetails",
      populate: {
        path: "productDetailId",
        populate: {
          path: "product_id",
        },
      },
    });

    if (!productRevenue) {
      return res.status(400).json({ message: "Khong co ket qua" });
    }
    let productRevenueArray = [];

    productRevenue.forEach((order) => {
      order.orderDetails.forEach((detail) => {
        if (detail.productDetailId.product_id) {
          const existingProduct = productRevenueArray.find(
            (product) =>
              product.productId.toString() ===
              detail.productDetailId.product_id._id.toString()
          );

          if (existingProduct) {
            existingProduct.quantitySold += detail.quantity;
            existingProduct.totalOrders += 1;
            existingProduct.totalRevenue += detail.totalMoney;
            existingProduct.profit +=
              (detail.price - detail.costPrice) * detail.quantity;
          } else {
            productRevenueArray.push({
              productId: detail.productDetailId.product_id._id,
              productName: detail.productDetailId.product_id.title,
              quantitySold: detail.quantity,
              totalOrders: 1,
              totalRevenue: detail.totalMoney,
              profit: (detail.price - detail.costPrice) * detail.quantity,
            });
          }
        } else {
          // Xử lý trường hợp sản phẩm đã bị xóa
          console.log(`Sản phẩm với productId ${detail.productDetailId} đã bị xóa.`);
        }
      });
    });

    return res.status(200).json(productRevenueArray);
  } catch (error) {
    console.log(error);
  }
};
export const orderRevenue = async (req, res) => {
  try {
    const orders = await Order.find({ status: 5 }).populate({
      path: "orderDetails",
      populate: {
        path: "productDetailId",
        populate: {
          path: "product_id",
        },
      },
    });

    if (!orders) {
      return res.status(400).json({ message: "Không có kết quả" });
    }

    let orderStatisticsArray = [];

    orders.forEach((order) => {
      let totalQuantitySold = 0;
      let totalOrderValue = 0;
      let totalRevenue = 0;
      let totalProfit = 0;

      order.orderDetails.forEach((detail) => {
        totalQuantitySold += detail.quantity;
        totalOrderValue += detail.totalMoney;
        totalRevenue += detail.price * detail.quantity;
        totalProfit += (detail.price - detail.costPrice) * detail.quantity;
      });

      orderStatisticsArray.push({
        orderId: order._id,
        totalQuantitySold: totalQuantitySold,
        totalOrderValue: totalOrderValue,
        totalRevenue: totalRevenue,
        totalProfit: totalProfit,
      });
    });

    return res.status(200).json(orderStatisticsArray);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

export const orderRevanueByDate = async (req, res) => {
  try {
    const orders = await Order.find({ status: 5 }).populate({
      path: "orderDetails",
      populate: {
        path: "productDetailId",
        populate: {
          path: "product_id",
        },
      },
    });

    if (!orders) {
      return res.status(400).json({ message: "Không có kết quả" });
    }

    let orderStatisticsByTime = {};

    orders.forEach((order) => {
      const date = moment(order.createdAt)
        .tz("Asia/Ho_Chi_Minh")
        .format("YYYY-MM-DD");

      if (!orderStatisticsByTime[date]) {
        orderStatisticsByTime[date] = {
          totalOrders: 0,
          totalOrderValue: 0,
          totalRevenue: 0,
          totalProfit: 0,
          totalCostPrice: 0,
          totalQuantitySold: 0,
        };
      }

      let totalQuantitySold = 0;
      let totalOrderValue = 0;
      let totalRevenue = 0;
      let totalProfit = 0;
      let totalCostPrice = 0;

      order.orderDetails.forEach((detail) => {
        totalCostPrice += detail.costPrice * detail.quantity;
        totalQuantitySold += detail.quantity;
        totalOrderValue += detail.totalMoney;
        totalRevenue += detail.price * detail.quantity;
        totalProfit += (detail.price - detail.costPrice) * detail.quantity;
      });

      orderStatisticsByTime[date].totalOrders += 1;
      orderStatisticsByTime[date].totalOrderValue += totalOrderValue;
      orderStatisticsByTime[date].totalRevenue += totalRevenue;
      orderStatisticsByTime[date].totalProfit += totalProfit;
      orderStatisticsByTime[date].totalQuantitySold += totalQuantitySold;
      orderStatisticsByTime[date].totalCostPrice += totalCostPrice;
    });

    const resultArray = Object.entries(orderStatisticsByTime).map(
      ([date, stats]) => ({
        date: date,
        totalOrders: stats.totalOrders,
        totalOrderValue: stats.totalOrderValue,
        totalRevenue: stats.totalRevenue,
        totalProfit: stats.totalProfit,
        totalQuantitySold: stats.totalQuantitySold,
        totalCostPrice: stats.totalCostPrice,
      })
    );

    return res.status(200).json(resultArray);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
export const orderRevanueByMonth = async (req, res) => {
  try {
    const orders = await Order.find({ status: 5 }).populate({
      path: 'orderDetails',
      populate: {
        path: 'productDetailId',
        populate: {
          path: 'product_id',
        },
      },
    });

    if (!orders) {
      return res.status(400).json({ message: "Không có kết quả" });
    }

    let orderStatisticsByMonth = {};

    orders.forEach((order) => {
      const month = moment(order.createdAt).tz('Asia/Ho_Chi_Minh').format('YYYY-MM');

      if (!orderStatisticsByMonth[month]) {
        orderStatisticsByMonth[month] = {
          totalOrders: 0,
          totalOrderValue: 0,
          totalRevenue: 0,
          totalProfit: 0,
          totalCostPrice: 0,
          totalQuantitySold: 0,
        };
      }

      let totalQuantitySold = 0;
      let totalOrderValue = 0;
      let totalRevenue = 0;
      let totalProfit = 0;
      let totalCostPrice = 0;


      order.orderDetails.forEach((detail) => {
        totalCostPrice += detail.costPrice * detail.quantity;
        totalQuantitySold += detail.quantity;
        totalOrderValue += detail.totalMoney;
        totalRevenue += detail.price * detail.quantity;
        totalProfit += (detail.price - detail.costPrice) * detail.quantity;
      });

      orderStatisticsByMonth[month].totalOrders += 1;
      orderStatisticsByMonth[month].totalOrderValue += totalOrderValue;
      orderStatisticsByMonth[month].totalRevenue += totalRevenue;
      orderStatisticsByMonth[month].totalProfit += totalProfit;
      orderStatisticsByMonth[month].totalQuantitySold += totalQuantitySold;
      orderStatisticsByMonth[month].totalCostPrice += totalCostPrice;
    });

    const resultArray = Object.entries(orderStatisticsByMonth).map(([month, stats]) => ({
      month: month,
      totalOrders: stats.totalOrders,
      totalOrderValue: stats.totalOrderValue,
      totalRevenue: stats.totalRevenue,
      totalProfit: stats.totalProfit,
      totalQuantitySold: stats.totalQuantitySold,
      totalCostPrice: stats.totalCostPrice,
    }));

    return res.status(200).json(resultArray);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
export const orderRevanueByWeek = async (req, res) => {
  try {
    const orders = await Order.find({ status: 5 }).populate({
      path: 'orderDetails',
      populate: {
        path: 'productDetailId',
        populate: {
          path: 'product_id',
        },
      },
    });

    if (!orders) {
      return res.status(400).json({ message: "Không có kết quả" });
    }

    let orderStatisticsByWeek = {};

    orders.forEach((order) => {
      const week = moment(order.createdAt).tz('Asia/Ho_Chi_Minh').format('YYYY-[W]WW');

      if (!orderStatisticsByWeek[week]) {
        orderStatisticsByWeek[week] = {
          totalOrders: 0,
          totalOrderValue: 0,
          totalRevenue: 0,
          totalProfit: 0,
          totalCostPrice: 0,
          totalQuantitySold: 0,
        };
      }

      let totalQuantitySold = 0;
      let totalOrderValue = 0;
      let totalRevenue = 0;
      let totalProfit = 0;
      let totalCostPrice = 0;

      order.orderDetails.forEach((detail) => {
        totalCostPrice += detail.costPrice * detail.quantity;
        totalQuantitySold += detail.quantity;
        totalOrderValue += detail.totalMoney;
        totalRevenue += detail.price * detail.quantity;
        totalProfit += (detail.price - detail.costPrice) * detail.quantity;
      });

      orderStatisticsByWeek[week].totalOrders += 1;
      orderStatisticsByWeek[week].totalOrderValue += totalOrderValue;
      orderStatisticsByWeek[week].totalRevenue += totalRevenue;
      orderStatisticsByWeek[week].totalProfit += totalProfit;
      orderStatisticsByWeek[week].totalQuantitySold += totalQuantitySold;
      orderStatisticsByWeek[week].totalCostPrice += totalCostPrice;
    });

    const resultArray = Object.entries(orderStatisticsByWeek).map(([week, stats]) => ({
      week: week,
      totalOrders: stats.totalOrders,
      totalOrderValue: stats.totalOrderValue,
      totalRevenue: stats.totalRevenue,
      totalProfit: stats.totalProfit,
      totalQuantitySold: stats.totalQuantitySold,
      totalCostPrice: stats.totalCostPrice,
    }));

    return res.status(200).json(resultArray);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
export const orderRevenueBy7Days = async (req, res) => {
  try {
    const orders = await Order.find({ status: 5 }).populate({
      path: 'orderDetails',
      populate: {
        path: 'productDetailId',
        populate: {
          path: 'product_id',
        },
      },
    });

    if (!orders) {
      return res.status(400).json({ message: "Không có kết quả" });
    }

    let orderStatisticsLast7Days = {};

    orders.forEach((order) => {
      const orderDate = moment(order.createdAt).tz('Asia/Ho_Chi_Minh');
      const today = moment().tz('Asia/Ho_Chi_Minh');
      const sevenDaysAgo = today.clone().subtract(7, 'days');
      // Check if the order is within the last 7 days
      if (orderDate.isBetween(sevenDaysAgo, today, null, '[]')) {
        const day = orderDate.format('YYYY-MM-DD');

        if (!orderStatisticsLast7Days[day]) {
          orderStatisticsLast7Days[day] = {
            totalOrders: 0,
            totalOrderValue: 0,
            totalRevenue: 0,
            totalProfit: 0,
            totalCostPrice: 0,
            totalQuantitySold: 0,
          };
        }

        let totalQuantitySold = 0;
        let totalOrderValue = 0;
        let totalRevenue = 0;
        let totalProfit = 0;
        let totalCostPrice = 0;

        order.orderDetails.forEach((detail) => {
          totalCostPrice += detail.costPrice * detail.quantity;
          totalQuantitySold += detail.quantity;
          totalOrderValue += detail.totalMoney;
          totalRevenue += detail.price * detail.quantity;
          totalProfit += (detail.price - detail.costPrice) * detail.quantity;
        });

        orderStatisticsLast7Days[day].totalOrders += 1;
        orderStatisticsLast7Days[day].totalOrderValue += totalOrderValue;
        orderStatisticsLast7Days[day].totalRevenue += totalRevenue;
        orderStatisticsLast7Days[day].totalProfit += totalProfit;
        orderStatisticsLast7Days[day].totalQuantitySold += totalQuantitySold;
        orderStatisticsLast7Days[day].totalCostPrice += totalCostPrice;
      }
    });

    const resultArray = Object.entries(orderStatisticsLast7Days).map(([day, stats]) => ({
      day: day,
      totalOrders: stats.totalOrders,
      totalOrderValue: stats.totalOrderValue,
      totalRevenue: stats.totalRevenue,
      totalProfit: stats.totalProfit,
      totalQuantitySold: stats.totalQuantitySold,
      totalCostPrice: stats.totalCostPrice,
    }));

    return res.status(200).json(resultArray);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
export const orderRevenueByQuarter = async (req, res) => {
  try {
    const orders = await Order.find({ status: 5 }).populate({
      path: 'orderDetails',
      populate: {
        path: 'productDetailId',
        populate: {
          path: 'product_id',
        },
      },
    });

    if (!orders) {
      return res.status(400).json({ message: "Không có kết quả" });
    }

    let orderStatisticsByQuarter = {};

    orders.forEach((order) => {
      const month = moment(order.createdAt).tz('Asia/Ho_Chi_Minh').format('YYYY-MM');
      const quarter = getQuarter(month);

      if (!orderStatisticsByQuarter[quarter]) {
        orderStatisticsByQuarter[quarter] = {
          totalOrders: 0,
          totalOrderValue: 0,
          totalRevenue: 0,
          totalProfit: 0,
          totalCostPrice: 0,
          totalQuantitySold: 0,
        };
      }

      let totalQuantitySold = 0;
      let totalOrderValue = 0;
      let totalRevenue = 0;
      let totalProfit = 0;
      let totalCostPrice = 0;

      order.orderDetails.forEach((detail) => {
        totalCostPrice += detail.costPrice * detail.quantity;
        totalQuantitySold += detail.quantity;
        totalOrderValue += detail.totalMoney;
        totalRevenue += detail.price * detail.quantity;
        totalProfit += (detail.price - detail.costPrice) * detail.quantity;
      });

      orderStatisticsByQuarter[quarter].totalOrders += 1;
      orderStatisticsByQuarter[quarter].totalOrderValue += totalOrderValue;
      orderStatisticsByQuarter[quarter].totalRevenue += totalRevenue;
      orderStatisticsByQuarter[quarter].totalProfit += totalProfit;
      orderStatisticsByQuarter[quarter].totalQuantitySold += totalQuantitySold;
      orderStatisticsByQuarter[quarter].totalCostPrice += totalCostPrice;
    });

    const resultArray = Object.entries(orderStatisticsByQuarter).map(([quarter, stats]) => ({
      quarter: quarter,
      totalOrders: stats.totalOrders,
      totalOrderValue: stats.totalOrderValue,
      totalRevenue: stats.totalRevenue,
      totalProfit: stats.totalProfit,
      totalQuantitySold: stats.totalQuantitySold,
      totalCostPrice: stats.totalCostPrice,
    }));

    return res.status(200).json(resultArray);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

function getQuarter(month) {
  const monthNumber = parseInt(month.split('-')[1]);

  if (monthNumber >= 1 && monthNumber <= 3) {
    return 'Q1';
  } else if (monthNumber >= 4 && monthNumber <= 6) {
    return 'Q2';
  } else if (monthNumber >= 7 && monthNumber <= 9) {
    return 'Q3';
  } else {
    return 'Q4';
  }
}
export const orderRevanue = async (req, res) => {
  try {
    const orders = await Order.find({ status: 5 }).populate({
      path: "orderDetails",
      populate: {
        path: "productDetailId",
        populate: {
          path: "product_id",
        },
      },
    });

    if (!orders) {
      return res.status(400).json({ message: "Không có kết quả" });
    }

    let orderStatisticsArray = [];

    orders.forEach((order) => {
      let totalQuantitySold = 0;
      let totalRevenue = 0;
      let totalProfit = 0;
      let totalCostPrice = 0;

      order.orderDetails.forEach((detail) => {
        totalQuantitySold += detail.quantity;
        totalRevenue += detail.totalMoney;
        totalProfit += (detail.price - detail.costPrice) * detail.quantity;
        totalCostPrice += detail.costPrice * detail.quantity;
      });

      orderStatisticsArray.push({
        orderId: order._id,
        customerName: order.fullName,
        totalQuantitySold,
        totalRevenue,
        totalProfit,
        totalCostPrice,
      });
    });

    return res.status(200).json(orderStatisticsArray);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};
export const getStatisticsFor24h = async (req, res) => {
  try {
    const date = new Date(new Date() - 24 * 60 * 60 * 1000);
    const newUsersCount = await User.countDocuments({
      createdAt: { $gte: date },
    });

    const newOrdersCount = await Order.countDocuments({
      createdAt: { $gte: date },
    });

    const bestSellingProduct = await Order.aggregate([
      {
        $match: { createdAt: { $gte: date }, status: 5 },
      },
      {
        $lookup: {
          from: 'orderdetails',
          localField: 'orderDetails',
          foreignField: '_id',
          as: 'orderDetail',
        },
      },
      {
        $unwind: '$orderDetail',
      },
      {
        $group: {
          _id: '$orderDetail.productDetailId',
          totalQuantitySold: { $sum: '$orderDetail.quantity' },
        },
      },
      {
        $lookup: {
          from: 'productdetails',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetail',
        },
      },
      {
        $unwind: '$productDetail',
      },
      {
        $lookup: {
          from: 'products',
          localField: 'productDetail.product_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $unwind: '$product',
      },
      {
        $group: {
          _id: '$product._id',
          title: { $first: '$product.title' },
          images: { $first: '$product.images' },
          totalQuantitySold: { $sum: '$totalQuantitySold' },
        },
      },
      {
        $sort: { totalQuantitySold: -1 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          images: 1,
          totalQuantitySold: 1,
        },
      },
      {
        $limit: 5,
      }
    ]);

    const newOrders = await Order.find({
      createdAt: { $gte: date },
      status: 5
    }).populate({
      path: 'orderDetails',
      populate: {
        path: 'productDetailId',
        model: 'ProductDetail',
      },
    });

    const revenue = newOrders.reduce((totalRevenue, order) => {
      return totalRevenue + order.totalMoney;
    }, 0);

    const profit = newOrders.reduce((totalProfit, order) => {
      return (
        totalProfit +
        order.orderDetails.reduce((orderProfit, orderDetail) => {
          return (
            orderProfit +
            (orderDetail.price - orderDetail.costPrice) * orderDetail.quantity
          );
        }, 0)
      );
    }, 0);
    const newReviews = await Review.find({
      createdAt: { $gte: date },
    }).populate('productId');
    return res.status(200).json({
      revenue,
      profit,
      newReviews,
      newUsersCount,
      newOrdersCount,
      bestSellingProduct,

    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};