import { combineReducers } from 'redux'

const paymentMethods = (state = [], action) => {
    switch (action.type) {
        case 'ADD_METHOD':
            return [
                ...state,
                {
                    name: action.name,
                    value: action.value,
                    options: {...action.options},
                    active: state.length === 0
                }
            ]
        case 'TOGGLE_METHOD':
            return state.map((method, idx) => {
                if (idx == action.index) {
                    return {
                        ...method,
                        active: !method.active
                    }
                }
                return method
            })
        default:
            return state
    }
}

const initialDetails = [
    {label: 'Description', value: 'Test Total', key: 'label'},
    {label: 'Currency', value: 'CAD', key: 'currency'},
    {label: 'Amount', value: '10.50', key: 'value'}
]

const details = (state = initialDetails, action) => {
    switch (action.type) {
        case 'SET_DETAIL_VALUE':
            return state.map((detail, idx) => {
                if (idx == action.index) {
                    return {
                        ...detail,
                        value: action.value
                    }
                }
                return detail
            })
        default:
            return state
    }
}

const error = (state = null, action) => {
    switch (action.type) {
        case 'SET_ERROR':
            return action.error
        case 'SET_RESULT':
            return null
        default:
            return state
    }
}

const result = (state = {}, action) => {
    switch (action.type) {
        case 'SET_RESULT':
            return {
                details: action.details,
                address: action.address
            }
        case 'SET_ERROR':
            return {}
        default:
            return state
    }
}

const shipping = (state = {free: false, paid: false}, action) => {
    switch (action.type) {
        case 'FLIP_SHIPPING_FLAG':
            let result = {...state}
            result[action.flag] = !result[action.flag]
            return result
        default:
            return state
    }
}

export default combineReducers({
    paymentMethods,
    details,
    error,
    result,
    shipping
})
