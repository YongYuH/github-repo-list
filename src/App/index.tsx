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

const App = () => {
  const intersectionRef = useRef()
  const intersection = useIntersection(intersectionRef, {
    rootMargin: '0px',
    threshold: 0,
  })

  const { actionType, dispatch, isLoading, repoItemList, totalCount } = useSearchRepositories({
    page: 1,
    q: undefined,
  })

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
     * 這編的判斷條件是從未接觸到接觸，所以要排除 intersectionRatio 為 1 的狀況
     */
    if (intersection && intersection.intersectionRatio < 1 && repoItemList.length > 0) {
      if (intersection.isIntersecting) {
        console.log(intersection)
        dispatch({
          type: 'nextPage',
        })
      }
    }
  }, [intersection?.isIntersecting, repoItemList.length])

  const isUpdatingQ = actionType === 'updateQ' && isLoading ? true : false
  const isFetchingMore = actionType === 'nextPage' && isLoading ? true : false

  return (
    <>
      <SearchPanel handleQueryChange={handleQueryChange} />
      <SearchResultListWrapper>
        <TotalCountSkeletonWrapper>
          {match<{ isUpdatingQ: boolean; repoItemList: Data['items'] }, JSX.Element>({
            isUpdatingQ,
            repoItemList,
          })
            .with({ isUpdatingQ: false, repoItemList: [] }, () => <>0 repository results</>)
            .with({ isUpdatingQ: true, repoItemList: __ }, () => <CustomizedSkeleton count={1} />)
            .with({ isUpdatingQ: false, repoItemList: __ }, () => (
              <>{format(',')(totalCount)} repository results</>
            ))
            .exhaustive()}
        </TotalCountSkeletonWrapper>
        {match<{ isUpdatingQ: boolean; repoItemList: Data['items'] }, JSX.Element>({
          isUpdatingQ,
          repoItemList,
        })
          .with({ isUpdatingQ: true, repoItemList: __ }, () => (
            <SkeletonWrapper>
              <CustomizedSkeleton count={3} />
            </SkeletonWrapper>
          ))
          .with({ isUpdatingQ: false, repoItemList: __ }, () => (
            <>
              {repoItemList.map((item) => (
                <Card
                  key={item.id}
                  description={item.description}
                  language={item.language}
                  license={item.license}
                  name={item.name}
                  owner={item.owner}
                  stargazers_count={item.stargazers_count}
                  updated_at={item.updated_at}
                  url={item.url}
                />
              ))}
            </>
          ))
          .exhaustive()}
        <InterSectionWrapper ref={intersectionRef}>
          {match<{ isFetchingMore: boolean; repoItemList: Data['items'] }, JSX.Element>({
            isFetchingMore,
            repoItemList,
          })
            .with({ isFetchingMore: false, repoItemList: __ }, () => <SkeletonWrapper />)
            .with({ isFetchingMore: true, repoItemList: __ }, () => (
              <SkeletonWrapper>
                <CustomizedSkeleton count={3} />
              </SkeletonWrapper>
            ))
            .exhaustive()}
        </InterSectionWrapper>
      </SearchResultListWrapper>
    </>
  )
}

export default App
