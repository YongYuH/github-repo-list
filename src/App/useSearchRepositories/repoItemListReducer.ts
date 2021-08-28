import { uniq } from 'rambda'
import { match } from 'ts-pattern'

import type { Data } from '.'

type RepoItem = Data['items'][number]
type TotalCount = Data['total_count']

type RepoItemListActionType = 'append' | 'keep' | 'reset'

interface ActionPayload {
  fetchedItemList: RepoItem[]
  totalCount: TotalCount
}

type RepoItemListAction =
  | {
      payload: ActionPayload
      type: 'append'
    }
  | {
      type: 'keep'
    }
  | {
      payload: ActionPayload
      type: 'reset'
    }

interface State {
  totalCount: TotalCount
  repoItemList: RepoItem[]
}

type RepoItemListReducer = (state: State, action: RepoItemListAction) => State

const repoItemListReducer: RepoItemListReducer = (state, action) => {
  return match(action)
    .with({ type: 'append' }, ({ payload }) => ({
      ...state,
      repoItemList: uniq([...state.repoItemList, ...payload.fetchedItemList]),
      totalCount: payload.totalCount ?? 0,
    }))
    .with({ type: 'keep' }, () => ({
      ...state,
    }))
    .with({ type: 'reset' }, ({ payload }) => ({
      ...state,
      repoItemList: payload.fetchedItemList ?? [],
      totalCount: payload.totalCount ?? 0,
    }))
    .exhaustive()
}

export { RepoItemListActionType }

export { repoItemListReducer }
