import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../../store"
import { useEffect } from "react"
import { Dispatch } from "@reduxjs/toolkit"
import { listVoucherSlice } from "../../../store/vouchers/voucherSlice"
import { useListVoucherQuery } from "../../../store/vouchers/voucher.service"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios"
import { toast } from "react-toastify"
import { useGetInfoUserQuery } from "../../../store/user/user.service"
import { Swiper, SwiperSlide } from "swiper/react"

const Vourcher = () => {
    const dispatch: Dispatch<any> = useDispatch()
    const { data: listVoucher, isSuccess: isSuccessVoucher } = useListVoucherQuery()
    const user = useSelector((state: any) => state?.user);
    const { data: InfoUser, refetch } = useGetInfoUserQuery(user?.current?._id)
    const voucherState = useSelector((state: RootState) => state.voucherSlice.vouchers)

    const addVoucher = async (userId: string, voucherId: string) => {
        if (user.current._id) {
            await axios.put("http://localhost:8080/api/auth/add-vourcher", {
                userId: userId,
                voucherId: voucherId
            }).then(() => refetch());
            //   message.success("Successfully registered");
            toast.success("Lưu mã thành công")
        } else {
            toast.success("Bạn cần đăng nhập để lưu mã")
        }
    }

    useEffect(() => {
        if (listVoucher) {
            dispatch(listVoucherSlice(listVoucher))
        }
    }, [isSuccessVoucher])

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
    };
    return <>
        <div className="container px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
            <h1 className="text-[37px] font-semibold uppercase mb-8">
                Voucher dành cho bạn
            </h1>
            <Swiper
                // grabCursor={"true"}
                spaceBetween={30}
                slidesPerView={"auto"}
                pagination={{ clickable: true, dynamicBullets: true }}
                className="grid grid-cols-4"
            >

                {voucherState.map((voucher, index) => {
                    if (voucher.status == true) {
                        const currentDate = new Date();
                        const validTo = new Date(voucher.validTo);
                        if (voucher.validTo == null) {
                            return (
                                <SwiperSlide key={index}>

                                    <div
                                        className="divide-y divide-gray-200 rounded-2xl border border-gray-200 shadow-sm"
                                        key={index}
                                    >
                                        <div className="p-6 sm:px-8">
                                            <h2 className="text-lg font-medium text-gray-900">
                                                Giảm {voucher && voucher.type == "percent" ? <>{(voucher.discount)}%</> : <>{(voucher.discount).toLocaleString("vi-VN")}k </>}
                                                <span className="sr-only">Plan</span>
                                            </h2>

                                            <p className="mt-2 text-gray-700">{voucher.title}</p>
                                        </div>

                                        <div className="p-2 sm:px-8 ">
                                            <ul className="mt-2 space-y-2 flex justify-between">
                                                <p className="mt-2 text-gray-700">{voucher.code}</p>

                                                {InfoUser?.voucherwallet.find(id => id == voucher._id) ? (<button
                                                    className="text-white bg-blue-400 dark:bg-blue-500 cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                                    type="button"
                                                    disabled
                                                >
                                                    Đã lưu
                                                </button>) : (<button
                                                    className="block rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring"
                                                    type="button"
                                                    onClick={() => addVoucher(user.current._id, voucher._id!)}
                                                >
                                                    Lưu mã
                                                </button>)}
                                            </ul>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        } else if (voucher.quantity == null) {
                            return (
                                <SwiperSlide key={index}>

                                    <div
                                        className=" divide-y divide-gray-200 rounded-2xl border border-gray-200 shadow-sm"
                                        key={index}
                                    >
                                        <div className="p-6 sm:px-8">
                                            <h2 className="text-lg font-medium text-gray-900">
                                                Giảm {voucher && voucher.type == "percent" ? <>{(voucher.discount)}%</> : <>{(voucher.discount).toLocaleString("vi-VN")}k </>}
                                                <span className="sr-only">Plan</span>
                                            </h2>

                                            <p className="mt-2 text-gray-700">{voucher.title}</p>
                                        </div>

                                        <div className="p-2 sm:px-8 ">
                                            <ul className="mt-2 space-y-2 flex justify-between">
                                                <p className="mt-2 text-gray-700">{voucher.code}</p>

                                                {InfoUser?.voucherwallet.find(id => id == voucher._id) ? (<button
                                                    className="text-white bg-blue-400 dark:bg-blue-500 cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                                    type="button"
                                                    disabled
                                                >
                                                    Đã lưu
                                                </button>) : <button
                                                    className="block rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring"
                                                    type="button"
                                                    onClick={() => addVoucher(user.current._id, voucher._id!)}
                                                >
                                                    Lưu mã
                                                </button>}
                                                {/* <button
                                                    className="block rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring"
                                                    type="button"
                                                    onClick={() => addVoucher(user.current._id, voucher._id!)}
                                                >
                                                    Lưu mã
                                                </button> */}
                                            </ul>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        }
                        else if (validTo > currentDate && voucher.quantity > 0) {
                            return (
                                <SwiperSlide key={index}>

                                    <div
                                        className=" divide-y divide-gray-200 rounded-2xl border border-gray-200 shadow-sm"
                                        key={index}
                                    >
                                        <div className="p-6 sm:px-8">
                                            <h2 className="text-lg font-medium text-gray-900">
                                                Giảm {voucher && voucher.type == "percent" ? <>{(voucher.discount)}%</> : <>{(voucher.discount).toLocaleString("vi-VN")}k </>}
                                                <span className="sr-only">Plan</span>
                                            </h2>

                                            <p className="mt-2 text-gray-700">{voucher.title}</p>
                                        </div>

                                        <div className="p-2 sm:px-8 ">
                                            <ul className="mt-2 space-y-2 flex justify-between">
                                                <p className="mt-2 text-gray-700">{voucher.code}</p>

                                                {InfoUser?.voucherwallet.find(id => id == voucher._id) ? (<button
                                                    className="text-white bg-blue-400 dark:bg-blue-500 cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                                    type="button"
                                                    disabled
                                                >
                                                    Đã lưu
                                                </button>) : <button
                                                    className="block rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring"
                                                    type="button"
                                                    onClick={() => addVoucher(user.current._id, voucher._id!)}
                                                >
                                                    Lưu mã
                                                </button>}
                                            </ul>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            );
                        }
                    }

                })}
            </Swiper>
            {/* </Slider> */}
            {/* </div> */}
        </div >
    </>
}

export default Vourcher