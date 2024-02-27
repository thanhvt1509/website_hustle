import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IOutfit } from "./outfit.interface";

const outfitAPI = createApi({
    reducerPath: "outfits",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8080/api"
    }),
    tagTypes: ["outfit"],
    endpoints: (builer) => ({
        fetchListOutfit: builer.query<IOutfit[], void>({
            query: () => `/outfit`,
            providesTags: ["outfit"]
        }),
        fetchOneOutfit: builer.query<IOutfit, string>({
            query: (id) => ({
                url: "/outfit/" + id,
                method: "GET"
            }),
            providesTags: ["outfit"]
        }),
        removeOutfit: builer.mutation<IOutfit, string>({
            query: (id) => ({
                url: "/outfit/" + id,
                method: "DELETE"
            }),
            invalidatesTags: ["outfit"]
        }),
        updateOutfit: builer.mutation<IOutfit[], IOutfit>({
            query: ({ _id, ...outfit }) => ({
                url: `/outfit/${_id}/edit`,
                method: "PATCH",
                body: outfit
            }),
            invalidatesTags: ["outfit"]
        }),
        addOutfit: builer.mutation<IOutfit[], IOutfit>({
            query: (outfit) => ({
                url: "/outfit/add",
                method: "POST",
                body: outfit
            }),
            invalidatesTags: ["outfit"]
        }),
    })
})

export const { useFetchListOutfitQuery, useFetchOneOutfitQuery, useAddOutfitMutation, useUpdateOutfitMutation, useRemoveOutfitMutation } = outfitAPI
export default outfitAPI