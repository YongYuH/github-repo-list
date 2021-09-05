import debounce from 'debounce'
import type { ChangeEventHandler } from 'react'
import React, { useEffect, useMemo } from 'react'

import { useAppDispatch } from '../../hooks/useAppDispatch'
import { updateQuery } from './searchPayloadSlice'

const delayedMillisecond = 600

const SearchPanel = () => {
  const dispatch = useAppDispatch()

  const queryChangeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    const updatedQ = e.target.value
    dispatch(updateQuery({ isLastActionUpdatingQ: true, q: updatedQ }))
  }

  const debouncedChangeHandler = useMemo(() => debounce(queryChangeHandler, delayedMillisecond), [])

  useEffect(() => {
    return () => {
      debouncedChangeHandler.clear()
    }
  }, [])

  return (
    <div>
      <input onChange={debouncedChangeHandler} />
    </div>
  )
}

export default SearchPanel
