import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IOrder, IOrderSearchState, IOrderState } from "./order.interface"
export const initialOrderState: IOrderState = {
    orders: []
}
export const initialOrderSearchState: IOrderSearchState = {
    searchTerm: "",
    orders: []
}
const orderSlice = createSlice({
    name: "orders",
    initialState: initialOrderSearchState,
    reducers: ({
        listOrderSlice: (state: IOrderState, actions: PayloadAction<IOrder[]>) => {
            state.orders = actions.payload
        },
        listOrderSearchSlice: (state: IOrderSearchState, actions: PayloadAction<IOrderSearchState>) => {
            const nameTerm = actions?.payload?.searchTerm?.trim().toLowerCase()
            if (nameTerm) {
                const listOrderFilter = actions.payload?.orders?.filter(
                    (order) => { return order.fullName && order.fullName.trim().toLowerCase().includes(nameTerm) }
                );
                state.orders = listOrderFilter
            }
        },
    })
})



export const { listOrderSlice, listOrderSearchSlice } = orderSlice.actions
export default orderSlice.reducer