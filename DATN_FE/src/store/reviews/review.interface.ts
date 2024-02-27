import IProduct from "../product/product.interface"

export interface IReview {
    _id: string
    productId: string
    userId: {
        _id: string
        fullname: string
    }
    fullName: string
    color: string
    size: string
    rating: number
    comment: string
    images: Types[]
    createdAt: string
    reply: any
}


export interface Types {
    url: string
}
export interface IReviewState {
    reviews: IReview[]
}
export interface IReviewDashboard {
    _id: string;
    productId: IProduct;
    userId: {
        _id: string
        fullname: string
    }
    color: string
    size: string
    rating: number
    comment: string
    images: Types[]
    createdAt: string
    reply: any
}
export interface IReviewByRateState {
    rating: number | null
    reviews: IReview[]
}
export interface IReviewByUserState {
    userId: string
    reviews: IReview[]
}