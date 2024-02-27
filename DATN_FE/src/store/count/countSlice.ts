// import { createSlice } from "@reduxjs/toolkit"
// export interface ICount {
//     number: Number
// }

// export interface ICountState {
//     number: Number
// }

// const productSlice = createSlice({
//     name: "products",
//     initialState: ICountState,
//     reducers: ({
//         listProductSlice: (state: IProductState, actions: PayloadAction<IProduct[]>) => {
//             state.products = actions.payload
//         },
//         deleteProductSlice: (state: IProductState, actions: PayloadAction<string>) => {
//             state.products = state.products.filter((product) => product._id !== actions.payload)
//         },
//         // listProductSaleSlice: (state: IProductState, actions: PayloadAction<IProduct[]>) => {
//         //     const productSales = actions.payload.filter((product) => product.discount < product.price)
//         //     state.products = productSales
//         // },
//         // listProductOutStandSlice: (state: IProductState, actions: PayloadAction<IProduct[]>) => {
//         // const productOutstand = actions.payload.filter((product) => product && product.variants)
//         // state.products = productOutstand
//         // }
//     })
// })