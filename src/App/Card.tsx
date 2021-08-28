import { format } from 'd3-format'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'
import emoji from 'node-emoji'
import React from 'react'
import { GoRepo, GoStar } from 'react-icons/go'
import styled from 'styled-components'

import Flex from '../components/Flex'
import Grid from '../components/Grid'
import type { Data } from './useSearchRepositories'

const Row = styled.div`
  padding: 24px 0;
  border-top: 1px solid rgb(36, 41, 47);
`
const Link = styled.a`
  width: fit-content;
`
const IconWrapper = styled.div`
  margin-top: 4px;
`
const CustomizedGrid = styled(Grid)`
  word-break: break-all;
`
const Description = styled.div`
  margin: 8px 0;
`
const CustomizedFlex = styled(Flex)`
  & > *:not(:nth-last-of-type(1)) {
    margin-right: 8px;
  }
`
const Label = styled.div`
  font-size: 12px;
`

type Item = Data['items'][number]

interface CardProps {
  description: Item['description']
  htmlUrl: Item['html_url']
  language: Item['language']
  license?: Item['license']
  name: Item['name']
  owner: Item['owner']
  stargazers_count: Item['stargazers_count']
  updated_at: Item['updated_at']
}

const Card = (props: CardProps) => {
  const { description, htmlUrl, language, license, name, owner, stargazers_count, updated_at } =
    props

  return (
    <Row>
      <Grid gridAutoFlow="column" gridAutoColumns="max-content 1fr" gridColumnGap="8px">
        <IconWrapper>
          <GoRepo />
        </IconWrapper>
        <CustomizedGrid>
          <Link href={htmlUrl} target="_blank">
            {owner.login}/{name}
          </Link>
          <Description>{emoji.emojify(description)}</Description>
          <CustomizedFlex flexWrap="wrap">
            <Label>
              <Grid alignItems="center" gridAutoFlow="column" gridAutoColumns="max-content">
                <GoStar />
                {format('~s')(stargazers_count)}
              </Grid>
            </Label>
            <Label>{language}</Label>
            {license && <Label>{license.name}</Label>}
            <Label>Updated {formatDistanceToNowStrict(new Date(updated_at))} ago</Label>
          </CustomizedFlex>
        </CustomizedGrid>
      </Grid>
    </Row>
  )
}

export default Card
