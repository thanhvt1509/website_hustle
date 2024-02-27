import React, { Dispatch, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { useFetchListCategoryQuery } from "../../../store/category/category.service";
import { useDispatch, useSelector } from "react-redux";
import { listCategorySlice } from "../../../store/category/categorySlice";
import { RootState } from "../../../store";
import { useFetchListProductQuery } from "../../../store/product/product.service";
import { listProductSlice } from "../../../store/product/productSlice";

const Category = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const { data: listCategory, isSuccess: isSuccessCategory } =
    useFetchListCategoryQuery();
  const { data: listProduct, isSuccess: isSuccessProduct } =
    useFetchListProductQuery();
  const categoryState = useSelector(
    (state: RootState) => state.categorySlice.categories
  );

  // const productState = useSelector((state: RootState) => state.productSlice.products)
  useEffect(() => {
    if (isSuccessCategory) {
      dispatch(listCategorySlice(listCategory));
    }
  }, [isSuccessCategory]);
  useEffect(() => {
    if (isSuccessProduct) {
      dispatch(listProductSlice(listProduct));
    }
  }, [isSuccessProduct]);

  return (
    <div className="container">
      <div className="mt-16 mb-[80px]">
        <h1 className="text-[37px] font-semibold uppercase mb-8">
          Danh mục sản phẩm
        </h1>
        <div className="category-list">
          <Swiper
            // grabCursor={"true"}
            spaceBetween={30}
            slidesPerView={"auto"}
            pagination={{ clickable: true, dynamicBullets: true }}
          >
            {categoryState?.map((cate, index) => {
              return (
                <SwiperSlide key={index}>
                  <div className="relative">
                    <Link to={`collections/${cate._id}`}>
                      <img
                        src={cate.images?.url}
                        alt=""
                        className="h-[470px] w-full object-cover"
                      />
                      <div className="flex justify-between items-center w-[352.5px] bg-gray-200 bg-opacity-40 p-5 absolute bottom-0">
                        <span className="text-[22px] font-medium leading-none hover:text-primary transition-all">
                          {cate.name}
                        </span>
                        <span className="w-[45px] h-[45px] rounded-full bg-white hover:bg-black hover:text-white flex justify-center items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                            />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Category;
