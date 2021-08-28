import { match } from 'ts-pattern'

import type { Data } from '.'
import type { SearchRepositoryActionType } from './searchRepositoriesReducer'

type RepoItem = Data['items'][number]
type TotalCount = Data['total_count']

interface ActionPayload {
  fetchedItemList: RepoItem[]
  totalCount: TotalCount
}

interface RepoItemListAction {
  payload: ActionPayload
  type: SearchRepositoryActionType
}

interface State {
  totalCount: TotalCount
  repoItemList: RepoItem[]
}

type RepoItemListReducer = (state: State, action: RepoItemListAction) => State

const repoItemListReducer: RepoItemListReducer = (state, action) => {
  return match(action.type)
    .with('initial', () => ({
      ...state,
    }))
    .with('nextPage', () => ({
      repoItemList: [...state.repoItemList, ...action.payload.fetchedItemList],
      totalCount: action.payload.totalCount,
    }))
    .with('updateQ', () => ({
      repoItemList: action.payload.fetchedItemList,
      totalCount: action.payload.totalCount,
    }))
    .exhaustive()
}

export { repoItemListReducer }
