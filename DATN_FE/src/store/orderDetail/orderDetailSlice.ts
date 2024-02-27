import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IOrderDetail, IOrderDetailState } from "./orderDetail.interface"
import { IOrder } from "../order/order.interface"
export const initialOrderDetailState: IOrderDetailState = {
    orderDetails: []
}
const orderDetailSlice = createSlice({
    name: "orderDetails",
    initialState: initialOrderDetailState,
    reducers: ({
        listOrderDetailSlice: (state: IOrderDetailState, actions: PayloadAction<IOrderDetail[]>) => {
            state.orderDetails = actions.payload
        },
    })
})



export const { listOrderDetailSlice } = orderDetailSlice.actions
export default orderDetailSlice.reducer