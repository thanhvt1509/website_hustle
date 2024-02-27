import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { DashboardStatistic, IStatisticState } from "./statistic.interface"

export const initialSatistic: IStatisticState = {
    satistics: []
}

const statisticSlice = createSlice({
    name: "satistics",
    initialState: initialSatistic,
    reducers: ({
        listSatisticSlice: (state: IStatisticState, actions: PayloadAction<DashboardStatistic[]>) => {
            state.satistics = actions.payload
        },
    })
})

export const { listSatisticSlice } = statisticSlice.actions
export default statisticSlice.reducer

