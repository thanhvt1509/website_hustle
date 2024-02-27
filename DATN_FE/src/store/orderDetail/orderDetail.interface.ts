export interface IOrderDetail {
    _id: string
    orderId: string
    productDetailId: string
    price: number
    quantity: number
    color: string
    size: string
    totalMoney: number
    isReviewed: boolean
}

export interface IOrderDetailState {
    orderDetails: IOrderDetail[]
}