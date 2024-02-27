import React, { Dispatch, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useAddCartMutation } from '../../../store/cart/cart.service'
import { addCartSlice } from '../../../store/cart/cartSlice'
import { RootState } from '../../../store'
import { listProductDetailByOutfitSizeSecondSlice, listProductDetailByOutfitSizeSlice, listProductDetailFilterByOutfitSecondSlice, listProductDetailFilterByOutfitSlice, listProductDetailFilterSlice, listProductDetailRelatedSlice } from '../../../store/productDetail/productDetailSlice'
import { useListProductDetailQuery } from '../../../store/productDetail/productDetail.service'
import { IProductDetail } from '../../../store/productDetail/productDetail.interface'
import IProduct from '../../../store/product/product.interface'
import { ICart } from '../../../store/cart/cart.interface'


const OutfitProductDetail = (props: any) => {
    const dispatch: Dispatch<any> = useDispatch()
    const [buttonOutfit, setButtonOutfit] = useState<boolean>(false)
    const [totalOutfit, setTotalOutfit] = useState<number>(0)
    const userStore = useSelector((state: any) => state.user)
    const { data: listProductDetailAPI, isSuccess: isSuccessProductDetail } = useListProductDetailQuery()
    const productDetailState = useSelector((state: RootState) => state.productDetailRelatedReducer.productDetails)
    const productFilterByOutfitSizeState = useSelector((state: RootState) => state.productDetailByOutfitSizeReducer.productDetails)
    const productFilterByOutfitSizeSecondState = useSelector((state: RootState) => state.productDetailByOutfitSizeSecondReducer.productDetails)
    // state lay productDetailId
    const productDetailIdFirstItem = useSelector((state: RootState) => state.productDetailFilterByOutfitSliceReducer.productDetails)
    const productDetailIdSecondtItem = useSelector((state: RootState) => state.productDetailFilterByOutfitSecondReducer.productDetails)

    const [onAddCart] = useAddCartMutation()
    const handleAddtoCartOutfit = async (id: string) => {
        try {
            if (id) {
                setIdOutfit(id)
                setButtonOutfit(true)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const [idOutfit, setIdOutfit] = useState<string>("")
    const getOneOutfit = props?.listOutfitState.find((outfit: any) => outfit._id && outfit._id.includes(idOutfit && idOutfit))
    const [colorName, setColorName] = useState<string>("")
    const [size, setSize] = useState<string>("")
    const [productId, buttonProductId] = useState<string>("")
    const [SecondcolorName, setSecondColorName] = useState<string>("")
    const [Secondsize, setSecondSize] = useState<string>("")
    const [productIdSecond, setButtonSecondProductId] = useState<string>("")

    useEffect(() => {
        if (listProductDetailAPI) {
            dispatch(listProductDetailRelatedSlice(listProductDetailAPI))
        }
    }, [isSuccessProductDetail])
    useEffect(() => {
        dispatch(listProductDetailFilterByOutfitSlice({ product_id: "", nameColor: "", sizeTerm: "", productDetails: [] }))
        dispatch(listProductDetailFilterByOutfitSecondSlice({ product_id: "", nameColor: "", sizeTerm: "", productDetails: [] }))
    }, [props?.id])
    // Tong outfit
    useEffect(() => {
        if (props?.listOutfitByProductIdState) {
            let total = 0
            props?.listOutfitByProductIdState[0]?.items?.map((item: any) => {
                props?.productState?.filter((pro: any) => pro._id === item.product_id).map((product: any) => {
                    return total += (product.price - product.discount)
                })
            })
            setTotalOutfit(total)
        }
    }, [props?.listOutfitByProductIdState, props?.id, props?.productState])
    // lay ra nhung size theo color
    useEffect(() => {
        if (colorName === "" && listProductDetailAPI) {
            dispatch(listProductDetailByOutfitSizeSlice({ _id: productId, nameTerm: props?.listOutfitByProductIdState?.[0]?.items?.[0]?.nameColor, productDetails: listProductDetailAPI }))
        }
        if (productId && colorName !== "" && listProductDetailAPI) {
            dispatch(listProductDetailByOutfitSizeSlice({ _id: productId, nameTerm: colorName, productDetails: listProductDetailAPI }))
        }
    }, [colorName, productId, isSuccessProductDetail, props?.id])
    useEffect(() => {
        if (SecondcolorName === "" && listProductDetailAPI) {
            dispatch(listProductDetailByOutfitSizeSecondSlice({ _id: productIdSecond, nameTerm: props?.listOutfitByProductIdState?.[0]?.items?.[1]?.nameColor, productDetails: listProductDetailAPI }))
        }
        if (productIdSecond && SecondcolorName && listProductDetailAPI) {
            dispatch(listProductDetailByOutfitSizeSecondSlice({ _id: productIdSecond, nameTerm: SecondcolorName, productDetails: listProductDetailAPI }))
        }
    }, [SecondcolorName, productIdSecond, isSuccessProductDetail, props?.id])
    // lay ra productId
    useEffect(() => {
        if (productId && colorName === "" && size && productFilterByOutfitSizeState.length > 0) {
            dispatch(listProductDetailFilterByOutfitSlice({ product_id: productId, nameColor: props?.listOutfitByProductIdState?.[0]?.items?.[0]?.nameColor, sizeTerm: size, productDetails: productFilterByOutfitSizeState }))
        }
        if (productId && colorName !== "" && size !== "" && productFilterByOutfitSizeState.length > 0) {
            dispatch(listProductDetailFilterByOutfitSlice({ product_id: productId, nameColor: colorName, sizeTerm: size, productDetails: productFilterByOutfitSizeState }))
        }
    }, [size, props?.id])
    useEffect(() => {
        if (productIdSecond && SecondcolorName === "" && Secondsize && productFilterByOutfitSizeState.length > 0) {
            dispatch(listProductDetailFilterByOutfitSecondSlice({ product_id: productIdSecond, nameColor: props?.listOutfitByProductIdState?.[0]?.items?.[1]?.nameColor, sizeTerm: Secondsize, productDetails: productFilterByOutfitSizeSecondState }))
        }
        if (productIdSecond && SecondcolorName !== "" && Secondsize !== "" && productFilterByOutfitSizeSecondState.length > 0) {
            dispatch(listProductDetailFilterByOutfitSecondSlice({ product_id: productIdSecond, nameColor: SecondcolorName, sizeTerm: Secondsize, productDetails: productFilterByOutfitSizeSecondState }))
        }
    }, [Secondsize, props?.id])

    const onAddCartFunc = async () => {
        if (productDetailIdFirstItem?.length > 0 || productDetailIdSecondtItem?.length > 0) {
            let newItem: IProductDetail[] = []
            const firstItemCustom = productDetailIdFirstItem.length > 0 && productDetailIdSecondtItem.length === 0 && props?.listOutfitByProductIdState?.[0]?.items?.find((item: IProductDetail) => item.product_id !== productDetailIdFirstItem[0]?.product_id)
            const secondItemCustom = productDetailIdSecondtItem.length > 0 && productDetailIdFirstItem.length === 0 && props?.listOutfitByProductIdState?.[0]?.items?.find((item: IProductDetail) => item.product_id !== productDetailIdSecondtItem[1]?.product_id)
            if (firstItemCustom) {
                newItem.push(firstItemCustom)
            }
            if (secondItemCustom) {
                newItem.push(secondItemCustom)
            }
            productDetailIdFirstItem.length === 0 ? newItem.push(firstItemCustom) : newItem.push(productDetailIdFirstItem[0])
            productDetailIdSecondtItem.length === 0 ? newItem.push(secondItemCustom) : newItem.push(productDetailIdSecondtItem[0])
            newItem?.filter((proDetail) => proDetail.quantity > 0).map((productDetail) => {
                props.productState?.filter((product: any) => product._id && product._id.includes(productDetail.product_id)).map(async (pro: IProduct) => {
                    const cartId = props?.listCartState?.filter((cart: any) =>
                        cart.productDetailId._id === productDetail._id
                    )
                    if (cartId?.[0]?.quantity + 1 > productDetail.quantity) {
                        return
                    }
                    if (productDetail) {
                        if (userStore?.current?._id) {
                            await onAddCart({
                                userId: userStore?.current?._id,
                                productDetailId: productDetail,
                                quantity: 1,
                                totalMoney: pro?.price - pro?.discount
                            }).then(() => dispatch(addCartSlice({
                                userId: userStore?.current?._id,
                                productDetailId: productDetail,
                                quantity: 1,
                                totalMoney: pro?.price - pro?.discount
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
                                totalMoney: pro?.price - pro?.discount
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
            })

            return
        }
        if (getOneOutfit && props?.productState) {
            const { title, items, description, sku } = getOneOutfit;
            items?.filter((proDetail: IProductDetail) => proDetail.quantity > 0).map((productDetail: IProductDetail) => {
                props.productState?.filter((product: IProduct) => product._id && product._id.includes(productDetail.product_id)).map(async (pro: IProduct) => {
                    const cartId = props?.listCartState?.filter((cart: ICart) =>
                        cart.productDetailId._id === productDetail._id
                    )
                    if (cartId?.[0]?.quantity + 1 > productDetail.quantity) {
                        return
                    }
                    if (productDetail) {
                        if (userStore?.current?._id) {
                            await onAddCart({
                                userId: userStore?.current?._id,
                                productDetailId: productDetail,
                                quantity: 1,
                                totalMoney: pro?.price - pro?.discount
                            }).then(() => dispatch(addCartSlice({
                                userId: userStore?.current?._id,
                                productDetailId: productDetail,
                                quantity: 1,
                                totalMoney: pro?.price - pro?.discount
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
                                totalMoney: pro?.price - pro?.discount
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
        if (buttonOutfit && getOneOutfit) {
            onAddCartFunc();
            setButtonOutfit(false);
        }
    }, [buttonOutfit, getOneOutfit]);
    const OutFitItemFirstLengh = props?.productState?.find((product: any) => product._id === props.listOutfitByProductIdState?.[0]?.items?.[0]?.product_id)
    const OutFitItemSecondLengh = props?.productState?.find((product: any) => product._id === props.listOutfitByProductIdState?.[0]?.items?.[1]?.product_id)
    return (
        <div className="w-[650px] min-h-[250px] my-4 border-2 border-dashed border-red-500 p-5">
            {props && <>
                <div className="flex justify-between items-center">
                    <h1 className="font-semibold">
                        Gợi ý cho bạn
                        {/* {props.listOutfitByProductIdState?.[0]?.title} */}
                    </h1>
                    <span>Mã: {props.listOutfitByProductIdState?.[0]?.sku}</span>
                </div>
                <div className="flex justify-between p-5 gap-x-[30px]">
                    {/* productDetailRelatedState */}
                    <div className="flex flex-col justify-between w-1/2">
                        <input type="text" className='hidden' value={props?.listOutfitByProductIdState?.[0]?.items?.[0]?._id} />
                        <Link to={`/products/${props.listOutfitByProductIdState?.[0]?.items?.[0]?.product_id}`}>
                            <img className="h-[250px]" src={props?.listOutfitByProductIdState?.[0]?.items?.[0]?.imageColor} alt="" />
                        </Link>
                        <div className="py-5 px-3">
                            <p className="text-sm">
                                {props.listOutfitByProductIdState?.[0]?.items?.[0]?.product_id === props.id && props.id ?
                                    <span className="block font-bold text-sm">
                                        Bạn đang xem:
                                    </span> : ""}
                                <span className="ml-2">
                                    x1 {OutFitItemFirstLengh?.title}
                                </span>
                            </p>
                            {[...new Set(productDetailState?.filter((item) => item.product_id === props.listOutfitByProductIdState?.[0]?.items?.[0]?.product_id).filter((pro) => pro.quantity !== 0))].length != 0 ?
                                <>
                                    <p className="opacity-70 text-[14px] my-3">Vui lòng chọn:</p>
                                    <div className="text-[14px]">
                                        {/* color */}
                                        <select defaultValue={props.listOutfitByProductIdState?.[0]?.items?.[0]?.nameColor} onClick={() => buttonProductId(OutFitItemFirstLengh?._id)} onChange={(e) => setColorName(e.target.value)} className="border border-1 px-2 text-sm">
                                            {
                                                [...new Set(props?.productDetailRelatedState?.filter((item: any) => item?.product_id === OutFitItemFirstLengh?._id).map((proDetail: any) => proDetail.nameColor))
                                                ].map((color: any, index) => (
                                                    <option key={index} value={color}>{color}</option>
                                                ))
                                            }
                                        </select>
                                        {/* size */}
                                        <select onClick={() => buttonProductId(OutFitItemFirstLengh?._id)} onChange={(e) => setSize(e.target.value)} className="border border-1 ml-2 px-2 text-sm">
                                            {productFilterByOutfitSizeState.length > 0 ?
                                                [...new Set(productFilterByOutfitSizeState?.filter((proSize) => proSize.quantity > 0).map((proDetail) => proDetail.size))].map((size, index) => (
                                                    <option key={index} value={size}>{size}</option>
                                                ))
                                                : <option value={props?.listOutfitByProductIdState?.[0]?.items?.[0]?.size}>{props?.listOutfitByProductIdState?.[0]?.items?.[0]?.size}</option>
                                            }
                                        </select>
                                    </div>
                                    <p className="font-bold text-[14px] pt-10">{(OutFitItemFirstLengh?.price - OutFitItemFirstLengh?.discount).toLocaleString("vi-VN")}₫</p>
                                </>
                                : <div className="bg-red-400 text-white w-[150px] text-[10px] flex items-center justify-center my-[40px] font-semibold rounded-md pointer-events-none py-3 px-4">Sản phẩm đã hết hàng</div>}
                        </div>
                    </div>
                    {/* item second */}
                    <div className="flex flex-col justify-between w-1/2">
                        <input type="text" className='hidden' value={props?.listOutfitByProductIdState?.[0]?.items?.[1]?._id} />
                        <Link to={`/products/${props.listOutfitByProductIdState?.[0]?.items?.[1]?.product_id}`}>
                            <img className="h-[250px]" src={props?.listOutfitByProductIdState?.[0]?.items?.[1]?.imageColor} alt="" />
                        </Link>
                        <div className="py-5 px-3">
                            <p className="text-sm">{props.listOutfitByProductIdState?.[0]?.items?.[1]?.product_id === props.id && props.id ? <span className="block font-bold text-sm">Bạn đang xem:</span> : ""}<span className="ml-2">x1 {OutFitItemSecondLengh?.title}</span></p>
                            {[...new Set(productDetailState?.filter((item) => item.product_id === props.listOutfitByProductIdState?.[0]?.items?.[1]?.product_id).filter((pro) => pro.quantity !== 0))].length != 0 ? <> <p className="opacity-70 text-[14px] my-3">Vui lòng chọn:</p>
                                <div className="text-[14px]">
                                    {/* color */}
                                    <select defaultValue={props.listOutfitByProductIdState?.[0]?.items?.[1]?.nameColor} onClick={() => setButtonSecondProductId(OutFitItemSecondLengh?._id)} onChange={(e) => setSecondColorName(e.target.value)} className="border border-1 px-2 text-sm">
                                        {
                                            [...new Set(props?.productDetailRelatedState?.filter((item: any) => item?.product_id === OutFitItemSecondLengh?._id).map((proDetail: any) => proDetail.nameColor))
                                            ].map((color: any, index) => (
                                                <option key={index} value={color}>{color}</option>
                                            ))

                                        }
                                    </select>
                                    {/* size */}
                                    <select onClick={() => setButtonSecondProductId(OutFitItemSecondLengh?._id)} onChange={(e) => setSecondSize(e.target.value)} className="border border-1 ml-2 px-2 text-sm">
                                        {
                                            productFilterByOutfitSizeSecondState.length > 0 ?
                                                [...new Set(productFilterByOutfitSizeSecondState?.filter((proSize) => proSize.quantity > 0).map((proDetail) => proDetail.size))].map((size, index) => (
                                                    <option key={index} value={size}>{size}</option>
                                                ))
                                                : <option value={props?.listOutfitByProductIdState?.[0]?.items?.[1]?.size}>{props?.listOutfitByProductIdState?.[0]?.items?.[1]?.size}</option>
                                        }
                                    </select>
                                </div>
                                <p className="font-bold text-[14px] pt-10">{(OutFitItemSecondLengh?.price - OutFitItemSecondLengh?.discount).toLocaleString("vi-VN")}₫</p></> : <div className="bg-red-400 text-white w-[150px] text-[10px] flex items-center justify-center my-[40px] font-semibold rounded-md pointer-events-none py-3 px-4">Sản phẩm đã hết hàng</div>}

                        </div>
                    </div>
                </div>
                <div className="border-t-2 flex py-3 items-center">
                    <div className="flex flex-col">
                        <div className="flex text-sm font-bold"><span>Tổng tiền:</span> <p className="text-red-500 ml-1">{(totalOutfit).toLocaleString("vi-VN")}đ</p></div>
                    </div>
                    <button onClick={() => handleAddtoCartOutfit(props.listOutfitByProductIdState?.[0]?._id!)} className="bg-red-500 rounded-lg  hover:bg-red-600 transition-all ease-linear text-white px-4 py-2 uppercase ml-3 text-[12px]">Thêm 2 vào giỏ hàng</button>
                </div>
            </>}

        </div>
    )
}

export default OutfitProductDetail
