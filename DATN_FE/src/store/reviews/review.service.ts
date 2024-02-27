import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { IReview } from "./review.interface"
import { RootState } from ".."
const ReviewApi = createApi({
    reducerPath: "reviews",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:8080/api/auth",
        prepareHeaders(headers, { getState }) {
            const token = (getState() as RootState).user.token
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }
            return headers
        },
    }),
    tagTypes: ["reviews"],
    endpoints: (builer) => ({
        fetchListReviews: builer.query<IReview[], void>({
            query: () => `/reviews`,
            providesTags: ["reviews"]
        }),
        fetchOneReview: builer.query({
            query: (id) => `/review/` + id,
            providesTags: ["reviews"]
        }),
        removeReview: builer.mutation<IReview, string>({
            query: (id) => ({
                url: "/review/" + id,
                method: "DELETE"
            }),
            invalidatesTags: ["reviews"]
        }),
        addReview: builer.mutation<IReview[], IReview>({
            query: (review) => ({
                url: "/review",
                method: "POST",
                body: review
            }),
            invalidatesTags: ["reviews"]
        }),
        updateReview: builer.mutation({
            query: ({ id, ...review }) => ({
                url: `/review/${id}`,
                method: "PATCH",
                body: review
            }),
            invalidatesTags: ["reviews"]
        }),
        replyComment: builer.mutation({
            query: ({ id, ...reply }) => ({
                url: `/review/${id}/reply`,
                method: "PATCH",
                body: reply
            }),
            invalidatesTags: ["reviews"]
        }),
    })
})

export const { useFetchListReviewsQuery, useFetchOneReviewQuery, useRemoveReviewMutation, useUpdateReviewMutation, useAddReviewMutation, useReplyCommentMutation } = ReviewApi
export default ReviewApi