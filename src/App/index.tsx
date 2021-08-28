import { format } from 'd3-format'
import React from 'react'
import Skeleton from 'react-loading-skeleton'
import styled from 'styled-components'

import Card from './Card'
import type { SearchPanelProps } from './SearchPanel'
import SearchPanel from './SearchPanel'
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

const App = () => {
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

  const handleFetchMore = () => {
    dispatch({
      type: 'nextPage',
    })
  }

  const isUpdatingQ = actionType === 'updateQ' && isLoading
  const isFetchingMore = actionType === 'nextPage' && isLoading

  return (
    <>
      <SearchPanel handleQueryChange={handleQueryChange} />
      <SearchResultListWrapper>
        <TotalCountSkeletonWrapper>
          {isUpdatingQ ? (
            <CustomizedSkeleton count={1} />
          ) : (
            <>{format(',')(totalCount)} repository results</>
          )}
        </TotalCountSkeletonWrapper>
        {isUpdatingQ ? (
          <SkeletonWrapper>
            <CustomizedSkeleton count={3} />
          </SkeletonWrapper>
        ) : (
          repoItemList.map((item) => (
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
          ))
        )}
        {isFetchingMore && (
          <SkeletonWrapper>
            <CustomizedSkeleton count={3} />
          </SkeletonWrapper>
        )}
        <button onClick={handleFetchMore}>fetch more</button>
      </SearchResultListWrapper>
    </>
  )
}

export default App
