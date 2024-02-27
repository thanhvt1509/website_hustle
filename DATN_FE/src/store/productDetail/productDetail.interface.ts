export interface IProductDetail {
    _id?: string
    product_id: string
    nameColor: string
    size: string
    sold: number
    imageColor: string
    quantity: number
    createdAt: string
}
export interface IProductDetailState {
    productDetails: IProductDetail[]
}

export interface IProductDetailFilterState {
    _id: string,
    nameTerm: string
    productDetails: IProductDetail[]
}

export interface IGetOneIdProductDetailState {
    product_id: string,
    nameColor: string
    sizeTerm: string
    productDetails: IProductDetail[]
}