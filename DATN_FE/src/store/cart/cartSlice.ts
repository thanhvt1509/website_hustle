import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { ICart, ICartLocal, ICartLocalState, ICartState } from "./cart.interface"
export const initialCartState: ICartState = {
    carts: []
}
export const initialCartLocalState: ICartLocalState = {
    cartLocals: []
}
const cartSlice = createSlice({
    name: "carts",
    initialState: initialCartState,
    reducers: ({
        listCartSlice: (state: ICartState, actions: PayloadAction<ICart[]>) => {
            const { current: userStore } = JSON.parse(localStorage.getItem("persist:user")!);
            if (userStore) {
                const listCartByUser = actions.payload.filter((cart) => cart.userId === JSON.parse(userStore)?._id)
                state.carts = listCartByUser
            } else {
                state.carts = actions.payload
            }
        },
        removeCartSlice: (state: ICartState, actions: PayloadAction<string>) => {
            state.carts = state.carts.filter((cart) => cart._id !== actions.payload)
            const cartStore: ICart[] = JSON.parse(localStorage.getItem("carts")!)
            if (cartStore) {
                const newCartStore = cartStore.filter((cart) => cart.productDetailId._id != actions.payload)
                localStorage.setItem("carts", JSON.stringify(newCartStore))
                state.carts = newCartStore
            }
        },
        addCartSlice: (state: ICartState, actions: PayloadAction<ICart>) => {
            const cartExistIndex = state.carts.findIndex((cart) => cart.productDetailId._id === actions.payload.productDetailId._id)
            const { current: userStore } = JSON.parse(localStorage.getItem("persist:user")!);
            if (userStore && JSON.parse(userStore)?._id) {
                if (cartExistIndex !== -1) {
                    state.carts[cartExistIndex].quantity += actions.payload.quantity
                } else {
                    state.carts = [
                        ...state.carts,
                        {
                            userId: actions?.payload?.userId,
                            productDetailId: actions.payload.productDetailId,
                            quantity: actions.payload.quantity,
                            totalMoney: actions.payload.totalMoney
                        }
                    ]
                }
            } else {
                if (cartExistIndex !== -1) {
                    state.carts[cartExistIndex].quantity += actions.payload.quantity
                    state.carts[cartExistIndex].totalMoney += actions.payload.totalMoney
                } else {
                    state.carts = [
                        ...state.carts,
                        {
                            productDetailId: actions.payload.productDetailId,
                            quantity: actions.payload.quantity,
                            totalMoney: actions.payload.totalMoney
                        }
                    ]
                }
                localStorage.setItem("carts", JSON.stringify(state.carts))
            }
        },
        increaseCartSlice: (state: ICartState, actions: PayloadAction<{ _id: string, discount: number }>) => {
            const cartIndex = state.carts.findIndex((state) => state._id === actions.payload._id)
            const { current } = JSON.parse(localStorage.getItem("persist:user")!)
            if (JSON.parse(current)?._id) {
                if (cartIndex !== -1) {
                    state.carts[cartIndex].quantity++;
                    state.carts[cartIndex].totalMoney += actions.payload.discount
                    localStorage.setItem("cartIndex", JSON.stringify(state.carts[cartIndex]));
                }
            } else {
                const cartStore: ICart[] = JSON.parse(localStorage.getItem("carts")!)
                if (cartStore) {
                    const cartStoreIndex = cartStore.findIndex((cart) => cart.productDetailId._id === actions.payload._id)
                    if (cartStoreIndex !== -1) {
                        const updatedCartStore = [...cartStore]
                        updatedCartStore[cartStoreIndex] = {
                            ...updatedCartStore[cartStoreIndex],
                            quantity: updatedCartStore[cartStoreIndex].quantity + 1,
                            totalMoney: updatedCartStore[cartStoreIndex].totalMoney + actions.payload.discount
                        }
                        localStorage.setItem("carts", JSON.stringify(updatedCartStore))
                        const cartLocal: ICart[] = JSON.parse(localStorage.getItem("carts")!)
                        state.carts = cartLocal
                    }
                }
            }
        },
        decreaseCartSlice: (state: ICartState, actions: PayloadAction<{ _id: string, discount: number }>) => {
            const cartIndex = state.carts.findIndex((state) => state._id === actions.payload._id)
            const { current } = JSON.parse(localStorage.getItem("persist:user")!)
            if (JSON.parse(current)?._id) {
                if (state.carts[cartIndex].quantity > 1) {
                    state.carts[cartIndex].quantity -= 1
                    state.carts[cartIndex].totalMoney -= actions.payload.discount
                    localStorage.setItem("cartIndex", JSON.stringify(state.carts[cartIndex]))
                } else {
                    state.carts[cartIndex].quantity == 1
                    localStorage.setItem("cartIndex", JSON.stringify(state.carts[cartIndex]))
                }
            } else {
                const cartStore: ICart[] = JSON.parse(localStorage.getItem("carts")!)
                if (cartStore) {
                    const cartStoreIndex = cartStore.findIndex((cart) => cart.productDetailId._id === actions.payload._id)
                    if (cartStoreIndex !== -1) {
                        const updatedCartStore = [...cartStore]
                        updatedCartStore[cartStoreIndex] = {
                            ...updatedCartStore[cartStoreIndex],
                            quantity: updatedCartStore[cartStoreIndex].quantity - 1,
                            totalMoney: updatedCartStore[cartStoreIndex].totalMoney - actions.payload.discount
                        }
                        localStorage.setItem("carts", JSON.stringify(updatedCartStore))
                        const cartLocal: ICart[] = JSON.parse(localStorage.getItem("carts")!)
                        state.carts = cartLocal
                    }
                }
            }
        },
    })
})



export const { listCartSlice, addCartSlice, removeCartSlice, increaseCartSlice, decreaseCartSlice } = cartSlice.actions

export default cartSlice.reducer