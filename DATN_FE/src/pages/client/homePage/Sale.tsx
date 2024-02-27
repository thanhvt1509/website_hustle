import React, { Dispatch, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { useFetchListProductByAdminQuery, useFetchListProductQuery, useFetchOneProductByAdminQuery } from "../../../store/product/product.service";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useListProductDetailQuery } from "../../../store/productDetail/productDetail.service";
import { listProductDetailSlice } from "../../../store/productDetail/productDetailSlice";
import { listProductSaleSlice } from "../../../store/product/productSlice";

const Sale = () => {
  const dispatch: Dispatch<any> = useDispatch()
  const { data: listProduct, isSuccess: isSuccessProduct } = useFetchListProductQuery()
  const { data: listProductDetail, isSuccess: isSuccessProductDetail } = useListProductDetailQuery()
  const productDetailState = useSelector((state: RootState) => state.productDetailSlice.productDetails)
  const productSaleState = useSelector((state: RootState) => state.productSaleSlice.products)
  productSaleState?.map((product) => {
    return [...new Set(productDetailState.filter((proDetail) => proDetail.product_id && proDetail.product_id.includes(product._id!)).filter((item) => item.quantity
    ))]
  })
  useEffect(() => {
    if (isSuccessProductDetail) {
      dispatch(listProductDetailSlice(listProductDetail))
    }
  }, [isSuccessProductDetail])
  useEffect(() => {
    if (isSuccessProduct) {
      dispatch(listProductSaleSlice(listProduct))
    }
  }, [isSuccessProduct])


  return (
    <div className="bg-[#faefec] py-[60px] mb-[60px]">
      <div className="max-w-[1500px] mx-auto">
        <div className="flex items-center gap-x-5 mb-8">
          <div className="w-3 h-3 rounded-full animate-ping bg-red-500"></div>
          <h1 className="text-[37px] font-semibold uppercase">Sale vô cực</h1>
        </div>
        <div className="product-sale mb-12">
          <Swiper
            grabCursor={"true"}
            spaceBetween={25}
            slidesPerView={"auto"}
            pagination={{ clickable: true, dynamicBullets: true }}
          >
            {productSaleState?.map((product, index) => {
              return <SwiperSlide key={index}
              >
                {[...new Set(productDetailState?.filter((item) => item.product_id === product?._id).filter((pro) => pro.quantity !== 0))].length != 0 ? <div className={`relative group overflow-hidden`}>
                  <Link to={`/products/${product._id}`}>
                    <div className="min-h-[305px] max-h-[395px] overflow-hidden">
                      <img
                        src={product.images?.[0]}
                        className="mx-auto max-h-[305px] min-h-[305px] w-full group-hover:opacity-0 group-hover:scale-100 absolute transition-all ease-linear duration-200"
                        alt=""
                      />

                      <img
                        src={product.images?.[1] ? product.images?.[1] : productDetailState?.find((proDetail) => proDetail?.product_id && proDetail?.product_id?.includes(product._id!))?.imageColor
                        }
                        className="mx-auto max-h-[305px] min-h-[305px] w-full duration-999 absolute opacity-0 group-hover:opacity-100 transition-all ease-linear"
                        alt=""
                      />
                    </div>
                  </Link>
                  <div className="product-info p-[8px] bg-white">
                    <div className="text-sm flex justify-between mb-3">
                      <span>+{productDetailState ? [...new Set(productDetailState?.filter((item) => item.product_id === product._id).map((pro) => pro.nameColor))].length : 0} màu sắc</span>
                      <div className="flex">+{productDetailState ? [...new Set(productDetailState?.filter((item) => item.product_id === product._id).map((pro) => pro.size))].length : 0}
                        <p className="ml-1">Kích thước</p>
                      </div>
                    </div>
                    <Link to="" className="block font-medium h-12">
                      {product.title}
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
                </div> : <div className={`relative group opacity-50`}>
                  <div className="absolute z-10 bg-red-500 font-semibold top-[50%] left-0 right-0 text-center text-white py-2">Hết hàng</div>
                  <Link to={`/products/${product._id}`}>
                    <img
                      src={product.images?.[0]}
                      className="mx-auto min-h-[305px] max-h-[395px]"
                      alt=""
                    />
                  </Link>
                  <div className="product-info p-[8px] bg-white">
                    <div className="text-sm flex justify-between mb-3">
                      <span>+{productDetailState ? [...new Set(productDetailState?.filter((item) => item.product_id === product._id).map((pro) => pro.nameColor))].length : 0} màu sắc</span>
                      <div className="flex">+{productDetailState ? [...new Set(productDetailState?.filter((item) => item.product_id === product._id).map((pro) => pro.size))].length : 0}
                        <p className="ml-1">Kích thước</p>
                      </div>
                    </div>
                    <Link to="" className="block font-medium h-12">
                      {product.title}
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
                </div>}

              </SwiperSlide>
            })}
          </Swiper>
        </div>
        <div className="text-center"><Link to="" className="py-[15px] text-center inline-block w-[400px] rounded border border-black uppercase hover:bg-black hover:text-white transition-all">Xem tất cả <span className="font-bold"> SALE VÔ CỰC</span></Link></div>
      </div>
    </div >
  );
};

export default Sale
