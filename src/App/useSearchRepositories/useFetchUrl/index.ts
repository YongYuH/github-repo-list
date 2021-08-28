import { useReducer } from 'react'

import { useDebounce } from '../../../hooks/useDebounce'
import { isEmptyOrNil } from '../../../utils/isEmptyOrNil'
import type { Query } from '..'
import { searchRepositoryReducer } from './searchRepositoriesReducer'

const apiUrl = 'https://api.github.com'

interface GetFetchUrlArgs {
  page: Query['page']
  perPage?: Query['per_page']
  q: Query['q']
}

type GetFetchUrl = (args: GetFetchUrlArgs) => string

const getFetchUrl: GetFetchUrl = (args) => {
  const { page, perPage, q } = args
  /** do not trigger query when query string is empty string or undefined */
  const fetchUrl = isEmptyOrNil(q)
    ? null
    : `${apiUrl}/search/repositories?q=${q}&page=${page}&per_page=${perPage}`

  return fetchUrl
}

interface UseFetchUrlArgs {
  page?: Query['page']
  perPage?: Query['per_page']
  q?: Query['q']
}

const useFetchUrl = (args: UseFetchUrlArgs) => {
  const { page, perPage, q } = args

  const [queryParameters, dispatch] = useReducer(searchRepositoryReducer, {
    page,
    perPage,
    q,
  })

  const fetchUrl = useDebounce(
    () =>
      getFetchUrl({
        page: queryParameters.page,
        perPage: queryParameters.perPage,
        q: queryParameters.q,
      }),
    250
  )

  return {
    dispatch,
    fetchUrl,
    queryParameters,
    searchRepositoryActionType: queryParameters.searchRepositoryActionType,
  }
}

export { useFetchUrl }
