import fetch from 'isomorphic-unfetch'
import { isEmpty, isNil } from 'rambda'
import { useEffect, useReducer } from 'react'
import useSWR from 'swr'
import type { Fetcher } from 'swr/dist/types'
import { __, match } from 'ts-pattern'

import type { paths } from '../../../types/generated-schema'
import { repoItemListReducer } from './repoItemListReducer'
import { useFetchUrl } from './useFetchUrl'

export type Query = paths['/search/repositories']['get']['parameters']['query']
export type Data =
  paths['/search/repositories']['get']['responses']['200']['content']['application/json']

const apiFetcher: Fetcher<Data> = async (...args) => {
  const response = await fetch(args)
  const responseJson = response.json()
  return responseJson
}

interface UseSearchRepositoriesArgs {
  page: Query['page']
  perPage: Query['per_page']
  q: Query['q']
}

const useSearchRepositories = (args: UseSearchRepositoriesArgs) => {
  const { page, perPage, q } = args

  const { dispatch, fetchUrl, queryParameters, searchRepositoryActionType } = useFetchUrl({
    page,
    perPage,
    q,
  })

  const { data, isValidating } = useSWR(fetchUrl, apiFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  const [{ repoItemList, totalCount }, repoItemListDispatch] = useReducer(repoItemListReducer, {
    repoItemList: [],
    totalCount: 0,
  })

  useEffect(() => {
    match({ data, isValidating, searchRepositoryActionType })
      .with(
        { searchRepositoryActionType: 'updateQ' },
        ({ data, isValidating }) => isValidating === false && !isNil(data) && !isEmpty(data.items),
        () => {
          repoItemListDispatch({
            payload: {
              fetchedItemList: data.items,
              totalCount: data.total_count,
            },
            type: 'reset',
          })
        }
      )
      .with(
        { data: __, isValidating: __, searchRepositoryActionType: 'nextPage' },
        ({ data, isValidating }) => isValidating === false && !isNil(data) && !isEmpty(data.items),
        () => {
          repoItemListDispatch({
            payload: {
              fetchedItemList: data.items,
              totalCount: data.total_count,
            },
            type: 'append',
          })
        }
      )
      .with(
        { data: __, isValidating: __, searchRepositoryActionType: __ },
        ({ data, isValidating }) => isValidating === false && !isNil(data) && isEmpty(data.items),
        () => {
          repoItemListDispatch({
            type: 'keep',
          })
        }
      )
      .otherwise(() => {
        return undefined
      })
  }, [!isNil(data), isValidating])

  return {
    dispatch,
    isLoading: isValidating === true,
    page: queryParameters.page,
    perPage: queryParameters.perPage,
    q: queryParameters.q,
    repoItemList,
    searchRepositoryActionType,
    totalCount,
  }
}

export { useSearchRepositories }
