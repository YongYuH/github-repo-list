import styled from 'styled-components'
import { flexbox, FlexboxProps, grid, GridProps as StyledSystemGridProps } from 'styled-system'

type GridProps = FlexboxProps & StyledSystemGridProps

const Grid = styled.div<GridProps>`
  ${flexbox}
  ${grid}
  display: grid;
`

export default Grid
