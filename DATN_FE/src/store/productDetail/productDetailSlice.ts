import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IGetOneIdProductDetailState, IProductDetail, IProductDetailFilterState, IProductDetailState } from "./productDetail.interface"

export const initialStateProductDetail: IProductDetailState = {
    productDetails: []
}
export const initalStateProductDetailFilter: IProductDetailFilterState = {
    _id: "",
    nameTerm: "",
    productDetails: []
}
export const initialGetOneIdProductDetailState: IGetOneIdProductDetailState = {
    product_id: "",
    nameColor: "",
    sizeTerm: "",
    productDetails: []
}

const productDetailSlice = createSlice({
    name: "productDetails",
    initialState: initialStateProductDetail,
    reducers: ({
        listProductDetailSlice: (state: IProductDetailState, actions: PayloadAction<IProductDetail[]>) => {
            state.productDetails = actions.payload
        },
        listProductDetailByProductId: (state: IProductDetailState, actions: PayloadAction<IProductDetail[]>) => {
            state.productDetails = actions.payload
        },
    })
})
const productDetailRelatedSlice = createSlice({
    name: "productDetails",
    initialState: initialStateProductDetail,
    reducers: ({
        listProductDetailRelatedSlice: (state: IProductDetailState, actions: PayloadAction<IProductDetail[]>) => {
            state.productDetails = actions.payload
        },
        // listProductDetailByProductId: (state: IProductDetailState, actions: PayloadAction<IProductDetail[]>) => {
        //     state.productDetails = actions.payload
        // },
    })
})
const productDetailFilterSlice = createSlice({
    name: "productDetails",
    initialState: initalStateProductDetailFilter,
    reducers: ({
        listProductDetailFilter: (state: IProductDetailState, actions: PayloadAction<IProductDetail[]>) => {
            state.productDetails = actions.payload
        },
        listProductDetailFilterSlice: (state: IProductDetailFilterState, actions: PayloadAction<IProductDetailFilterState>) => {
            const _id = actions.payload._id.trim()
            const nameColor = actions?.payload?.nameTerm.trim().toLowerCase()
            if (nameColor) {
                const newListProductDetail = actions?.payload?.productDetails.filter((product) => product && product.nameColor.toLowerCase().trim() === nameColor && product.product_id.includes(_id))
                state.productDetails = newListProductDetail

            }
        },
    })
})
const productDetailIdSlice = createSlice({
    name: "productDetails",
    initialState: initialGetOneIdProductDetailState,
    reducers: ({
        listProductDetailIdFilter: (state: IProductDetailState, actions: PayloadAction<IProductDetail[]>) => {
            state.productDetails = actions.payload
        },
        getOneIdProductDetailSlice: (state: IGetOneIdProductDetailState, actions: PayloadAction<IGetOneIdProductDetailState>) => {
            console.log(actions.payload)
            const product_id = actions.payload.product_id.trim()
            const nameColor = actions.payload.nameColor.trim().toLowerCase()
            const sizeTerm = actions.payload.sizeTerm.trim().toLowerCase()
            if (nameColor) {
                const newListProductDetail = actions.payload.productDetails.filter((product) => product && product.nameColor.toLowerCase().includes(nameColor) && product.product_id.includes(product_id) && product.size.toLowerCase() === sizeTerm)
                console.log(newListProductDetail)
                state.productDetails = newListProductDetail

            }
        },
    })
})

const productDetailFilterByOutfitSlice = createSlice({
    name: "productDetails",
    initialState: initialGetOneIdProductDetailState,
    reducers: ({
        listProductDetailFilterByOutfit: (state: IProductDetailState, actions: PayloadAction<IProductDetail[]>) => {
            state.productDetails = actions.payload
        },
        listProductDetailFilterByOutfitSlice: (state: IGetOneIdProductDetailState, actions: PayloadAction<IGetOneIdProductDetailState>) => {
            console.log(actions.payload)
            const product_id = actions.payload.product_id.trim()
            const nameColor = actions.payload.nameColor.trim().toLowerCase()
            const sizeTerm = actions.payload.sizeTerm.trim().toLowerCase()
            if (nameColor) {
                const newListProductDetail = actions.payload.productDetails.filter((product) => product && product.nameColor.toLowerCase() === nameColor && product.product_id.includes(product_id) && product.size.toLowerCase() === sizeTerm)
                state.productDetails = newListProductDetail
            } else {
                state.productDetails = actions.payload.productDetails
            }
        },
    })
})
const productDetailFilterByOutfitSecondSlice = createSlice({
    name: "productDetails",
    initialState: initialGetOneIdProductDetailState,
    reducers: ({
        listProductDetailFilterByOutfitSecond: (state: IProductDetailState, actions: PayloadAction<IProductDetail[]>) => {
            state.productDetails = actions.payload
        },
        listProductDetailFilterByOutfitSecondSlice: (state: IGetOneIdProductDetailState, actions: PayloadAction<IGetOneIdProductDetailState>) => {
            const product_id = actions.payload.product_id.trim()
            const nameColor = actions.payload.nameColor.trim().toLowerCase()
            const sizeTerm = actions.payload.sizeTerm.trim().toLowerCase()
            if (nameColor) {
                const newListProductDetail = actions.payload.productDetails.filter((product) => product && product.nameColor.toLowerCase() === nameColor && product.product_id.includes(product_id) && product.size.toLowerCase() === sizeTerm)
                state.productDetails = newListProductDetail
            } else {
                state.productDetails = actions.payload.productDetails
            }
        },
    })
})

const productDetailByOutfitSizeSlice = createSlice({
    name: "productDetails",
    initialState: initalStateProductDetailFilter,
    reducers: ({
        listProductDetailByOutfitSizeFilter: (state: IProductDetailState, actions: PayloadAction<IProductDetail[]>) => {
            state.productDetails = actions.payload
        },
        listProductDetailByOutfitSizeSlice: (state: IProductDetailFilterState, actions: PayloadAction<IProductDetailFilterState>) => {
            const _id = actions.payload._id.trim()
            const nameColor = actions?.payload?.nameTerm.trim().toLowerCase()
            if (nameColor) {
                const newListProductDetail = actions?.payload?.productDetails.filter((product) => product && product.nameColor.toLowerCase().trim() === nameColor && product.product_id.includes(_id))
                state.productDetails = newListProductDetail

            }
        },
    })
})
const productDetailByOutfitSizeSecondSlice = createSlice({
    name: "productDetails",
    initialState: initalStateProductDetailFilter,
    reducers: ({
        listProductDetailByOutfitSizeSecondFilter: (state: IProductDetailState, actions: PayloadAction<IProductDetail[]>) => {
            state.productDetails = actions.payload
        },
        listProductDetailByOutfitSizeSecondSlice: (state: IProductDetailFilterState, actions: PayloadAction<IProductDetailFilterState>) => {
            const _id = actions.payload._id.trim()
            const nameColor = actions?.payload?.nameTerm.trim().toLowerCase()
            if (nameColor) {
                const newListProductDetail = actions?.payload?.productDetails.filter((product) => product && product.nameColor.toLowerCase().trim() === nameColor && product.product_id.includes(_id))
                state.productDetails = newListProductDetail

            }
        },
    })
})


export const { listProductDetailFilter, listProductDetailFilterSlice } = productDetailFilterSlice.actions
export const { listProductDetailSlice } = productDetailSlice.actions
export const { listProductDetailRelatedSlice } = productDetailRelatedSlice.actions
export const { listProductDetailIdFilter, getOneIdProductDetailSlice } = productDetailIdSlice.actions

export const { listProductDetailFilterByOutfit, listProductDetailFilterByOutfitSlice } = productDetailFilterByOutfitSlice.actions
export const { listProductDetailFilterByOutfitSecond, listProductDetailFilterByOutfitSecondSlice } = productDetailFilterByOutfitSecondSlice.actions


export const { listProductDetailByOutfitSizeFilter, listProductDetailByOutfitSizeSlice } = productDetailByOutfitSizeSlice.actions
export const { listProductDetailByOutfitSizeSecondFilter, listProductDetailByOutfitSizeSecondSlice } = productDetailByOutfitSizeSecondSlice.actions
export const productDetailFilterSliceReducer = productDetailFilterSlice.reducer
export const productDetailIdReducer = productDetailIdSlice.reducer
export const productDetailRelatedReducer = productDetailRelatedSlice.reducer

export const productDetailFilterByOutfitSliceReducer = productDetailFilterByOutfitSlice.reducer
export const productDetailFilterByOutfitSecondReducer = productDetailFilterByOutfitSecondSlice.reducer

export const productDetailByOutfitSizeReducer = productDetailByOutfitSizeSlice.reducer
export const productDetailByOutfitSizeSecondReducer = productDetailByOutfitSizeSecondSlice.reducer
export default productDetailSlice.reducer

