import { either, isEmpty, isNil } from 'rambda'

const isEmptyOrNil = either(isEmpty, isNil)

export { isEmptyOrNil }
