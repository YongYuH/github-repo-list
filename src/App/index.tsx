import { format } from 'd3-format'
import React, { useEffect, useRef } from 'react'
import Skeleton from 'react-loading-skeleton'
import styled from 'styled-components'
import { __, match } from 'ts-pattern'

import useIntersection from '../hooks/useIntersection'
import Card from './Card'
import type { SearchPanelProps } from './SearchPanel'
import SearchPanel from './SearchPanel'
import type { Data } from './useSearchRepositories'
import { useSearchRepositories } from './useSearchRepositories'
import type { SearchRepositoryActionType } from './useSearchRepositories/useFetchUrl/searchRepositoriesReducer'

const SearchResultListWrapper = styled.div``
const TotalCountSkeletonWrapper = styled.div`
  padding: 16px 0;
`
const SkeletonWrapper = styled.div`
  padding: 16px 0;
  border-top: 1px solid rgb(36, 41, 47);
`
const CustomizedSkeleton = styled(Skeleton)`
  && {
    border-radius: 10px;
  }
`
const InterSectionWrapper = styled.div``
const InterSectionPlaceholder = styled.div`
  height: 80px;
`

const defaultPerPage = 30

const App = () => {
  const intersectionRef = useRef()
  const intersection = useIntersection(intersectionRef, {
    rootMargin: '0px 0px 80px 0px',
    threshold: 0,
  })

  const {
    dispatch,
    isLoading,
    repoItemList,
    page,
    perPage,
    searchRepositoryActionType,
    totalCount,
  } = useSearchRepositories({
    page: 1,
    perPage: defaultPerPage,
    q: undefined,
  })

  const hasNextPage = page <= Math.floor(totalCount / perPage)

  const handleQueryChange: SearchPanelProps['handleQueryChange'] = (e) => {
    const updatedQuery = e.target.value
    dispatch({
      type: 'updateQ',
      payload: {
        q: updatedQuery,
      },
    })
  }

  useEffect(() => {
    /**
     * 初始化的時候 intersectionRatio 為 1
     * 觸發 query 的條件是從未接觸到接觸
     * 所以要排除 intersectionRatio 為 1 的狀況
     */
    if (intersection && intersection.intersectionRatio < 1) {
      if (intersection.isIntersecting) {
        match(hasNextPage)
          .with(false, () => {
            dispatch({
              type: 'keep',
            })
          })
          .with(true, () => {
            dispatch({
              type: 'nextPage',
            })
          })
          .exhaustive()
      }
    }
  }, [intersection?.isIntersecting, hasNextPage])

  return (
    <>
      <SearchPanel handleQueryChange={handleQueryChange} />
      <SearchResultListWrapper>
        <TotalCountSkeletonWrapper>
          {match<
            {
              isLoading: boolean
              repoItemList: Data['items']
            },
            JSX.Element
          >({
            isLoading,
            repoItemList,
          })
            .with({ isLoading: true, repoItemList: __ }, () => <CustomizedSkeleton count={1} />)
            .with({ isLoading: false, repoItemList: [] }, () => <>0 repository results</>)
            .with({ isLoading: false, repoItemList: __ }, () => (
              <>{format(',')(totalCount)} repository results</>
            ))
            .exhaustive()}
        </TotalCountSkeletonWrapper>
        {match<
          {
            isLoading: boolean
            repoItemList: Data['items']
            searchRepositoryActionType: SearchRepositoryActionType
          },
          JSX.Element
        >({
          isLoading,
          repoItemList,
          searchRepositoryActionType,
        })
          .with(
            { isLoading: true, repoItemList: __, searchRepositoryActionType: 'updateQ' },
            () => (
              <SkeletonWrapper>
                <CustomizedSkeleton count={3} />
              </SkeletonWrapper>
            )
          )
          .with({ isLoading: true, repoItemList: [], searchRepositoryActionType: __ }, () => (
            <SkeletonWrapper>
              <CustomizedSkeleton count={3} />
            </SkeletonWrapper>
          ))
          .otherwise(() => (
            <>
              {repoItemList.map((item) => (
                <Card
                  key={item.id}
                  description={item.description}
                  htmlUrl={item.html_url}
                  language={item.language}
                  license={item.license}
                  name={item.name}
                  owner={item.owner}
                  stargazers_count={item.stargazers_count}
                  updated_at={item.updated_at}
                />
              ))}
            </>
          ))}
        <InterSectionWrapper ref={intersectionRef}>
          {match<
            {
              isLoading: boolean
              repoItemList: Data['items']
            },
            JSX.Element
          >({
            isLoading,
            repoItemList,
          })
            .with({ isLoading: true, repoItemList: __ }, () => (
              <SkeletonWrapper>
                <CustomizedSkeleton count={3} />
              </SkeletonWrapper>
            ))
            .otherwise(() => (
              <InterSectionPlaceholder />
            ))}
        </InterSectionWrapper>
      </SearchResultListWrapper>
    </>
  )
}

export default App
