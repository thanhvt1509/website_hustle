import React, { Dispatch, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFetchListOutfitQuery, useFetchOneOutfitQuery } from "../../../store/outfit/outfit.service";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { listOutfitSlice } from "../../../store/outfit/outfitSlice";
import { useFetchListProductQuery } from "../../../store/product/product.service";
import { listProductSlice } from "../../../store/product/productSlice";
import { useForm } from "react-hook-form";
import { cartForm } from "../../../Schemas/Cart";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAddCartMutation, useListCartQuery } from "../../../store/cart/cart.service";
import { CartOutfitSchema, cartOutfitForm } from "../../../Schemas/CartOutfit";
import { addCartSlice, listCartSlice } from "../../../store/cart/cartSlice";
import { listProductDetailRelatedSlice } from "../../../store/productDetail/productDetailSlice";
import { useListProductDetailQuery } from "../../../store/productDetail/productDetail.service";

const Outfit = () => {
  const dispatch: Dispatch<any> = useDispatch()
  const { data: listOutfit, isSuccess: isSuccessOutFit } = useFetchListOutfitQuery()
  const { data: listProduct, isSuccess: isSuccessListProduct } = useFetchListProductQuery()
  const { data: listProductDetailAPI, isSuccess: isSuccessProductDetail } = useListProductDetailQuery()
  const productDetailState = useSelector((state: RootState) => state.productDetailRelatedReducer.productDetails)

  const outfitState = useSelector((state: RootState) => state.outfitSlice.outfits)
  const productState = useSelector((state: RootState) => state.productSlice.products)
  const listCartState = useSelector((state: RootState) => state.cartSlice.carts)
  const [onAddCart] = useAddCartMutation()
  const { register, setValue, handleSubmit, formState: { errors } } = useForm<cartOutfitForm>({
    resolver: yupResolver(CartOutfitSchema)
  })
  useEffect(() => {
    if (listOutfit) {
      dispatch(listOutfitSlice(listOutfit))
    }
  }, [isSuccessOutFit])
  useEffect(() => {
    if (listProduct) {
      dispatch(listProductSlice(listProduct))
    }
  }, [isSuccessListProduct])
  useEffect(() => {
    if (listProductDetailAPI) {
      dispatch(listProductDetailRelatedSlice(listProductDetailAPI))
    }
  }, [isSuccessProductDetail])
  const userStore = useSelector((state: any) => state.user)

  const [idOutfit, setIdOutfit] = useState<string>("")
  const [buttonOutfit, setButtonOutfit] = useState<boolean>(false)
  const handleOutfitById = (id: string) => {
    if (id) {
      setIdOutfit(id)
      setButtonOutfit(true)
    }
  }
  const getOneOutfit = outfitState.find((outfit) => outfit._id && outfit._id.includes(idOutfit && idOutfit))
  const onAddCartFunc = async () => {
    if (getOneOutfit && productState) {
      const { title, items, description, sku } = getOneOutfit;
      items?.filter((proDetail) => proDetail.quantity > 0).map((productDetail) => {
        productState?.filter((product) => product._id && product._id.includes(productDetail.product_id)).map(async (pro) => {
          const cartId = listCartState?.filter((cart) =>
            cart.productDetailId._id === productDetail._id
          )
          if (cartId?.[0]?.quantity + 1 > productDetail.quantity) {
            return
          }
          if (productDetail && productDetail._id) {
            if (userStore?.current?._id) {
              await onAddCart({
                userId: userStore?.current?._id,
                productDetailId: productDetail,
                quantity: 1,
                totalMoney: (pro?.price - pro?.discount) * 1
              }).then(() => dispatch(addCartSlice({
                userId: userStore?.current?._id,
                productDetailId: productDetail,
                quantity: 1,
                totalMoney: (pro?.price - pro?.discount) * 1
              }))).then(() => {
                const overlayCart = document.querySelector(".overlay-cart")
                const overlay = document.querySelector(".overlay")
                overlay?.classList.remove("hidden")
                overlayCart?.classList.remove("translate-x-[100%]", "opacity-0")
                const dropdown = document.querySelector(".dropdown-user")
                if (!dropdown?.classList.contains("opacity-0")) {
                  dropdown?.classList.add("opacity-0")
                  dropdown?.classList.add("pointer-events-none")
                }
              })
            } else {
              dispatch(addCartSlice({
                productDetailId: productDetail,
                quantity: 1,
                totalMoney: (pro.price - pro.discount) * 1
              }))
              const overlayCart = document.querySelector(".overlay-cart")
              const overlay = document.querySelector(".overlay")
              overlay?.classList.remove("hidden")
              overlayCart?.classList.remove("translate-x-[100%]", "opacity-0")
              const dropdown = document.querySelector(".dropdown-user")
              if (!dropdown?.classList.contains("opacity-0")) {
                dropdown?.classList.add("opacity-0")
                dropdown?.classList.add("pointer-events-none")
              }
            }
          }
        })
      });
    }
  };
  useEffect(() => {
    if (buttonOutfit === true) {
      onAddCartFunc()
      setButtonOutfit(false)
    }
  }, [buttonOutfit, getOneOutfit])
  return (
    <div className="bg-[#faefec] py-[50px]">
      <div className="container">
        <h1 className="text-[37px] mb-6 font-semibold uppercase">
          Outfit of the day
        </h1>
        <div className="grid grid-cols-4 gap-x-5">
          {outfitState?.slice(0, 8).map((outfit) => {
            return <div>
              <div className="outfit group transition-all relative">
                {errors ? errors.items?.message : ""}
                <img
                  src={outfit.image.url}
                  alt=""
                  className="w-[476px] h-[505px] object-cover mb-4"
                />
                <p className="uppercase text-xl mb-4 font-medium">
                  {outfit.title}
                </p>
                <button onClick={() => handleOutfitById(outfit._id!)} className="uppercase bg-white text-black border border-black rounded py-3 px-6 hover:text-white hover:bg-black transition-all">
                  Mua fullset
                </button>
                <div className="hidden group-hover:block transition-all absolute top-[25%] left-[20%]">
                  {outfit.items?.map((item) => {
                    return (
                      productState?.filter((pro) => pro._id && pro._id.includes(item.product_id)).map((product) => {
                        return <Link to={`/products/${product._id}`} className="flex mb-8 gap-x-4 min-h-[80px] max-h-[80px] max-w-[230px] bg-white rounded-md p-3 hover:bg-gray-300">

                          <img
                            src={item.imageColor}
                            alt=""
                            className="w-[45px] h-[45px] object-cover flex-shrink-0"
                          />
                          <div>
                            <p className="block font-semibold  text-[12px]">
                              {product.title}
                            </p>
                            <div className="flex justify-between">
                              <span className="text-red-500 text-[10px] font-semibold">{(product.price - product.discount).toLocaleString("vi-VN")}₫</span>
                              {[...new Set(productDetailState?.filter((item) => item.product_id === product._id).filter((pro) => pro.quantity !== 0))].length === 0 ? <p className="text-[10px] font-bold bg-red-500 text-white p-1">Hết hàng</p> : ""}

                            </div>
                          </div>
                        </Link>
                      })
                    )
                  })}
                </div>
              </div>
            </div>
          })}
        </div>
      </div>
      <div className="text-center mt-10">
        <Link
          to={"/outfit"}
          className="py-[15px] text-center inline-block w-[400px] rounded border border-black uppercase hover:bg-black hover:text-white transition-all"
        >
          Xem tất cả <span className="font-bold"> Outfit</span>
        </Link>
      </div>
    </div>
  );
};

export default Outfit;
