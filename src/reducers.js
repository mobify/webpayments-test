import {combineReducers} from 'redux'
import {createReducer} from 'redux-act'
import {List, Map} from 'immutable'

import * as Actions from './actions'

const initialMethods = List.of(
    Map({name: 'Visa', value: 'visa', options: {}, active: true}),
    Map({name: 'MasterCard', value: 'mastercard', options: {}, active: false}),
    Map({name: 'American Express', value: 'amex', options: {}, active: false})
)

export const paymentMethods = createReducer({
    [Actions.toggleMethod]: (state, index) => {
        return state.update(
            index,
            (method) => method.update('active', (active) => !active)
        )
    }
}, initialMethods)

const initialDetails = List.of(
    Map({label: 'Description', value: 'Test Total', key: 'label'}),
    Map({label: 'Currency', value: 'CAD', key: 'currency'}),
    Map({label: 'Amount', value: '10.50', key: 'value'})
)

export const details = createReducer({
    [Actions.setDetailValue]: (state, {index, value}) => {
        return state.update(
            index,
            (detail) => detail.set('value', value)
        )
    }
}, initialDetails)

export const error = createReducer({
    [Actions.setError]: (state, error) => { return error },
    [Actions.setResult]: () => null
}, null)

export const result = createReducer({
    [Actions.setError]: () => null,
    [Actions.setResult]: (state, {details, address, email, phone}) => {
        return {details, address, email, phone}
    }
}, {})

const flipFlag = (state, flag) => state.update(flag, (v) => !v)

export const shipping = createReducer({
    [Actions.flipShippingFlag]: flipFlag,
}, Map({free: false, paid: false}))

export const misc = createReducer({
    [Actions.flipMiscFlag]: flipFlag
}, Map({email: false, phone: false}))

export default combineReducers({
    paymentMethods,
    details,
    error,
    result,
    shipping,
    misc
})
