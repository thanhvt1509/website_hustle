
import React, { Dispatch, useEffect, useState } from "react";
import Header from "../../../layout/Header";
import Footer from "../../../layout/Footer";
import { Link, useParams } from "react-router-dom";
import { useGetOneOrderQuery, useListOrderQuery } from "../../../store/order/order.service";
import { useDispatch, useSelector } from "react-redux";
import { listOrderSlice } from "../../../store/order/orderSlice";
import { RootState } from "../../../store";
import { useListOrderDetailQuery } from "../../../store/orderDetail/orderDetail.service";
import { listOrderDetailSlice } from "../../../store/orderDetail/orderDetailSlice";
import { useListProductDetailQuery } from "../../../store/productDetail/productDetail.service";
import { listProductDetailSlice } from "../../../store/productDetail/productDetailSlice";
import { useFetchListProductQuery } from "../../../store/product/product.service";
import { listProductSlice } from "../../../store/product/productSlice";
import { useListCartQuery } from "../../../store/cart/cart.service";
import { listCartSlice } from "../../../store/cart/cartSlice";
import { listOutfitSlice } from "../../../store/outfit/outfitSlice";
import { useFetchListOutfitQuery } from "../../../store/outfit/outfit.service";

const BillConfirm = () => {
  const dispatch: Dispatch<any> = useDispatch()
  const { id } = useParams()
  const { data: getOneOrder } = useGetOneOrderQuery(id!)

  const { data: listOrder, isSuccess: isSuccessOrder } = useListOrderQuery()
  const { data: listOrderDetail, isSuccess: isSuccessOrderDetail } = useListOrderDetailQuery()
  const { data: listProductDetail, isSuccess: isSuccessProductDetail } = useListProductDetailQuery()
  const { data: listProduct, isSuccess: isSuccessListProduct } = useFetchListProductQuery()
  const { data: listCart, isSuccess: isSuccessListCart } = useListCartQuery()

  // const orderState = useSelector((state: RootState) => state.orderSlice.orders)
  const productDetailState = useSelector((state: RootState) => state.productDetailSlice.productDetails)
  const productState = useSelector((state: RootState) => state.productSlice.products)
  const [totalCart, setTotalCart] = useState<number>(0)
  const { data: listOutfit, isSuccess: isSuccesslistOutfit } = useFetchListOutfitQuery();
  useEffect(() => {
    if (listOutfit) {
      dispatch(listOutfitSlice(listOutfit))
    }
  }, [isSuccesslistOutfit])
  useEffect(() => {
    if (listOrder) {
      dispatch(listOrderSlice(listOrder))
    }
  }, [isSuccessOrder])
  useEffect(() => {
    if (listOrderDetail) {
      dispatch(listOrderDetailSlice(listOrderDetail))
    }
  }, [isSuccessOrderDetail])
  useEffect(() => {
    if (listProductDetail) {
      dispatch(listProductDetailSlice(listProductDetail))
    }
  }, [isSuccessProductDetail])
  useEffect(() => {
    if (listProduct) {
      dispatch(listProductSlice(listProduct))
    }
  }, [isSuccessListProduct])
  useEffect(() => {
    if (listCart) {
      dispatch(listCartSlice([]))
    }
  }, [isSuccessListCart])
  useEffect(() => {
    let total = 0
    if (getOneOrder) {
      getOneOrder.orderDetails?.map((order) => {
        total += order.totalMoney
      })
    }
    setTotalCart(total)
  }, [getOneOrder])

  return (
    <>
      <Header></Header>
      <div className="container">
        <div className="mt-16 px-32 mb-16">
          <div className="text-center mb-14">
            <h1 className="uppercase text-[35px] font-bold mb-6">
              Đặt hàng thành công!
            </h1>
            <div className="max-w-[950px] mb-7 font-medium mx-auto">
              <p className="mb-3">
                Trên thị trường có quá nhiều sự lựa chọn, cảm ơn bạn đã lựa chọn
                mua sắm tại <b>Hustle</b>
              </p>
              <p>
                Đơn hàng của bạn CHẮC CHẮN đã được chuyển tới hệ thống xử lý đơn
                hàng của Hustle. Trong quá trình xử lý Hustle sẽ liên hệ lại nếu
                như cần thêm thông tin từ bạn. Ngoài ra Hustle cũng sẽ có gửi
                xác nhận đơn hàng bằng Email.
              </p>
            </div>

            <form action="">
              <Link
                to="/"
                className="py-4 px-10 rounded-full bg-black text-white inline-block"
              >
                Khám phá thêm các sản phẩm khác tại đây
              </Link>
              <div>
                <div className="mb-5 mt-10 border-t-2">
                  <h1 className="text-[30px] text-center font-semibold mb-5 mt-10">
                    Thông tin đơn hàng #{getOneOrder?._id?.slice(0, 10)}
                  </h1>
                  <div className="relative overflow-x-auto border sm:rounded-xl">
                    <table className="w-full text-sm text-left">
                      <thead className="">
                        <tr className="bg-[#2f5acf] text-white">
                          <th scope="col" className="px-6 py-3">
                            Tên sản phẩm
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Số lượng
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Giá niêm yết
                          </th>
                          <th scope="col" className="px-6 py-3">
                            Biến thể
                          </th>
                          <th scope="col" className="px-6 py-3 text-right">
                            Thành tiền
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {getOneOrder?.orderDetails?.map((cart, index) => {
                          return <>
                            {
                              productDetailState?.filter((proDetail) => proDetail._id === cart.productDetailId).map(item => {
                                return <>
                                  {productState?.filter((product) => product._id === item.product_id).map((pro) => {
                                    return <tr className="border-b hover:bg-gray-50" key={index}>
                                      <td className="p-4 flex gap-x-3 items-center">
                                        <img
                                          src={item.imageColor}
                                          alt="Apple Watch"
                                          className="rounded-lg w-[70px] h-[100px] object-cover"
                                        />
                                        <span className="font-bold">
                                          {pro.title}
                                        </span>
                                      </td>
                                      <td className="px-6 py-4 font-semibold text-gray-900">{cart.quantity}</td>
                                      <td className="px-6 py-4 font-semibold text-gray-900">
                                        {cart.price.toLocaleString("vi-VN")}đ
                                      </td>
                                      <td className="px-6 py-4 font-semibold text-gray-900">
                                        {cart.color} / {cart.size}
                                      </td>
                                      <td className="px-6 py-4 font-semibold text-gray-900 text-right">
                                        {cart.totalMoney.toLocaleString("vi-VN")}đ
                                      </td>
                                    </tr>
                                  })}
                                </>
                              })
                            }
                          </>
                        })}

                      </tbody>
                      <tbody>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4 font-semibold text-gray-900">
                            Tổng giá trị sản phẩm
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-900"></td>
                          <td className="px-6 py-4 font-semibold text-gray-900"></td>
                          <td className="px-6 py-4 font-semibold text-gray-900"></td>
                          <td className="px-6 py-4 font-semibold text-gray-900 text-right">
                            {totalCart.toLocaleString("vi-VN")}đ
                          </td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4 font-semibold text-gray-900">
                            Giao hàng tận nơi
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-900"></td>
                          <td className="px-6 py-4 font-semibold text-gray-900"></td>
                          <td className="px-6 py-4 font-semibold text-gray-900"></td>
                          <td className="px-6 py-4 font-semibold text-gray-900 text-right">
                            {totalCart >= 500000 ? <p>Miễn phí</p> : <p>40.000đ</p>}
                          </td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4 font-semibold text-gray-900">
                            Mã giảm giá
                          </td>
                          <td className="px-6 py-4 font-semibold text-gray-900"></td>
                          <td className="px-6 py-4 font-semibold text-gray-900"></td>
                          <td className="px-6 py-4 font-semibold text-gray-900"></td>
                          <td className="px-6 py-4 font-semibold text-gray-900 text-right">
                            {!getOneOrder?.voucher_code ? "Chưa áp dụng" : "Đã áp dụng"}
                          </td>
                        </tr>
                        <tr className="border-b text-xl bg-black">
                          <td className="px-6 py-4 font-bold text-white">
                            Tổng thanh toán
                          </td>
                          <td className="px-6 py-4 font-bold text-white"></td>
                          <td className="px-6 py-4 font-bold text-white"></td>
                          <td className="px-6 py-4 font-bold text-white"></td>
                          <td className="px-6 py-4 font-bold text-white text-right">
                            {getOneOrder?.totalMoney.toLocaleString("vi-VN")}đ
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <h1 className="text-[30px] text-center font-semibold mb-5">
                    Thông tin nhận hàng
                  </h1>
                  <div className="bg-[#f1f1f1] rounded-xl text-left p-7 text-sm font-semibold">
                    <div className="flex">
                      <div className="w-[20%]">
                        <p className="mb-3">Tên người nhận:</p>
                        <p className="mb-3">Email:</p>
                        <p className="mb-3">Số điện thoại:</p>
                        <p className="mb-3">Hình thức thanh toán:</p>
                        <p className="mb-3">Địa chỉ nhận hàng:</p>
                        <p className="mb-3">Ghi chú:</p>
                      </div>
                      <div>
                        <p className="mb-3">{getOneOrder?.fullName}</p>
                        <p className="mb-3">{getOneOrder?.email}</p>
                        <p className="mb-3">{getOneOrder?.phoneNumber}</p>
                        <p className="mb-3">Thanh toán khi nhận hàng (COD)</p>
                        <p className="mb-3">
                          {/* {getOneOrder?.address.detailAddress}, */}
                          {getOneOrder?.address.myWard},
                          {getOneOrder?.address.myDistrict},
                          {getOneOrder?.address.myProvince}
                        </p>
                        <p className="mb-3">
                          {getOneOrder?.note}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>

          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default BillConfirm;
