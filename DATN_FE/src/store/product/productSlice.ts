import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import IProduct, { IProductFilterState, IProductSearchState, IProductState } from "./product.interface"
import { IProductDetail } from "../productDetail/productDetail.interface"

export const initialStateProduct: IProductState = {
    products: []
}

export const initialProductFilter: IProductFilterState = {
    nameTerm: "",
    products: []
}

const productSlice = createSlice({
    name: "products",
    initialState: initialStateProduct,
    reducers: ({
        listProductSlice: (state: IProductState, actions: PayloadAction<IProduct[]>) => {
            state.products = actions.payload.filter((product) => product.hide === false)
        },
        deleteProductSlice: (state: IProductState, actions: PayloadAction<string>) => {
            state.products = state.products.filter((product) => product._id !== actions.payload)
        },
        // listProductSaleSlice: (state: IProductState, actions: PayloadAction<IProduct[]>) => {
        //     const productSales = actions.payload.filter((product) => product.discount < product.price)
        //     state.products = productSales
        // },
        // listProductOutStandSlice: (state: IProductState, actions: PayloadAction<IProduct[]>) => {
        // const productOutstand = actions.payload.filter((product) => product && product.variants)
        // state.products = productOutstand
        // }
    })
})

const productFilterSlice = createSlice({
    name: "products",
    initialState: initialProductFilter,
    reducers: ({
        listProductFilterSlice: (state: IProductFilterState, actions: PayloadAction<IProduct[]>) => {
            state.products = actions.payload.filter((product) => product.hide === false)
        },

        listProductCategorySlice: (state: IProductFilterState, actions: PayloadAction<IProductFilterState>) => {
            const nameTerm = actions.payload.nameTerm.trim()
            const listProductFilter = actions.payload?.products?.filter((product) => product.hide === false && product.categoryId?._id && product.categoryId._id.includes(nameTerm))
            state.products = listProductFilter
        },
    })
})
const productSaleSlice = createSlice({
    name: "products",
    initialState: initialStateProduct,
    reducers: ({
        listProductSale: (state: IProductState, actions: PayloadAction<IProduct[]>) => {
            state.products = actions.payload.filter((product) => product.hide === false)
        },
        listProductSaleSlice: (state: IProductState, actions: PayloadAction<IProduct[]>) => {
            const productSales = actions.payload.filter((product) => product.discount > 0 && product.hide === false)
            state.products = productSales
        },
    })
})
const productSearchSlice = createSlice({
    name: "products",
    initialState: initialProductFilter,
    reducers: ({
        listProductSearch: (state: IProductFilterState, actions: PayloadAction<IProduct[]>) => {
            state.products = actions.payload
        },
        listProductSearchSlice: (state: IProductFilterState, actions: PayloadAction<IProductSearchState>) => {
            const nameTerm = actions?.payload?.searchTerm?.trim().toLowerCase()
            if (nameTerm) {
                const listProductFilter = actions.payload?.products?.filter(
                    (product) => { return product.title && product.title.trim().toLowerCase().includes(nameTerm) }
                );
                state.products = listProductFilter
            }
        },
        listProductSearchBySkuSlice: (state: IProductFilterState, actions: PayloadAction<IProductSearchState>) => {
            const nameTerm = actions?.payload?.searchTerm?.trim().toLowerCase()
            if (nameTerm) {
                const listProductFilter = actions.payload?.products?.filter(
                    (product) => { return product.sku && product.sku.trim().toLowerCase().includes(nameTerm) }
                );
                state.products = listProductFilter
            }
        },
        deleteProductSearchSlice: (state: IProductState, actions: PayloadAction<string>) => {
            state.products = state.products.filter((product) => product._id !== actions.payload)
        },
    })
})
const productOutstandSlice = createSlice({
    name: "products",
    initialState: initialStateProduct,
    reducers: ({
        listProductOutStand: (state: IProductState, actions: PayloadAction<IProduct[]>) => {
            state.products = actions.payload.filter((product) => product.hide === false)
        },
        listProductOutStandSlice: (state: IProductState, actions: PayloadAction<IProduct>) => {
            // state.products = state.products.map((product) => product.s)
        },
    })
})
const productRelatedSlice = createSlice({
    name: "products",
    initialState: initialStateProduct,
    reducers: ({
        listProductRelated: (state: IProductState, actions: PayloadAction<IProduct[]>) => {
            state.products = actions.payload.filter((product) => product.hide === false)
        },
        listProductRelatedSlice: (state: IProductState, actions: PayloadAction<IProduct[]>) => {
            const productOutStand = actions.payload.filter((product) => product && product.variants && product.hide === false)
            state.products = productOutStand
        },
    })
})
const productViewedSlice = createSlice({
    name: "products",
    initialState: initialStateProduct,
    reducers: ({
        listProductViewed: (state: IProductState, actions: PayloadAction<IProduct[]>) => {
            state.products = actions.payload
        },
        addProductViewed: (state: IProductState, actions: PayloadAction<IProduct>) => {
            const productExist = state.products.some((product) => product._id === actions.payload._id);
            const productViewedLocal: IProduct[] = JSON.parse(sessionStorage.getItem("productViewed") || "[]");
            const productViewedLocalExist = productViewedLocal.some((product) => product._id === actions.payload._id);

            if (!productExist) {
                state.products.push(actions.payload);
                productViewedLocal.push(actions.payload);

                if (!productViewedLocalExist) {
                    sessionStorage.setItem("productViewed", JSON.stringify(productViewedLocal));
                }
            }
        },
        // listProductRelatedSlice: (state: IProductState, actions: PayloadAction<IProduct[]>) => {
        //     const productOutStand = actions.payload.filter((product) => product && product.variants)
        //     state.products = productOutStand
        // },
    })
})

// product
export const { listProductSlice, deleteProductSlice } = productSlice.actions
// productbyCategory
export const { listProductFilterSlice, listProductCategorySlice } = productFilterSlice.actions
// productBySale
export const { listProductSale, listProductSaleSlice } = productSaleSlice.actions
// productSearch By name
export const { listProductSearch, listProductSearchSlice, deleteProductSearchSlice, listProductSearchBySkuSlice } = productSearchSlice.actions
// productOutStand
export const { listProductOutStand, listProductOutStandSlice } = productOutstandSlice.actions
// productRelated
export const { listProductRelated, listProductRelatedSlice } = productRelatedSlice.actions
// productViewed
export const { listProductViewed, addProductViewed } = productViewedSlice.actions
// reducer
export const productSliceReducer = productSlice.reducer
export const productFilterSliceReducer = productFilterSlice.reducer
export const productSaleSliceReducer = productSaleSlice.reducer
export const productSearchReducer = productSearchSlice.reducer
export const productOutstandReducer = productOutstandSlice.reducer
export const productRelatedSliceReducer = productRelatedSlice.reducer
export const productViewedSliceReducer = productViewedSlice.reducer

