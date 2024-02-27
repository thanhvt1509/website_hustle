import { IProductDetail } from "../productDetail/productDetail.interface";

export interface ICart {
    _id?: string
    userId?: string
    productDetailId: IProductDetail
    quantity: number
    totalMoney: number
}
export interface ICartLocal {
    _id?: string
    productDetailId: IProductDetail
    quantity: number
    totalMoney: number
}

export interface ICartState {
    carts: ICart[]
}
export interface ICartLocalState {
    cartLocals: ICartLocal[]
}
