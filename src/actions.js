import {createAction} from 'redux-act'

export const toggleMethod = createAction('Toggle payment method')
export const setDetailValue = createAction(
    'Set detail value',
    (index, value) => { return {index, value} }
)
export const setError = createAction('Set error message')
export const setResult = createAction('Set result information')
export const flipShippingFlag = createAction('Flip shipping flag')
export const flipMiscFlag = createAction('Flip misc flag')
