import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { IVoucher } from "./voucher.interface"

const voucherAPI = createApi({
    reducerPath: "vouchers",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8080/api"
    }),
    tagTypes: ["voucher"],
    endpoints: (builer) => ({
        listVoucher: builer.query<IVoucher[], void>({
            query: () => `/vouchers`,
            providesTags: ["voucher"]
        }),
        addVoucher: builer.mutation<IVoucher[], IVoucher>({
            query: (voucher) => ({
                url: "/vouchers/add",
                method: "POST",
                body: voucher
            }),
            invalidatesTags: ["voucher"]
        }),
        getOneVoucher: builer.query<IVoucher, string>({
            query: (id) => `/vouchers/` + id,
            providesTags: ["voucher"]
        }),
        deleteVoucher: builer.mutation({
            query: (id) => ({
                method: "DELETE",
                url: `/vouchers/${id}`
            }),
            invalidatesTags: ["voucher"]
        }),
        deleteCategoryVoucher: builer.mutation({
            query: (id) => ({
                method: "DELETE",
                url: `/delete-categories/${id}`
            }),
            invalidatesTags: ["voucher"]
        }),
        updateVoucher: builer.mutation<IVoucher[], IVoucher>({
            query: ({ _id, ...voucher }) => ({
                method: "PATCH",
                url: `/vouchers/${_id}/edit`,
                body: voucher
            }),
            invalidatesTags: ["voucher"]
        }),
    })
})

export const { useListVoucherQuery, useAddVoucherMutation, useGetOneVoucherQuery, useDeleteVoucherMutation, useUpdateVoucherMutation } = voucherAPI
export default voucherAPI