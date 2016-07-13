import {combineReducers} from 'redux'
import {List, Map, fromJS} from 'immutable'

const initialMethods = List.of(
    Map({name: 'Visa', value: 'visa', options: {}, active: true}),
    Map({name: 'MasterCard', value: 'mastercard', options: {}, active: false}),
    Map({name: 'American Express', value: 'amex', options: {}, active: false})
)

export const paymentMethods = (state = initialMethods, action) => {
    switch (action.type) {
        case 'TOGGLE_METHOD':
            return state.update(
                action.index,
                (method) => method.update('active', value => !value)
            )
        default:
            return state
    }
}

const initialDetails = List.of(
    Map({label: 'Description', value: 'Test Total', key: 'label'}),
    Map({label: 'Currency', value: 'CAD', key: 'currency'}),
    Map({label: 'Amount', value: '10.50', key: 'value'})
)

export const details = (state = initialDetails, action) => {
    switch (action.type) {
        case 'SET_DETAIL_VALUE':
            return state.update(
                action.index,
                (detail) => detail.set('value', action.value)
            )
        default:
            return state
    }
}

export const error = (state = null, action) => {
    switch (action.type) {
    case 'SET_ERROR':
        return action.error
    case 'SET_RESULT':
        return null
    default:
        return state
    }
}

export const result = (state = {}, action) => {
    switch (action.type) {
    case 'SET_RESULT':
        return {
            details: action.details,
            address: action.address,
            email: action.email,
            phone: action.phone
        }
    case 'SET_ERROR':
        return {}
    default:
        return state
    }
}

/* eslint-disable no-case-declarations */
export const shipping = (state = Map({free: false, paid: false}), action) => {
    switch (action.type) {
        case 'FLIP_SHIPPING_FLAG':
            return state.update(
                action.flag,
                flag => !flag
            )
        default:
            return state
    }
}

export const misc = (state = Map({email: false, phone: false}), action) => {
    switch (action.type) {
        case 'FLIP_MISC_FLAG':
            return state.update(
                action.flag,
                flag => !flag
            )
        default:
            return state
    }
}
/* eslint-enable no-case-declarations */

export default combineReducers({
    paymentMethods,
    details,
    error,
    result,
    shipping,
    misc
})
