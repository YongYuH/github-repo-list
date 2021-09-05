import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import isomorphicUnFetch from 'isomorphic-unfetch'

import type { paths } from '../../../types/generated-schema'
import { appendRespositoryList, replaceRespositoryList } from './cachedResultSlice'
import { resetIsLastActionUpdatingQ } from './searchPayloadSlice'

interface QueryPayload {
  isLastActionUpdatingQ: boolean
  page: number
  perPage: number
  q: string
}

type RepositoryListResponse =
  paths['/search/repositories']['get']['responses']['200']['content']['application/json']

const searchApi = createApi({
  reducerPath: 'searchApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.github.com', fetchFn: isomorphicUnFetch }),
  endpoints: (builder) => ({
    getRepositoryListByPage: builder.query<RepositoryListResponse, QueryPayload>({
      query: (payload) => {
        const { page, perPage, q } = payload
        return `search/repositories?q=${q}&page=${page}&per_page=${perPage}`
      },
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        const fetchedRepositoryListResponse = await queryFulfilled
        const responseData = fetchedRepositoryListResponse.data
        const { isLastActionUpdatingQ } = arg
        if (isLastActionUpdatingQ) {
          dispatch(
            replaceRespositoryList({
              fetchedRespositoryList: responseData.items,
              totalCount: responseData.total_count,
            })
          )
        } else {
          dispatch(
            appendRespositoryList({
              fetchedRespositoryList: responseData.items,
              totalCount: responseData.total_count,
            })
          )
        }
        dispatch(resetIsLastActionUpdatingQ())
      },
    }),
  }),
})

export { searchApi }

export type { RepositoryListResponse }

export const { useGetRepositoryListByPageQuery } = searchApi
