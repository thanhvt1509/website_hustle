import IProduct from "../product/product.interface"

export interface ICategory {
    _id: string
    products: IProduct[]
    images: Url
    name: string
    createdAt: string
}

export interface Url {
    url: string
    publicId: string
}

export interface ICategoryState {
    categories: ICategory[]
}
export interface ICategorySearchState {
    searchTerm: string
    categories: ICategory[]
}
