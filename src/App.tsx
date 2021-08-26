import { useDebounce } from '@react-hook/debounce'
import { format } from 'd3-format'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'
import fetch from 'isomorphic-unfetch'
import emoji from 'node-emoji'
import React from 'react'
import { GoRepo, GoStar } from 'react-icons/go'
import styled from 'styled-components'
import useSWR from 'swr'
import type { Fetcher } from 'swr/dist/types'

import type { paths } from '../schema'
import Grid from './components/Grid'
import type { SearchPanelProps } from './SearchPanel'
import SearchPanel from './SearchPanel'
import { isEmptyOrNil } from './utils/isEmptyOrNil'

const TotalCount = styled.div`
  padding: 16px 0;
`
const Row = styled.div`
  padding: 24px 0;
  border-top: 1px solid rgb(36, 41, 47);
`
const IconWrapper = styled.div`
  margin-top: 4px;
`

const apiUrl = 'https://api.github.com'

type Data = paths['/search/repositories']['get']['responses']['200']['content']['application/json']

const fetcher: Fetcher<Data> = async (...args) => {
  const response = await fetch(args)
  const responseJson = response.json()
  return responseJson
}

const App = () => {
  const [query, setQuery] = useDebounce<string>(undefined, 250)
  /** do not trigger query when query string is empty string or undefined */
  const key = isEmptyOrNil(query) ? null : `${apiUrl}/search/repositories?q=${query}`
  const { data } = useSWR(key, fetcher)

  const handleQueryChange: SearchPanelProps['handleQueryChange'] = (e) => {
    const updatedQuery = e.target.value
    setQuery(updatedQuery)
  }

  return (
    <>
      <SearchPanel handleQueryChange={handleQueryChange} />
      {data && (
        <>
          <TotalCount>{format(',')(data.total_count)} repository results</TotalCount>
          {data.items?.map((item) => (
            <Row key={item.id}>
              <Grid gridAutoFlow="column" gridAutoColumns="max-content" gridColumnGap="8px">
                <IconWrapper>
                  <GoRepo />
                </IconWrapper>
                <Grid>
                  <a href={item.url}>
                    {item.owner.login}/{item.name}
                  </a>
                  <div>{emoji.emojify(item.description)}</div>
                  <Grid gridAutoFlow="column" gridAutoColumns="max-content" gridColumnGap="16px">
                    <Grid alignItems="center" gridAutoFlow="column" gridAutoColumns="max-content">
                      <GoStar />
                      {format('~s')(item.stargazers_count)}
                    </Grid>
                    <div>{item.language}</div>
                    {item.license && <div>{item.license.name}</div>}
                    <div>Updated {formatDistanceToNowStrict(new Date(item.updated_at))} ago</div>
                  </Grid>
                </Grid>
              </Grid>
            </Row>
          ))}
        </>
      )}
    </>
  )
}

export default App
