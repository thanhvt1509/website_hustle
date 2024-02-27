export interface IVoucher {
    _id?: string
    title: string
    type: string
    code: string
    quantity: number
    discount: number
    used: number
    minOrderValue: number
    maxOrderValue: number
    validFrom: number
    validTo: number
    description: string
    createdAt: Date;
    status: boolean;
}

export interface IVoucherState {
    vouchers: IVoucher[]
}
export interface IVoucherSearchState {
    searchTerm: string
    vouchers: IVoucher[]
}