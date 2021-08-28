import { match } from 'ts-pattern'

import type { Query } from '..'

type SearchRepositoryActionType = 'keep' | 'nextPage' | 'updateQ'

type Action =
  | {
      type: 'keep'
    }
  | {
      type: 'nextPage'
    }
  | {
      payload: {
        q: Query['q']
      }
      type: 'updateQ'
    }

interface State {
  page: Query['page']
  perPage: Query['per_page']
  q: Query['q']
  searchRepositoryActionType?: SearchRepositoryActionType
}

type SearchRepositoryReducer = (state: State, action: Action) => State

const searchRepositoryReducer: SearchRepositoryReducer = (state, action) => {
  return match<Action, State>(action)
    .with({ type: 'keep' }, () => ({
      ...state,
    }))
    .with({ type: 'nextPage' }, () => ({
      ...state,
      page: state.page + 1,
      repoItemListActionType: 'append' as const,
      searchRepositoryActionType: action.type,
    }))
    .with({ type: 'updateQ' }, ({ payload }) => ({
      ...state,
      page: 1,
      q: payload.q,
      repoItemListActionType: 'reset' as const,
      searchRepositoryActionType: action.type,
    }))
    .exhaustive()
}

export type { SearchRepositoryActionType }

export { searchRepositoryReducer }
