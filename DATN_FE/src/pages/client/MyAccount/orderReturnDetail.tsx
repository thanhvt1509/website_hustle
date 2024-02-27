import { Link, useNavigate, useParams } from "react-router-dom";
import Footer from "../../../layout/Footer";
import Header from "../../../layout/Header";
import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import {
  useGetOneOrderReturnQuery,
  useListOrderReturnQuery,
} from "../../../store/orderReturn/order.service";
import { useListProductDetailQuery } from "../../../store/productDetail/productDetail.service";
import { useFetchListProductQuery } from "../../../store/product/product.service";
import { listProductDetailSlice } from "../../../store/productDetail/productDetailSlice";
import { listProductSlice } from "../../../store/product/productSlice";
import { RootState } from "@reduxjs/toolkit/query";

function formatDateStringToDisplayDate(dateString) {
  const originalDate = new Date(dateString);

  const day = originalDate.getDate();
  const month = originalDate.getMonth() + 1;
  const year = originalDate.getFullYear();
  const hours = originalDate.getHours();
  const minutes = originalDate.getMinutes();

  let amPm = "SA";
  if (hours >= 12) {
    amPm = "CH";
  }

  const formattedDate = `${day < 10 ? "0" : ""}${day}/${month < 10 ? "0" : ""
    }${month}/${year}, ${hours > 12 ? hours - 12 : hours}:${minutes < 10 ? "0" : ""
    }${minutes}${amPm}`;
  return formattedDate;
}

function mapStatusToText(status) {
  switch (status) {
    case 0:
      return "Từ chối yêu cầu";
    case 1:
      return "Chờ xác nhận";
    case 2:
      return "Chờ xử lý";
    case 3:
      return "Đang xử lý";
    case 4:
      return "Hoàn thành";
    default:
      return "Trạng thái không xác định";
  }
}

function mapStatusPaymentToText(statusCode) {
  switch (statusCode) {
    case 0:
      return "Chưa thanh toán";
    case 1:
      return "Đã thanh toán";
    default:
      return "Trạng thái không xác định";
  }
}

const OrderReturnDetail = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const { setValue } = useForm();
  const user = useSelector((state: any) => state.user);
  useEffect(() => {
    if (user) {
      setValue("user_id", user?.current?._id);
    }
  }, [user]);
  const isLoggedIn = user?.isLoggedIn;
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn) {
      return navigate("/");
    }
  }, [navigate]);

  const { id } = useParams();
  const { data: orderReturn } = useGetOneOrderReturnQuery(id!);
  const { data: orders } = useListOrderReturnQuery();
  const ListOrderReturnDetail = orderReturn?.orderReturnDetails;
  const { data: listProductDetail, isSuccess: isSuccessListProductDetail } =
    useListProductDetailQuery();
  const { data: listProduct, isSuccess: isSuccessProduct } =
    useFetchListProductQuery();
  useEffect(() => {
    if (listProductDetail) {
      dispatch(listProductDetailSlice(listProductDetail));
    }
  }, [isSuccessListProductDetail]);
  useEffect(() => {
    if (listProduct) {
      dispatch(listProductSlice(listProduct));
    }
  }, [isSuccessProduct]);
  const productDetailState = useSelector(
    (state: RootState) => state.productDetailSlice.productDetails
  );
  const productState = useSelector(
    (state: RootState) => state.productSlice.products
  );
  const orderReturnDetailIds = orderReturn?.orderReturnDetails.map(
    (orderReturnDetail: any) => orderReturnDetail?._id
  );
  const productsInOrder = ListOrderReturnDetail?.filter(
    (orderReturnDetail: any) =>
      orderReturnDetailIds?.includes(orderReturnDetail._id)
  );

  let totalProductPrice = 0;
  productsInOrder?.forEach((product: any) => {
    totalProductPrice += product.price;
  });



  return (
    <>
      <Header></Header>
      <div className="container">
        {/* <Rate /> */}
        <div className="mt-14">
          <h1 className="text-[25px] mb-7 font-bold text-center pb-5 relative">
            Chi tiết đơn hàng
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
                <Link to="/account/orders">Đơn hàng đã đặt</Link>
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
                <Link to="/account/ordersReturn">Yêu cầu đổi trả</Link>
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
                <div className="mb-7 flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      ĐƠN HÀNG: #{id}
                    </h3>
                    <p className="text-sm cursor-pointer mb-3">
                      Đặt lúc —{" "}
                      {formatDateStringToDisplayDate(orderReturn?.createdAt)}
                    </p>
                    <h1 className="mb-3">
                      Trạng thái đơn hàng:{" "}
                      <span className="text-lg font-bold">
                        {mapStatusToText(orderReturn?.status)}
                      </span>
                    </h1>
                    {(orderReturn?.status === 3 ||
                      orderReturn?.status === 4) && (
                        <Link to={`/account/orders/${orderReturn?.newOrder?._id}`} className="text-blue-500 italic underline rounded-md inline-block mt-1">
                          Kiểm tra đơn hàng đã được tạo mới cho bạn
                        </Link>
                      )}
                  </div>
                  <div className="text-right">
                    <Link
                      to="/account"
                      className="text-white block bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm cursor-pointer px-5 py-2.5 mr-2 mb-2"
                    >
                      Quay lại trang tài khoản
                    </Link>
                  </div>
                </div>
                <div className="relative overflow-x-auto mb-9 shadow-md sm:rounded-lg">
                  <table className="w-full text-[15px] text-left border-8 border-[#d9edf7]">
                    <thead className="text-sm cursor-pointer uppercase border-b-2 border-black bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Sản phẩm
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Mã sản phẩm
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Đơn giá
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Số lượng
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Thành tiền
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {productsInOrder?.map((product: any) => {
                        return (
                          <>
                            {productDetailState
                              ?.filter(
                                (proDetail: any) =>
                                  proDetail._id === product.productDetailId
                              )
                              .map((item: any) => {
                                return (
                                  <>
                                    {productState
                                      ?.filter(
                                        (prod: any) =>
                                          prod._id === item.product_id
                                      )
                                      .map((pro: any) => (
                                        <tr className="bg-white">
                                          <th
                                            scope="row"
                                            className="font-medium text-gray-900 whitespace-nowrap flex items-center gap-x-5"
                                          >
                                            <Link
                                              to={`/products/${pro._id!}`}
                                              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center gap-x-5"
                                            >
                                              <img
                                                src={item.imageColor}
                                                alt={pro.title}
                                                className="w-[58px] h-[78px] object-cover"
                                              />
                                              <div>
                                                <p className="mb-4 max-w-[340px]">
                                                  {pro.title}
                                                </p>
                                                <p>
                                                  {product.color} /{" "}
                                                  {product.size}
                                                </p>
                                              </div>
                                            </Link>
                                          </th>
                                          <td className="px-6 py-4">
                                            {pro?.sku}
                                          </td>
                                          <td className="px-6 py-4">
                                            {product.price.toLocaleString(
                                              "vi-VN"
                                            )}
                                            ₫
                                          </td>
                                          <td className="px-6 py-4">
                                            {product.quantity}
                                          </td>
                                          <td className="px-6 py-4">
                                            {product.price.toLocaleString(
                                              "vi-VN"
                                            )}
                                            ₫
                                          </td>
                                        </tr>
                                      ))}
                                  </>
                                );
                              })}
                          </>
                        );
                      })}
                    </tbody>
                    <tbody>
                      <tr className="bg-white border-t">
                        <th
                          scope="row"
                          className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap flex items-center gap-x-5"
                        >
                          Giá sản phẩm
                        </th>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4 font-bold">
                          {totalProductPrice.toLocaleString("vi-VN")}₫
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <th
                          scope="row"
                          className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap flex items-center gap-x-5"
                        >
                          Giao hàng tận nơi
                        </th>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4 font-bold">
                          {totalProductPrice >= 500000 || (orderReturn?.newOrder && orderReturn?.newOrder?.pay_method === "FREE") ? (
                            <p>Miễn phí</p>
                          ) : (
                            <p>40.000đ</p>
                          )}
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <th
                          scope="row"
                          className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap flex items-center gap-x-5"
                        >
                          Tổng tiền
                        </th>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4"></td>
                        <td className="px-6 py-4 font-bold">
                          {totalProductPrice.toLocaleString("vi-VN")}₫
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <h2 className="font-bold text-lg uppercase mb-5">
                    Địa chỉ nhận hàng
                  </h2>
                  {/* <div className="bg-[#d9edf7] text-[#31708f] border border-[#bce8f1] p-3 mb-5 rounded-lg">
                    <p className="mb-2">Tình trạng thanh toán: </p>
                    <p>Trạng thái đơn hàng: </p>
                  </div> */}
                  <div>
                    <p className="mb-2">
                      Họ tên:{" "}
                      <span className="font-bold">{orderReturn?.fullName}</span>
                    </p>
                    <p className="mb-2">
                      Địa chỉ:{" "}
                      <span className="font-bold">
                        {orderReturn?.address.myWard},
                      </span>
                      <span className="font-bold">
                        {orderReturn?.address.myDistrict},
                      </span>
                      <span className="font-bold">
                        {orderReturn?.address.myProvince}
                      </span>
                    </p>
                    <p className="mb-2">
                      Số điện thoại:{" "}
                      <span className="font-bold">
                        {orderReturn?.phoneNumber}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default OrderReturnDetail;
