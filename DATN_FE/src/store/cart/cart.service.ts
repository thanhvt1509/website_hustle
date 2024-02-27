import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { ICart } from "./cart.interface"

const cartAPI = createApi({
    reducerPath: "carts",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8080/api"
    }),
    tagTypes: ["cart"],
    endpoints: (builer) => ({
        listCart: builer.query<ICart[], void>({
            query: () => `/carts`,
            providesTags: ["cart"]
        }),
        addCart: builer.mutation<ICart[], ICart>({
            query: (cart) => ({
                url: "/carts/add",
                method: "POST",
                body: cart
            }),
            invalidatesTags: ["cart"]
        }),
        getOneCart: builer.query({
            query: (id) => `/carts/` + id,
            providesTags: ["cart"]
        }),
        deleteCart: builer.mutation({
            query: (id) => ({
                method: "DELETE",
                url: `/carts/${id}`
            }),
            invalidatesTags: ["cart"]
        }),
        updateCart: builer.mutation({
            query: ({ _id, ...cart }) => ({
                method: "PATCH",
                url: `/carts/${_id}`,
                body: cart
            }),
            invalidatesTags: ["cart"]
        }),
    })
})

export const { useAddCartMutation, useListCartQuery, useGetOneCartQuery, useDeleteCartMutation, useUpdateCartMutation } = cartAPI
export default cartAPI