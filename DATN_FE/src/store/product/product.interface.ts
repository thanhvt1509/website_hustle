import { ICategory } from "../category/category.interface";

export interface IProduct {
    _id?: string;
    title: string;
    sku: string;
    price: number;
    discount: number;
    costPrice: number;
    description: string;
    images: any[];
    colors: any[];
    sizes: any[];
    thumnail: string;
    quantity: number;
    variants: IVariants[];
    categoryId?: ICategory;
    createdAt: Date;
    updatedAt: Date;
    hide: boolean;
    deleted: boolean;
}


interface IVariants {
    imageColor: string
    nameColor: string
    items: Items[]
    sold: number
}

interface Items {
    size: string
    quantity: number
}

interface Images {
    url: string
}

export interface IProductState {
    products: IProduct[]
}

export interface IProductFilterState {
    nameTerm: string
    products: IProduct[]
}

export interface IProductSearchState {
    searchTerm: string
    products: IProduct[]
}



export default IProduct;