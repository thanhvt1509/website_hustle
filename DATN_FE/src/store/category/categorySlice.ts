import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { ICategory, ICategorySearchState, ICategoryState } from "./category.interface"

export const initialStateCategory: ICategoryState = {
    categories: []
}
export const initialStateCategorySearch: ICategorySearchState = {
    searchTerm: "",
    categories: []
}

const categorySlice = createSlice({
    name: "categories",
    initialState: initialStateCategorySearch,
    reducers: ({
        listCategorySlice: (state: ICategoryState, actions: PayloadAction<ICategory[]>) => {
            state.categories = actions.payload.filter((cate) => cate.name !== "Chưa phân loại")
        },
        listCategorySearchSlice: (state: ICategorySearchState, actions: PayloadAction<ICategorySearchState>) => {
            const nameTerm = actions?.payload?.searchTerm?.trim().toLowerCase()
            if (nameTerm) {
                const listVoucherFilter = actions.payload?.categories?.filter(
                    (voucher) => { return voucher.name && voucher.name.trim().toLowerCase().includes(nameTerm) }
                );
                state.categories = listVoucherFilter
            }
        },
        deleteCategorySlice: (state: ICategoryState, actions: PayloadAction<string>) => {
            state.categories = state.categories.filter((cate) => cate._id !== actions.payload)
        }
    })
})

export const { listCategorySlice, deleteCategorySlice, listCategorySearchSlice } = categorySlice.actions
export default categorySlice.reducer

