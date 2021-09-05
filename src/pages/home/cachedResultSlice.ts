import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { uniq } from 'rambda'

import type { RepositoryListResponse } from './getRepositoryList'

type Repository = RepositoryListResponse['items'][number]

interface CachedResultState {
  respositoryList: Repository[]
  totalCount: RepositoryListResponse['total_count']
}

interface ActionPayload {
  totalCount: number
  fetchedRespositoryList: Repository[]
}

const initialState: CachedResultState = {
  respositoryList: [],
  totalCount: 0,
}

const cachedResultSlice = createSlice({
  name: 'cachedResult',
  initialState,
  reducers: {
    appendRespositoryList: (state, action: PayloadAction<ActionPayload>) => {
      state.totalCount = action.payload.totalCount
      state.respositoryList = uniq([
        ...state.respositoryList,
        ...action.payload.fetchedRespositoryList,
      ])
    },
    replaceRespositoryList: (state, action: PayloadAction<ActionPayload>) => {
      state.totalCount = action.payload.totalCount
      state.respositoryList = action.payload.fetchedRespositoryList
    },
  },
})

export type { Repository }

export { cachedResultSlice }
export const { appendRespositoryList, replaceRespositoryList } = cachedResultSlice.actions
export default cachedResultSlice.reducer
