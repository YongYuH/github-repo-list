import { configureStore } from '@reduxjs/toolkit'

import cachedResultSlice from './pages/home/cachedResultSlice'
import { searchApi } from './pages/home/getRepositoryList'
import searchPayloadSlice from './pages/home/searchPayloadSlice'

const store = configureStore({
  reducer: {
    cachedResult: cachedResultSlice,
    searchPayload: searchPayloadSlice,
    [searchApi.reducerPath]: searchApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(searchApi.middleware),
})

type RootState = ReturnType<typeof store.getState>
type AppDispatch = typeof store.dispatch

export { store }

export type { AppDispatch, RootState }
