import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IOutfit, IOutfitState, ISearchOutfitState } from "./outfit.interface";

export const initialOutfitState: IOutfitState = {
    outfits: []
}
export const initialSearchOutfitState: ISearchOutfitState = {
    searchTerm: "",
    outfits: []
}
const outfitSlice = createSlice({
    name: "outfits",
    initialState: initialOutfitState,
    reducers: ({
        listOutfitSlice: (state: IOutfitState, actions: PayloadAction<IOutfit[]>) => {
            state.outfits = actions.payload
        },
        deleteOutfitSlice: (state: IOutfitState, actions: PayloadAction<string>) => {
            state.outfits = state.outfits.filter((outfit) => outfit._id !== actions.payload)
        },
    })
})

const searchOutfitSlice = createSlice({
    name: "outfits",
    initialState: initialSearchOutfitState,
    reducers: ({
        listSearchOutfit: (state: IOutfitState, actions: PayloadAction<IOutfit[]>) => {
            state.outfits = actions.payload
        },
        listSearchOutfitByTitleSlice: (state: ISearchOutfitState, actions: PayloadAction<ISearchOutfitState>) => {
            const title = actions.payload.searchTerm.trim().toLowerCase()
            if (title) {
                const listProductByTitle = actions.payload.outfits.filter((outfit) => outfit.title && outfit.title.trim().toLowerCase().includes(title))
                state.outfits = listProductByTitle
            }
        },
        listSearchOutfitBySkuSlice: (state: ISearchOutfitState, actions: PayloadAction<ISearchOutfitState>) => {
            const sku = actions.payload.searchTerm.trim().toLowerCase()
            if (sku) {
                const listProductBySku = actions.payload.outfits.filter((outfit) => outfit.sku && outfit.sku.trim().toLowerCase().includes(sku))
                state.outfits = listProductBySku
            }
        },
        listSearchOutfitByProductIdSlice: (state: ISearchOutfitState, actions: PayloadAction<ISearchOutfitState>) => {
            const productId = actions.payload.searchTerm.trim().toLowerCase();
            const outfitsContainingProductId = actions.payload.outfits.filter((outfit) =>
                outfit.items.some((item) => item.product_id === productId)
            );
            state.outfits = outfitsContainingProductId
        },
    })
})

export const { listOutfitSlice, deleteOutfitSlice } = outfitSlice.actions
export const { listSearchOutfit, listSearchOutfitByTitleSlice, listSearchOutfitBySkuSlice, listSearchOutfitByProductIdSlice } = searchOutfitSlice.actions
export default outfitSlice.reducer
export const searchOutfitReducer = searchOutfitSlice.reducer