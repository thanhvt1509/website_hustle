import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { IProductDetail } from "./productDetail.interface"

const productDetailAPI = createApi({
    reducerPath: "productDetails",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8080/api"
    }),
    tagTypes: ["productDetail"],
    endpoints: (builer) => ({
        listProductDetail: builer.query<IProductDetail[], void>({
            query: () => `/productDetails`,
            providesTags: ["productDetail"]
        }),
        getOneProductDetail: builer.query<IProductDetail, string>({
            query: (id) => `/productDetails/` + id,
            providesTags: ["productDetail"]
        }),
        updateProductDetail: builer.mutation({
            query: ({ id, ...product }) => ({
                url: `/productDetails/` + id,
                method: "PATCH",
                body: product
            }),
            invalidatesTags: ["productDetail"]
        }),
    })
})

export const { useListProductDetailQuery, useGetOneProductDetailQuery, useUpdateProductDetailMutation } = productDetailAPI
export default productDetailAPI
