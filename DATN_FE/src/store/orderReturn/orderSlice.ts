import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IOrderReturn, IOrderReturnState } from "./order.interface"
export const initialOrderState: IOrderReturnState = {
    orderReturns: []
}
const orderReturnSlice = createSlice({
    name: "orderReturns",
    initialState: initialOrderState,
    reducers: ({
        listOrderSlice: (state: IOrderReturnState, actions: PayloadAction<IOrderReturn[]>) => {
            state.orderReturns = actions.payload
        },
    })
})



export const { listOrderSlice } = orderReturnSlice.actions
export default orderReturnSlice.reducer