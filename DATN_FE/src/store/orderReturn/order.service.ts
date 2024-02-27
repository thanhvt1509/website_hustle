import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { IOrderReturn } from "./order.interface"
import { orderReturnForm } from "../../Schemas/OrderReturn"

const orderReturnAPI = createApi({
    reducerPath: "orderReturns",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8080/api"
    }),
    tagTypes: ["orderReturn"],
    endpoints: (builer) => ({
        listOrderReturn: builer.query<IOrderReturn[], void>({
            query: () => `/orderReturns`,
            providesTags: ["orderReturn"]
        }),
        addOrderReturn: builer.mutation<orderReturnForm[], orderReturnForm>({
            query: (orderReturn) => ({
                url: "/orderReturns/add",
                method: "POST",
                body: orderReturn
            }),
            invalidatesTags: ["orderReturn"]
        }),
        getOneOrderReturn: builer.query<IOrderReturn, string>({
            query: (id) => `/orderReturns/` + id,
            providesTags: ["orderReturn"]
        }),
        updateOrderReturn: builer.mutation({
            query: ({ id, ...orderReturn }) => ({
                url: `/orderReturns/${id}`,
                method: "PATCH",
                body: orderReturn
            }),
            invalidatesTags: ["orderReturn"]
        }),
    })
})

export const { useListOrderReturnQuery, useAddOrderReturnMutation, useGetOneOrderReturnQuery, useUpdateOrderReturnMutation } = orderReturnAPI
export default orderReturnAPI