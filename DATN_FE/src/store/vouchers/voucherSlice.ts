import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { IVoucher, IVoucherSearchState, IVoucherState } from "./voucher.interface"

export const initialVoucherState: IVoucherState = {
    vouchers: []
}
export const initialVoucherSearchState: IVoucherSearchState = {
    searchTerm: "",
    vouchers: []
}

const voucherSlice = createSlice({
    name: "vouchers",
    initialState: initialVoucherSearchState,
    reducers: ({
        listVoucherSlice: (state: IVoucherState, actions: PayloadAction<IVoucher[]>) => {
            state.vouchers = actions.payload
        },
        listVoucherSearchSlice: (state: IVoucherSearchState, actions: PayloadAction<IVoucherSearchState>) => {
            const nameTerm = actions?.payload?.searchTerm?.trim().toLowerCase()
            if (nameTerm) {
                const listVoucherFilter = actions.payload?.vouchers?.filter(
                    (voucher) => { return voucher.title && voucher.title.trim().toLowerCase().includes(nameTerm) }
                );
                state.vouchers = listVoucherFilter
            }
        },
        listVoucherSearchByCodeSlice: (state: IVoucherSearchState, actions: PayloadAction<IVoucherSearchState>) => {
            const nameTerm = actions?.payload?.searchTerm?.trim().toLowerCase()
            if (nameTerm) {
                const listVoucherFilter = actions.payload?.vouchers?.filter(
                    (voucher) => { return voucher.code && voucher.code.trim().toLowerCase().includes(nameTerm) }
                );
                state.vouchers = listVoucherFilter
            }
        },
        deleteVoucherSlice: (state: IVoucherState, actions: PayloadAction<string>) => {
            state.vouchers = state.vouchers.filter((voucher) => voucher._id !== actions.payload)
        }
    })
})

export const { listVoucherSlice, deleteVoucherSlice, listVoucherSearchSlice, listVoucherSearchByCodeSlice } = voucherSlice.actions
export default voucherSlice.reducer

