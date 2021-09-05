import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

const defaultItemNumberPerPage = 30

interface UpdateQueryActionPayload {
  isLastActionUpdatingQ: boolean
  q: string
}

interface SearchPayloadState {
  isLastActionUpdatingQ: boolean
  page: number
  perPage: number
  q: string
}

const initialState: SearchPayloadState = {
  isLastActionUpdatingQ: false,
  page: 1,
  perPage: defaultItemNumberPerPage,
  q: '',
}

const searchPayloadSlice = createSlice({
  name: 'searchPayload',
  initialState,
  reducers: {
    nextPage: (state) => {
      state.isLastActionUpdatingQ = false
      state.page = state.page + 1
    },
    updateQuery: (state, action: PayloadAction<UpdateQueryActionPayload>) => {
      state.isLastActionUpdatingQ = action.payload.isLastActionUpdatingQ
      state.page = 1
      state.q = action.payload.q
    },
  },
})

export { searchPayloadSlice }
export const { nextPage, updateQuery } = searchPayloadSlice.actions
export default searchPayloadSlice.reducer
