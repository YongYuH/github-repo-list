import type { ChangeEventHandler } from 'react'
import React from 'react'

interface SearchPanelProps {
  handleQueryChange: ChangeEventHandler<HTMLInputElement>
}

const SearchPanel = (props: SearchPanelProps) => {
  const { handleQueryChange } = props

  return (
    <div>
      <input onChange={handleQueryChange} />
    </div>
  )
}

export type { SearchPanelProps }

export default SearchPanel
