import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { ICategory } from "./category.interface"
const categoryApi = createApi({
    reducerPath: "categories",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8080/api"
    }),
    tagTypes: ["categories"],
    endpoints: (builer) => ({
        fetchListCategory: builer.query<ICategory[], void>({
            query: () => `/categories`,
            providesTags: ["categories"]
        }),
        fetchOneCategory: builer.query({
            query: (id) => `/categories/` + id,
            providesTags: ["categories"]
        }),
        removeCategory: builer.mutation<ICategory, string>({
            query: (id) => ({
                url: "/categories/" + id,
                method: "DELETE"
            }),
            invalidatesTags: ["categories"]
        }),
        addCategory: builer.mutation<ICategory[], ICategory>({
            query: (category) => ({
                url: "/categories/add",
                method: "POST",
                body: category
            }),
            invalidatesTags: ["categories"]
        }),
        updateCategory: builer.mutation({
            query: ({ id, ...category }) => ({
                url: `/categories/${id}/edit`,
                method: "PATCH",
                body: category
            }),
            invalidatesTags: ["categories"]
        }),
    })
})

export const { useFetchListCategoryQuery, useFetchOneCategoryQuery, useRemoveCategoryMutation, useAddCategoryMutation, useUpdateCategoryMutation } = categoryApi
export default categoryApi