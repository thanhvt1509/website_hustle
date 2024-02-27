import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import IProduct from "./product.interface"
import { RootState } from '../index';
const productAPI = createApi({
    reducerPath: "products",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8080/api",
        prepareHeaders(headers, { getState }) {
            const token = (getState() as RootState).user.token
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }
            return headers
        },
    }),
    tagTypes: ["products"],
    endpoints: (builer) => ({
        fetchListProduct: builer.query<IProduct[], void>({
            query: () => `/products`,
            providesTags: ["products"]
        }),
        fetchOneProduct: builer.query<IProduct, string>({
            query: (id) => `/products/` + id,
            providesTags: ["products"]
        }),
        fetchListProductByAdmin: builer.query<IProduct[], void>({
            query: () => `/products/admin`,
            providesTags: ["products"]
        }),
        fetchOneProductByAdmin: builer.query({
            query: (id) => `/products/admin/` + id,
            providesTags: ["products"]
        }),
        removeProduct: builer.mutation({
            query: (id) => ({
                url: "/products/" + id,
                method: "DELETE"
            }),
            invalidatesTags: ["products"]
        }),
        addProduct: builer.mutation<IProduct[], IProduct>({
            query: (product) => ({
                url: "/products/add",
                method: "POST",
                body: product
            }),
            invalidatesTags: ["products"]
        }),
        updateProduct: builer.mutation({
            query: ({ id, ...product }) => ({
                url: "/products/" + id,
                method: "PATCH",
                body: product
            }),
            invalidatesTags: ["products"]
        }),
        searchProduct: builer.query<IProduct[], string>({
            query: (name) => ({
                url: "/products?_search=" + name,
                method: "get",
                invalidatesTags: ["products"]
            }),
        }),
    })
})

export const { useFetchListProductQuery, useFetchOneProductQuery, useRemoveProductMutation, useAddProductMutation, useUpdateProductMutation, useSearchProductQuery, useFetchListProductByAdminQuery, useFetchOneProductByAdminQuery } = productAPI
export default productAPI