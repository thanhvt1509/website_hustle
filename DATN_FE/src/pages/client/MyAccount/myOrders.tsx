import { Link, useNavigate } from "react-router-dom";
import Footer from "../../../layout/Footer";
import Header from "../../../layout/Header";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  useListOrderQuery,
  useUpdateOrderMutation,
} from "../../../store/order/order.service";
import { Result, Spin } from "antd";
import { listOrderSlice } from "../../../store/order/orderSlice";
import { Dispatch } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { RootState } from "../../../store";

function formatDateStringToDisplayDate(dateString: any) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day < 10 ? "0" : ""}${day}/${
    month < 10 ? "0" : ""
  }${month}/${year}`;
}

function mapStatusPaymentToText(statusCode: number) {
  switch (statusCode) {
    case 0:
      return "Chưa thanh toán";
    case 1:
      return "Đã thanh toán";
    default:
      return "Trạng thái không xác định";
  }
}
function orderStatus(satus: number) {
  switch (satus) {
    case 0:
      return "Hủy đơn hàng";
    case 1:
      return "Chờ xử lí";
    case 2:
      return "Đang chuản bị hàng";
    case 3:
      return "Đang giao";
    case 4:
      return "Đã nhận hàng";
    case 5:
      return "Hoàn Thành";
    case 6:
      return "Yêu cầu đổi hàng";
    default:
      return "Trạng thái không xác định";
  }
}

const myOrders = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const user = useSelector((state: any) => state.user);
  const isLoggedIn = user?.isLoggedIn;
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn) {
      return navigate("/");
    }
  }, [navigate]);

  const [cancelOrder] = useUpdateOrderMutation();
  const { data: orders, isLoading, isError } = useListOrderQuery();

  dispatch(listOrderSlice(orders!));
  const ordersState = useSelector(
    (state: RootState) => state.orderSlice.orders
  );

  if (isLoading) {
    return (
      <div className="fixed top-0 right-0 bottom-0 left-0 flex items-center flex-col justify-center ">
        <Spin size="large"></Spin>
      </div>
    );
  }

  if (isError) {
    return (
      <Result
        status="error"
        title="Có lỗi xảy ra khi tải danh sách đơn hàng của bạn"
      />
    );
  }

  const userOrders = ordersState.filter(
    (order: any) => order?.userId === user?.current?._id
  );

  return (
    <>
      <Header></Header>
      <div className="container">
        <div className="mt-14">
          <h1 className="text-[25px] mb-7 font-bold text-center pb-5 relative">
            Tài khoản của bạn
            <div className="absolute w-[60px] h-1 bg-black bottom-0 left-1/2 transform -translate-x-1/2"></div>
          </h1>
          <div className="flex">
            <div className="w-[380px]">
              <h2 className="font-bold uppercase mb-3 text-lg">Tài khoản</h2>
              <div className="flex items-center gap-x-2 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
                <Link to="/account">Thông tin tài khoản</Link>
              </div>
              <div className="flex items-center gap-x-2 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
                <Link to="/account/orders" className="font-bold">
                  Đơn hàng đã đặt
                </Link>
              </div>
              <div className="flex items-center gap-x-2 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
                <Link to="/account/ordersReturn">
                  Yêu cầu đổi trả
                </Link>
              </div>
              <div className="flex items-center gap-x-2 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
                <Link to="/account/addresses">Danh sách địa chỉ</Link>
              </div>
              <div className="flex items-center gap-x-2 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
                <Link to="/account/password">Thay đổi mật khẩu</Link>
              </div>
            </div>
            <div className="w-[1130px]">
              <div className="mb-[140px]">
                <h1 className="uppercase text-lg font-bold mb-5">
                  Danh sách đơn hàng
                </h1>
                {userOrders.length === 0 ? (
                  <h2 className="text-lg">Bạn chưa đặt đơn hàng nào.</h2>
                ) : (
                  <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-[15px] text-left border-8 border-[#d9edf7]">
                      <thead className="text-sm uppercase border-b-2 border-black bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3">
                            Mã đơn hàng
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Ngày đặt
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Thành tiền
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Trạng thái thanh toán
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Trạng thái
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Hành động
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {userOrders.map((order: any) => (
                          <tr className="bg-white border-b">
                            <th
                              scope="row"
                              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap max-w-[130px] truncate hover:truncate"
                            >
                              <Link
                                to={`/account/orders/${order._id}`}
                                className=""
                              >
                                #{order._id}
                              </Link>
                            </th>
                            <td className="px-6 py-4">
                              {formatDateStringToDisplayDate(order.createdAt)}
                            </td>
                            <td className="px-6 py-4">
                              {order.totalMoney.toLocaleString("vi-VN")}₫
                            </td>
                            <td className="px-6 py-4">
                              {mapStatusPaymentToText(order.paymentStatus)}
                            </td>
                            <td className="px-6 py-4">
                              {orderStatus(order.status)}
                            </td>
                            <td className="px-6 py-4 text-blue-500">
                              {order.status == 0 ? (
                                "Bạn đã hủy đơn hàng này"
                              ) : (
                                <Link to={`/account/orders/${order._id}`}>
                                  Xem chi tiết
                                </Link>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default myOrders;
