import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IReview, IReviewByRateState, IReviewByUserState, IReviewState } from "./review.interface"

export const initalReviewState: IReviewState = {
    reviews: []
}
export const initalReviewByRateState: IReviewByRateState = {
    rating: 0,
    reviews: []
}
export const initalReviewByUserState: IReviewByUserState = {
    userId: "",
    reviews: []
}

const reviewSlice = createSlice({
    name: "reviews",
    initialState: initalReviewState,
    reducers: ({
        listReviewSlice: (state: IReviewState, actions: PayloadAction<IReview[]>) => {
            state.reviews = actions.payload
        },
        listReviewByRate: (state: IReviewState, actions: PayloadAction<number>) => {
            const reviewByRate = state.reviews.filter((rate) => rate.rating === actions.payload)
            console.log(reviewByRate)
            // if(reviewByRate){
            //     state.reviews = reviewByRate
            // }
        },
        deleteReviewSlice: (state: IReviewState, actions: PayloadAction<string>) => {
            state.reviews = state.reviews.filter((review) => review._id !== actions.payload)
        }
    })
})
const reviewByRate = createSlice({
    name: "reviews",
    initialState: initalReviewByRateState,
    reducers: ({
        listReviewByRateSlice: (state: IReviewByRateState, actions: PayloadAction<IReview[]>) => {
            state.reviews = actions.payload
        },
        listReviewByRateFilterSlice: (state: IReviewByRateState, actions: PayloadAction<IReviewByRateState>) => {
            const rating = Number(actions.payload.rating)
            if (rating === 0) {
                state.reviews = actions.payload.reviews
                return
            }
            const reviewByRateFilter = actions.payload.reviews.filter((rate) => rate.rating && rate.rating === rating)
            state.reviews = reviewByRateFilter
        },
        listReviewByUserFilterSlice: (state: IReviewByRateState, actions: PayloadAction<IReviewByUserState>) => {
            const userId = String(actions.payload.userId)
            const reviewByUserFilter = actions.payload.reviews.filter((user) => user.userId._id && user.userId._id.includes(userId))
            console.log(reviewByUserFilter)
            state.reviews = reviewByUserFilter
        },
    })
})
const reviewByUserId = createSlice({
    name: "reviews",
    initialState: initalReviewByUserState,
    reducers: ({
        listReviewByUserSlice: (state: IReviewByUserState, actions: PayloadAction<IReview[]>) => {
            state.reviews = actions.payload
        },
        listReviewByUserFilterSlice: (state: IReviewByUserState, actions: PayloadAction<IReviewByUserState>) => {
            const userId = String(actions.payload.reviews)
            const reviewByUserFilter = actions.payload.reviews.filter((user) => user.userId._id && user.userId._id.includes(userId))
            state.reviews = reviewByUserFilter
        },
    })
})

export const { listReviewSlice, listReviewByRate, deleteReviewSlice } = reviewSlice.actions
export const { listReviewByRateSlice, listReviewByRateFilterSlice, listReviewByUserFilterSlice } = reviewByRate.actions
// export const { listReviewByUserSlice, listReviewByUserFilterSlice } = reviewByUserId.actions
export default reviewSlice.reducer
export const reviewByRatingReducer = reviewByRate.reducer
export const reviewByUserReducer = reviewByUserId.reducer

