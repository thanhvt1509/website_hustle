import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { RootState } from "..";

interface IInfoUser {
    _id: string,
    fullname: string,
    address: string[],
    email: string,
    voucherwallet: string[]
    createtdAt: string
    phoneNumber: number
}

interface IAuth {
    _id: string;
    fullname: string;
    email: string
}

interface IPassword {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string
}

interface IAddress {
    _id?: string,
    address: string,
    fullname: string,
    phone: string
}

const authApi = createApi({
    reducerPath: "auths",
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
    tagTypes: ["auth"],
    endpoints: (builer) => ({
        getInfoUser: builer.query<IInfoUser, string>({
            query: (id) => `/auth/user/` + id,
            providesTags: ["auth"]
        }),

        updateAccount: builer.mutation<IAuth[], IAuth>({
            query: ({ _id, ...auth }) => ({
                url: `/auth/user/${_id}/update`,
                method: "PATCH",
                body: auth
            }),
            invalidatesTags: ["auth"]
        }),

        changePassword: builer.mutation<IPassword[], IPassword>({
            query: (auth) => ({
                url: "/auth/user/change/password",
                method: "POST",
                body: auth
            }),
            invalidatesTags: ["auth"]
        }),

        addAddress: builer.mutation<IAddress[], IAddress>({
            query: (address) => ({
                url: "/auth/user-address/add",
                method: "POST",
                body: address
            }),
            invalidatesTags: ["auth"]
        }),

        deleteAddress: builer.mutation({
            query: (id) => ({
                method: "DELETE",
                url: `/auth/user-address/${id}`,
            }),
            invalidatesTags: ["auth"]
        }),

        updateAddress: builer.mutation<IAddress[], IAddress>({
            query: ({ _id, ...address }) => ({
                method: "PATCH",
                url: `/auth/user-address/${_id}/edit`,
                body: address
            }),
            invalidatesTags: ["auth"]
        }),
    })
})

export const { useChangePasswordMutation, useUpdateAccountMutation, useAddAddressMutation, useGetInfoUserQuery, useDeleteAddressMutation, useUpdateAddressMutation } = authApi
export default authApi