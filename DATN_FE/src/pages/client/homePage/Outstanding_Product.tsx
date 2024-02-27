import React, { Dispatch, useEffect } from "react";
import { Link } from "react-router-dom";
import { useFetchListProductQuery } from "../../../store/product/product.service";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { listProductOutStand, listProductOutStandSlice, listProductSlice } from "../../../store/product/productSlice";
import { useListProductDetailQuery } from "../../../store/productDetail/productDetail.service";
import { listProductDetailSlice } from "../../../store/productDetail/productDetailSlice";
import IProduct from "../../../store/product/product.interface";
import { useGetProductRevenueQuery } from "../../../store/statistic/statistic.service";

const Outstanding_Product = () => {
  const dispatch: Dispatch<any> = useDispatch()
  const { data: listProduct, isSuccess: isSuccessProduct } = useFetchListProductQuery()
  const { data: listProductDetail, isSuccess: isSuccessProductDetail } = useListProductDetailQuery()
  const productOutStandState = useSelector((state: RootState) => state.productOutstandReducer.products)
  const productDetailState = useSelector((state: RootState) => state.productDetailSlice.productDetails)
  const productState = useSelector((state: RootState) => state.productSlice.products)
  useEffect(() => {
    if (isSuccessProduct) {
      const productOutStands: any = []
      const productDetails = productDetailState?.filter((proSold) => proSold && proSold.sold).map((proDetail) => {
        return proDetail.product_id
      })
      const uniqueProductDetail = [...new Set(productDetails.map((proDetail) => proDetail))]
      if (uniqueProductDetail) {
        const filteredProducts = productState.filter((product) => uniqueProductDetail.includes(product._id!));
        filteredProducts.sort((a, b) => {
          const productA = productDetailState.find((proSold) => proSold.product_id === a._id);
          const productB = productDetailState.find((proSold) => proSold.product_id === b._id);
          if (productA && productB) {
            return productB.sold - productA.sold;
          }
          return 0;
        });
        productOutStands.push(...filteredProducts);
      }
      if (productOutStands) {
        dispatch(listProductOutStand(productOutStands))
      }
    }
  }, [isSuccessProduct, productDetailState, productState])
  useEffect(() => {
    if (isSuccessProductDetail) {
      dispatch(listProductDetailSlice(listProductDetail))
    }
  }, [isSuccessProductDetail])
  return (
    <div className="max-w-[1500px] mx-auto mb-[60px]">
      <div className="text-center mb-[30px]">
        <h1 className="uppercase text-[30px] font-medium mb-[13.5px]">
          SẢN PHẨM NỔI BẬT
        </h1>
        <div className="w-[277px] bg-black h-[1.5px] mx-auto"></div>
      </div>
      <div className="outstanding-product mb-12  gap-x-[25px] grid grid-cols-5 gap-y-[30px]">
        {productOutStandState?.slice(0, 10).map((product, index) => {
          return <div key={index} className={`relative overflow-hidden group ${[...new Set(productDetailState?.filter((item) => item.product_id === product?._id).filter((pro) => pro.quantity !== 0))].length === 0 && "opacity-60"}`}>
            {[...new Set(productDetailState?.filter((item) => item.product_id === product?._id).filter((pro) => pro.quantity !== 0))].length === 0 && <div className="absolute z-10 bg-red-500 font-semibold top-[50%] left-0 right-0 text-center text-white py-2">Hết hàng</div>}
            <Link to={`/products/${product._id}`}>
              <div className="min-h-[375px] max-h-[395px] overflow-hidden">
                <img
                  src={product.images?.[0]}
                  className="mx-auto max-h-[395px] min-h-[375px] w-full group-hover:opacity-0 group-hover:scale-100 absolute transition-all ease-linear duration-200"
                  alt=""
                />

                <img
                  src={product.images?.[1] ? product.images?.[1] : productDetailState?.find((proDetail) => proDetail.product_id && proDetail?.product_id?.includes(product._id!))?.imageColor
                  }
                  className="mx-auto max-h-[375px] min-h-[375px] w-full duration-999 absolute opacity-0 group-hover:opacity-100 transition-all ease-linear"
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
          </div>
        })}
      </div>
      <div className="text-center">
        <Link
          to=""
          className="py-[15px] text-center inline-block w-[400px] rounded border border-black uppercase hover:bg-black hover:text-white transition-all"
        >
          Xem tất cả <span className="font-bold"> sản phẩm nổi bật</span>
        </Link>
      </div>
    </div>
  );
};

export default Outstanding_Product;
