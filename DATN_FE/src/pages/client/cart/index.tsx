import { useDispatch, useSelector } from "react-redux";
import Footer from "../../../layout/Footer";
import Header from "../../../layout/Header";
import { Dispatch, useEffect, useState } from "react";
import { RootState } from "../../../store";
import { decreaseCartSlice, increaseCartSlice, listCartSlice, removeCartSlice } from "../../../store/cart/cartSlice";
import { listProductDetailSlice } from "../../../store/productDetail/productDetailSlice";
import { listProductSlice } from "../../../store/product/productSlice";
import { useDeleteCartMutation, useListCartQuery, useUpdateCartMutation } from "../../../store/cart/cart.service";
import { useListProductDetailQuery } from "../../../store/productDetail/productDetail.service";
import { useFetchListProductQuery } from "../../../store/product/product.service";
import { Link } from "react-router-dom";
import { Progress, Slider, message } from "antd";

const cartPage = () => {
    const dispatch: Dispatch<any> = useDispatch()
    const { data: listCart, isSuccess: isSuccessCart } = useListCartQuery()
    console.log(listCart)
    const { data: listProductDetail, isSuccess: isSuccessProductDetail } = useListProductDetailQuery()
    const { data: listProduct, isSuccess: isSuccessListProduct } = useFetchListProductQuery()
    const cartState = useSelector((state: RootState) => state.cartSlice.carts)
    const productDetailState = useSelector((state: RootState) => state.productDetailSlice.productDetails)
    const productState = useSelector((state: RootState) => state.productSlice.products)
    const [onUpdateCart] = useUpdateCartMutation()
    const [onRemoveCart] = useDeleteCartMutation()
    const [totalCart, setTotalCart] = useState<number>(0)
    const cartStore = JSON.parse(localStorage.getItem("carts")!)
    const removeCart = async (id: string) => {
        try {
            if (id) {
                if (user?.current?._id) {
                    const isConfirm = window.confirm("Ban co chac chan muon xoa khong?");
                    if (isConfirm) {
                        await onRemoveCart(id).then(() => dispatch(removeCartSlice(id)));
                        message.success("Xóa thành công!");
                    }
                } else {
                    const isConfirm = window.confirm("Ban co chac chan muon xoa khong?");
                    if (isConfirm) {
                        dispatch(removeCartSlice(id));
                        message.success("Xóa thành công!");
                    }
                }
            }
        } catch (error) {
            console.log(error);

        }
    }
    const user = useSelector((state: any) => state?.user);
    useEffect(() => {
        if (listCart) {
            if (user?.current?._id) {
                dispatch(listCartSlice(listCart))
            } else {
                dispatch(listCartSlice(cartStore ? cartStore : [])!)
            }
        }
    }, [isSuccessCart])
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


    const decreaseCart = async (_id: string, discount: number) => {
        try {
            if (_id && discount) {
                if (user?.current?._id) {
                    dispatch(decreaseCartSlice({ _id: _id, discount: discount }));
                    const cartIndex = JSON.parse(localStorage.getItem("cartIndex")!);
                    if (cartIndex) {
                        await onUpdateCart({ _id, ...cartIndex });
                    }
                } else {
                    dispatch(decreaseCartSlice({ _id: _id, discount: discount }));
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const increaseCart = async (_id: string, discount: number) => {
        try {
            console.log(_id);
            if (_id) {
                if (user?.current?._id) {
                    dispatch(increaseCartSlice({ _id: _id, discount: discount }));
                    const cartIndex = JSON.parse(localStorage.getItem("cartIndex")!);
                    if (cartIndex) {
                        await onUpdateCart({ _id, ...cartIndex });
                    }
                } else {
                    dispatch(increaseCartSlice({ _id: _id, discount: discount }));
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        let total = 0
        if (cartState) {
            cartState.map((cart) => {
                total += cart.totalMoney
            })
        }
        setTotalCart(total)
    }, [cartState])

    const freeShip = (totalCart / 500000) * 100

    return <>
        <Header></Header>
        <div className="py-2 px-[40px] text-[14px] flex bg-gray-100">
            Trang chủ <p className="px-[14px]">/</p>cart
        </div>
        <div className="container px-[50px] bg-white py-20">
            <div className="md:flex md:space-x-6 ">
                <div className="rounded-lg md:w-2/3">
                    <div className="flex justify-between py-4">
                        <h1 className="text-2xl font-bold">Giỏ hàng của bạn</h1>
                        <p className="text-[14px]">Bạn đang có <strong>{cartState?.length} sản phẩm </strong>trong giỏ hàng</p>
                    </div>
                    <hr className="py-4" />
                    <div className="py-4">
                        <Progress
                            percent={freeShip}
                            showInfo={false}
                        />
                        <h1 className="tracking-wide py-[10px] text-[16px]">
                            Bạn {totalCart < 500000 ? <span className="">
                                cần mua thêm <strong className="text-red-400">{(500000 - totalCart).toLocaleString("vi-VN")}đ</strong>
                                <strong className="uppercase ml-2">miễn phí vận chuyển</strong>
                            </span> : <span>đã được <strong>Miễn phí vận chuyển</strong></span>}
                        </h1>
                    </div>
                    {cartState?.map((cart, index) => {
                        return <div key={index}>
                            {productState
                                ?.filter(
                                    (product) => product._id === cart.productDetailId.product_id
                                )
                                .map((pro, index) => {
                                    return (
                                        <div
                                            className="justify-between mb-6 rounded-lg border-2 bg-white p-6 max-h-[140px] shadow-md sm:flex sm:justify-start relative"
                                            key={index}
                                        >
                                            <Link to={`/products/${pro._id}`}>
                                                <img
                                                    src={cart.productDetailId?.imageColor}
                                                    alt="product-image"
                                                    className="w-[80px] rounded-lg sm:w-[80px] h-[90px]"
                                                />
                                            </Link>
                                            <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                                                <div className="mt-5 sm:mt-0">
                                                    <h2 className="text-lg font-bold text-gray-900">
                                                        {pro?.title}
                                                    </h2>
                                                    {/* color and size */}
                                                    <p className="mt-1 text-xs text-gray-700">
                                                        {cart.productDetailId?.nameColor} / {cart.productDetailId?.size}
                                                    </p>
                                                    {/* price product */}
                                                    <p className="mt-1 text-[14px] text-[#8f9bb3] font-semibold tracking-wide">
                                                        {(pro.price - pro.discount).toLocaleString("vi-VN")}
                                                        đ
                                                    </p>
                                                </div>
                                                {user?.current?._id ? (
                                                    <div
                                                        className="absolute right-[10px] top-[10px]"
                                                        onClick={() => removeCart(cart._id!)}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke-width="1.5"
                                                            stroke="currentColor"
                                                            className="h-5 w-5 cursor-pointer duration-150 hover:text-red-500"
                                                        >
                                                            <path
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                                d="M6 18L18 6M6 6l12 12"
                                                            />
                                                        </svg>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="absolute right-[10px] top-[10px]"
                                                        onClick={() =>
                                                            removeCart(cart.productDetailId?._id!)
                                                        }
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke-width="1.5"
                                                            stroke="currentColor"
                                                            className="h-5 w-5 cursor-pointer duration-150 hover:text-red-500"
                                                        >
                                                            <path
                                                                stroke-linecap="round"
                                                                stroke-linejoin="round"
                                                                d="M6 18L18 6M6 6l12 12"
                                                            />
                                                        </svg>
                                                    </div>
                                                )}
                                                <div className="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block">
                                                    <div className="flex items-center">
                                                        <p className="font-bold tracking-wide text-[15px]">
                                                            {cart?.totalMoney?.toLocaleString(
                                                                "vi-VN"
                                                            )}
                                                            đ
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center w-[100px] border border-gray-300 rounded">
                                                        {user?.current?._id ? <button
                                                            onClick={() =>
                                                                decreaseCart(
                                                                    cart._id!,
                                                                    (pro.price - pro.discount)
                                                                )
                                                            }
                                                            disabled={
                                                                cart?.quantity == 1
                                                            }
                                                            type="button"
                                                            className={`${cart?.quantity == 1 ? "w-10 h-8 flex items-center justify-center leading-10 bg-gray-200 opacity-75 text-gray-700 transition hover:opacity-75" : "w-10 h-8 flex items-center justify-center leading-10 bg-gray-300 text-gray-700 transition hover:opacity-75"}`}
                                                        >
                                                            -
                                                        </button> : <button
                                                            onClick={() =>
                                                                decreaseCart(
                                                                    cart.productDetailId._id!,
                                                                    (pro.price - pro.discount)
                                                                )
                                                            }
                                                            disabled={
                                                                cart?.quantity == 1
                                                            }
                                                            type="button"
                                                            className={`${cart?.quantity == 1 ? "w-10 h-8 flex items-center justify-center leading-10 bg-gray-200 opacity-75 text-gray-700 transition hover:opacity-75" : "w-10 h-8 flex items-center justify-center leading-10 bg-gray-300 text-gray-700 transition hover:opacity-75"}`}
                                                        >
                                                            -
                                                        </button>}
                                                        <input
                                                            type="number"
                                                            id="Quantity"
                                                            value={cart.quantity}
                                                            // value={Number(cartState.reduce((acc: number, curr: any) => {
                                                            //   if (curr.productDetailId == item._id) {
                                                            //     return acc += curr.quantity
                                                            //   }
                                                            // }, 0))}
                                                            min="1"
                                                            max={cart.productDetailId?.quantity}
                                                            className="outline-none  font-semibold h-8 w-16 border-transparent text-center [-moz-appearance:_textfield] sm:text-sm [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                                                        />
                                                        {user?.current?._id ? <button
                                                            onClick={() =>
                                                                increaseCart(
                                                                    cart._id!,
                                                                    (pro.price - pro.discount)
                                                                )
                                                            }
                                                            disabled={
                                                                cart.productDetailId?.quantity === cart?.quantity
                                                            }
                                                            type="button"
                                                            className={`${cart.productDetailId?.quantity === cart?.quantity
                                                                ? "w-10 h-8 flex items-center justify-center leading-10 bg-gray-200 text-gray-300 transition hover:opacity-75"
                                                                : "w-10 h-8 flex items-center justify-center leading-10 bg-gray-300 text-gray-700 transition hover:opacity-75"
                                                                } `}
                                                        >
                                                            +
                                                        </button> : <button
                                                            onClick={() =>
                                                                increaseCart(
                                                                    cart.productDetailId._id!,
                                                                    (pro.price - pro.discount)
                                                                )
                                                            }
                                                            disabled={
                                                                cart.productDetailId?.quantity === cart?.quantity
                                                            }
                                                            type="button"
                                                            className={`${cart.productDetailId?.quantity === cart?.quantity
                                                                ? "w-10 h-8 flex items-center justify-center leading-10 bg-gray-200 text-gray-300 transition hover:opacity-75"
                                                                : "w-10 h-8 flex items-center justify-center leading-10 bg-gray-300 text-gray-700 transition hover:opacity-75"
                                                                } `}
                                                        >
                                                            +
                                                        </button>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    })}
                    <div className="bg-gray-100 w-full p-4">
                        <p className="font-bold text-[14px]">Ghi chú đơn hàng</p>
                        <textarea name="" id="" className="w-full mt-4 focus:outline-none p-4 text-[14px] min-h-[150px]" ></textarea>
                    </div>
                </div >
                <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
                    <h1 className="font-bold text-[20px] tracking-wide pb-3 border-b-2">Thông tin đơn hàng</h1>
                    <ul className="py-4 text-[14px] text-[#333333] list-disc pl-6">
                        <li className="">Phí vận chuyển sẽ được tính ở trang thanh toán</li>
                        <li className=" mt-2">Bạn cũng có thể nhập mã ở trang thanh toán</li>
                    </ul>
                    <hr className="my-4" />
                    <div className="flex justify-between">
                        <p className="text-lg font-bold">Tổng tiền:</p>
                        <div className="">
                            <p className="mb-1 text-[20px] font-bold text-red-500 tracking-wide">{totalCart.toLocaleString("vi-VN")}đ</p>
                        </div>
                    </div>
                    <Link to="/checkout">
                        <button className="mt-6 w-full uppercase rounded-md bg-red-500 py-1.5 font-medium text-red-50 hover:bg-red-600">Thanh toán</button></Link>
                </div>
            </div >
        </div >
        <Footer></Footer>
    </>
}
export default cartPage;