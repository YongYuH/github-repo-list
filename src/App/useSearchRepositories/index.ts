import { useEffect, useReducer } from 'react'
import useSWR from 'swr'
import type { Fetcher } from 'swr/dist/types'

import type { paths } from '../../../schema'
import { useDebounce } from '../../hooks/useDebounce'
import { isEmptyOrNil } from '../../utils/isEmptyOrNil'
import { repoItemListReducer } from './repoItemListReducer'
import { searchRepositoryReducer } from './searchRepositoriesReducer'

const apiUrl = 'https://api.github.com'
const defaultPerPage = 30

interface GetFetchUrlArgs {
  page: Query['page']
  perPage?: Query['per_page']
  q: Query['q']
}

type GetFetchUrl = (args: GetFetchUrlArgs) => string

const getFetchUrl: GetFetchUrl = (args) => {
  const { page, perPage = defaultPerPage, q } = args
  /** do not trigger query when query string is empty string or undefined */
  const fetchUrl = isEmptyOrNil(q)
    ? null
    : `${apiUrl}/search/repositories?q=${q}&page=${page}&per_page=${perPage}`

  return fetchUrl
}

export type Query = paths['/search/repositories']['get']['parameters']['query']
export type Data =
  paths['/search/repositories']['get']['responses']['200']['content']['application/json']

const apiFetcher: Fetcher<Data> = async (...args) => {
  const response = await fetch(args)
  const responseJson = response.json()
  return responseJson
}

interface UseSearchRepositoriesArgs {
  page?: Query['page']
  q?: Query['q']
}

const useSearchRepositories = (args: UseSearchRepositoriesArgs) => {
  const { page, q } = args

  const [{ repoItemList, totalCount }, repoItemListDispatch] = useReducer(repoItemListReducer, {
    repoItemList: [],
    totalCount: 0,
  })

  const [queryParameters, dispatch] = useReducer(searchRepositoryReducer, {
    page,
    q,
    updateType: 'initial',
  })

  const fetchUrl = useDebounce(
    () =>
      getFetchUrl({
        page: queryParameters.page,
        q: queryParameters.q,
      }),
    250
  )

  const { data, isValidating } = useSWR(fetchUrl, apiFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  useEffect(() => {
    if (data && !isValidating) {
      repoItemListDispatch({
        payload: {
          fetchedItemList: data.items,
          totalCount: data.total_count,
        },
        type: queryParameters.updateType,
      })
    }
  }, [isValidating])

  return {
    actionType: queryParameters.updateType,
    dispatch,
    isLoading: isValidating,
    repoItemList,
    totalCount,
  }
}

export { useSearchRepositories }
