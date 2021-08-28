import styled from 'styled-components'
import { flexbox, FlexboxProps } from 'styled-system'

type FlexProps = FlexboxProps

const Flex = styled.div<FlexProps>`
  ${flexbox}
  display: flex;
`

export default Flex
