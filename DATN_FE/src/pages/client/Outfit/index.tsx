import Header from '../../../layout/Header'
import Footer from '../../../layout/Footer'
import Outfit from '../homePage/Outfit'
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
import { useAddCartMutation } from "../../../store/cart/cart.service";
import { CartOutfitSchema, cartOutfitForm } from "../../../Schemas/CartOutfit";
import { addCartSlice } from "../../../store/cart/cartSlice";
const OutfitPage = () => {
    const dispatch: Dispatch<any> = useDispatch()
    const { data: listOutfit, isSuccess: isSuccessOutFit } = useFetchListOutfitQuery()
    const { data: listProduct, isSuccess: isSuccessListProduct } = useFetchListProductQuery()
    const outfitState = useSelector((state: RootState) => state.outfitSlice.outfits)
    const productState = useSelector((state: RootState) => state.productSlice.products)
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
    const userStore = useSelector((state: any) => state.user)

    const [idOutfit, setIdOutfit] = useState<string>("")
    const { data: getOneOutfit } = useFetchOneOutfitQuery(idOutfit!)
    const [buttonOutfit, setButtonOutfit] = useState<boolean>(false)
    const handleOutfitById = (id: string) => {
        if (id) {
            setIdOutfit(id)
            setButtonOutfit(true)
        }
    }
    const onAddCartFunc = async () => {
        if (getOneOutfit && productState) {
            console.log(getOneOutfit)
            const { title, items, description, sku } = getOneOutfit;
            items?.forEach((productDetail) => {
                productState?.filter((product) => product._id && product._id.includes(productDetail.product_id)).map(async (pro) => {
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
        onAddCartFunc()
        console.log(1)
        setButtonOutfit(false)
    }, [idOutfit, getOneOutfit])
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0 });
    }, []);
    return (
        <div>
            <Header></Header>
            <div className="bg-[#faefec] py-[50px]">
                <div className="container">
                    <h1 className="text-[37px] mb-6 font-semibold uppercase">
                        Outfit of the day
                    </h1>
                    <div className="grid grid-cols-4 gap-x-5">
                        {outfitState?.map((outfit) => {
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
                                                            <span className="text-red-500 text-[10px] font-semibold">{(product.price - product.discount).toLocaleString("vi-VN")}₫</span>
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
            <Footer></Footer>
        </div>
    )
}

export default OutfitPage
