import React, { Dispatch, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useFetchOneProductQuery } from '../../../store/product/product.service';
import { addProductViewed, listProductViewed } from '../../../store/product/productSlice';
import IProduct from '../../../store/product/product.interface';
const ProductViewed = (props: any) => {
    const dispatch: Dispatch<any> = useDispatch()
    const { data: productById } = useFetchOneProductQuery(props?.idProduct!)
    const productViewedState = useSelector((state: RootState) => state.productViewedSliceReducer.products)
    const productViewedStore: IProduct[] = JSON.parse(sessionStorage.getItem("productViewed")!)

    useEffect(() => {
        if (productById) {
            dispatch(addProductViewed(productById))
        }
    }, [productById])
    useEffect(() => {
        if (productViewedStore) {
            dispatch(listProductViewed(productViewedStore))
        }
    }, [])
    return (
        <div>
            <div>
                <h1 className="text-[37px] font-semibold mb-[30px] text-center uppercase">
                    Sản phẩm vừa xem
                </h1>
                <div className="product-related mb-12">
                    <Swiper
                        modules={[Navigation]}
                        // grabCursor={"true"}
                        spaceBetween={25}
                        slidesPerView={"auto"}
                        navigation={true}
                    >
                        {productViewedState?.slice().reverse().map((product, index) => {
                            return <SwiperSlide key={index}>
                                <div className="relative group">
                                    <Link onClick={() => {
                                        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                                    }} to={`/products/${product._id}`}>
                                        <img
                                            src={product.images?.[0]}
                                            className="mx-auto h-[351px] w-full"
                                            alt=""
                                        />
                                    </Link>
                                    <div className="product-info p-[8px] bg-white">
                                        <div className="text-sm flex justify-between mb-3">
                                            <span>+{props?.productDetailState ? [...new Set(props?.productDetailState?.filter((item) => item.product_id === product._id).map((pro) => pro.nameColor))].length : 0} màu sắc</span>
                                            <div className="flex">+{props?.productDetailState ? [...new Set(props?.productDetailState?.filter((item) => item.product_id === product._id).map((pro) => pro.size))].length : 0}
                                                <p className="ml-1">Kích thước</p>
                                            </div>
                                        </div>
                                        <Link to="" className="font-medium">
                                            {product?.title}

                                        </Link>
                                        <div className="price flex gap-x-[8px] items-baseline">
                                            <span className="text-sm text-[#FF2C26] font-semibold">
                                                {(product?.price - product.discount).toLocaleString("vi-VN")}đ
                                            </span>
                                            {product.discount !== 0 && <span className="text-[13px] text-[#878C8F]">
                                                <del>{product.price?.toLocaleString("vi-VN")}đ</del>
                                            </span>}
                                        </div>
                                    </div>
                                    <div>
                                        {product.discount > 0 && <span className="width-[52px] absolute top-3 left-3 height-[22px] rounded-full px-3 py-[3px] text-xs font-semibold text-white bg-[#FF0000]">
                                            -{`${((product?.price - (product?.price - product?.discount)) / product?.price * 100).toFixed(0)}`}%
                                        </span>}
                                    </div>
                                    <Link
                                        to=""
                                        className="rounded-lg opacity-0 absolute bottom-[140px] left-2/4 -translate-x-2/4 bg-white flex gap-x-[5px] items-center p-3 w-[175px] justify-center group-hover:opacity-100 hover:bg-black hover:text-white transition-all"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="w-5 h-5"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                            />
                                        </svg>
                                        <button type="button" className="uppercase text-xs font-semibold">
                                            Thêm vào giỏ
                                        </button>
                                    </Link>
                                </div>
                            </SwiperSlide>
                        })}

                    </Swiper>
                </div>
            </div>
        </div>
    )
}

export default ProductViewed
