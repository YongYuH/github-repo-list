import { format } from 'd3-format'
import React, { useEffect, useRef } from 'react'
import Skeleton from 'react-loading-skeleton'
import styled from 'styled-components'
import { match } from 'ts-pattern'

import { useAppDispatch } from '../../hooks/useAppDispatch'
import { useAppSelector } from '../../hooks/useAppSelector'
import useIntersection from '../../hooks/useIntersection'
import type { RootState } from '../../store'
import { isEmptyOrNil } from '../../utils/isEmptyOrNil'
import type { Repository } from './cachedResultSlice'
import Card from './Card'
import { useGetRepositoryListByPageQuery } from './getRepositoryList'
import SearchPanel from './SearchPanel'
import { nextPage } from './searchPayloadSlice'

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

const RepositorySearch = () => {
  const intersectionRef = useRef()
  const intersection = useIntersection(intersectionRef, {
    rootMargin: '0px 0px 80px 0px',
    threshold: 0,
  })

  const dispatch = useAppDispatch()

  const cachedResult = useAppSelector((state: RootState) => state.cachedResult)
  const respositoryList = cachedResult.respositoryList
  const totalCount = cachedResult.totalCount

  const searchPayload = useAppSelector((state: RootState) => state.searchPayload)
  const { isLastActionUpdatingQ, page, perPage, q } = searchPayload

  const hasNextPage = page <= Math.floor(totalCount / searchPayload.perPage)

  const { isFetching } = useGetRepositoryListByPageQuery(
    {
      isLastActionUpdatingQ,
      page,
      perPage,
      q,
    },
    {
      skip: isEmptyOrNil(q),
    }
  )

  /** 捲動至頁面下方時 */
  useEffect(() => {
    if (intersection?.isIntersecting && hasNextPage) {
      dispatch(nextPage())
    }
  }, [intersection?.isIntersecting, hasNextPage])

  return (
    <>
      <SearchPanel />
      <SearchResultListWrapper>
        <TotalCountSkeletonWrapper>
          {match<
            {
              isFetching: boolean
              respositoryList: Repository[]
            },
            JSX.Element
          >({
            isFetching,
            respositoryList,
          })
            .with({ isFetching: false, respositoryList: [] }, () => null)
            .with({ isFetching: true }, () => <CustomizedSkeleton count={1} />)
            .with({ isFetching: false }, () => <>{format(',')(totalCount)} repository results</>)
            .exhaustive()}
        </TotalCountSkeletonWrapper>
        {match<
          {
            isLastActionUpdatingQ: boolean
            respositoryList: Repository[]
          },
          JSX.Element
        >({
          isLastActionUpdatingQ,
          respositoryList,
        })
          .with({ respositoryList: [] }, () => null)
          .with({ isLastActionUpdatingQ: true }, () => (
            <SkeletonWrapper>
              <CustomizedSkeleton count={3} />
            </SkeletonWrapper>
          ))
          .otherwise(() => (
            <>
              {respositoryList.map((item) => (
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
              isFetching: boolean
              respositoryList: Repository[]
            },
            JSX.Element
          >({
            isFetching,
            respositoryList,
          })
            .with({ isFetching: true }, () => (
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

export default RepositorySearch
