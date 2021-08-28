import { match } from 'ts-pattern'

import type { Query } from '.'

interface ActionPayload {
  q: Query['q']
}

export type SearchRepositoryActionType = 'initial' | 'nextPage' | 'updateQ'

interface Action {
  payload?: ActionPayload
  type: SearchRepositoryActionType
}

interface State {
  page: Query['page']
  q: Query['q']
  updateType: SearchRepositoryActionType
}

type SearchRepositoryReducer = (state: State, action: Action) => State

const searchRepositoryReducer: SearchRepositoryReducer = (state, action) => {
  return match(action.type)
    .with('initial', () => ({
      ...state,
    }))
    .with('nextPage', () => ({
      ...state,
      page: state.page + 1,
      updateType: action.type,
    }))
    .with('updateQ', () => ({
      ...state,
      q: action.payload.q,
      updateType: action.type,
    }))
    .exhaustive()
}

export { searchRepositoryReducer }
