import { IOrderDetail } from "../orderDetail/orderDetail.interface"

export interface IOrder {
    _id: string
    fullName: string
    email: string
    phoneNumber: string
    address: {
        myProvince: string,
        myDistrict: string,
        myWard: string,
        detailAddress: string
    }
    voucher_code: string
    note: string
    status: number
    paymentStatus: number
    pay_method: string
    totalMoney: number
    orderDetails: IOrderDetail[]
    createdAt: any
    orderReturn: any

}

export interface IOrderState {
    orders: IOrder[]
}

export interface IOrderSearchState {
    searchTerm: string
    orders: IOrder[]
}
