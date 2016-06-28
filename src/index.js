import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import _ from 'underscore'

const paymentMethods = (state = [], action) => {
    switch (action.type) {
        case 'ADD_METHOD':
            return [
                ...state,
                {
                    name: action.name,
                    value: action.value,
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

let store = createStore(
    combineReducers({
        paymentMethods,
        details,
        error,
        result,
        shipping
    })
)

store.dispatch({
    type: 'ADD_METHOD',
    name: 'Visa',
    value: 'visa'
})

store.dispatch({
    type: 'ADD_METHOD',
    name: 'MasterCard',
    value: 'mastercard'
})

store.dispatch({
    type: 'ADD_METHOD',
    name: 'American Express',
    value: 'amex'
})

const featureDetect = (next) => () => {
    if ('PaymentRequest' in window) {
        return next()
    }
    store.dispatch({
        type: 'SET_ERROR',
        error: 'Payment Request not supported, must have Chrome Dev with chrome://flags/#enable-experimental-web-platform-features enabled'
    })
}

const connectState = (next) => () => { next(store.getState()) }

const processMethods = (paymentMethods) => {
    const supportedInstruments = [{
        supportedMethods: _.pluck(
            paymentMethods.filter((method) => method.active),
            'value'
        )
    }]
    if (supportedInstruments[0].supportedMethods.length === 0) {
        return null
    }
    return supportedInstruments
}

const processDetails = (details) => {
    const detailDigest = _.object(
        details.map(({key, value}) => [key, value])
    )
    return {
        label: detailDigest.label,
        amount: {currency: detailDigest.currency, value: detailDigest.value}
    }
}

const processShipping = ({free, paid}, currency) => {
    let shippingOptions = []

    if (free) {
        shippingOptions.push({
            id: 'freeShipping',
            label: 'Free Shipping',
            amount: {currency: currency, value: '0.00'}
        })
    }
    if (paid) {
        shippingOptions.push({
            id: 'paidShipping',
            label: 'Premium Shipping',
            amount: {currency: currency, value: '5.00'}
        })
    }
    if (shippingOptions.length > 0) {
        shippingOptions[0].selected = true
    }
    return shippingOptions
}

const transformState = (next) => ({ paymentMethods, details, shipping }) => {
    const supportedInstruments = processMethods(paymentMethods)
    const total = processDetails(details)
    const shippingOptions = processShipping(shipping, total.amount.currency)

    if (supportedInstruments) {
        return next({ supportedInstruments, total, shippingOptions})
    }

    store.dispatch({
        type: 'SET_ERROR',
        error: 'Must provide at least one payment method'
    })
}

const makeRequest = (next) => ({ supportedInstruments, total, shippingOptions }) => {
    let details = {
        total,
        shippingOptions
    }

    const options = {requestShipping: shippingOptions.length > 0}

    let request = new PaymentRequest(supportedInstruments, details, options)

    request.show()
        .then(next)
        .catch((newError) => {
            console.log(newError.message)
            store.dispatch({
                type: 'SET_ERROR',
                error: newError.message
            })
        })
}

const processResponse = (response) => {
    response.complete()
        .then(() => {
            console.log(response)
            store.dispatch({
                type: 'SET_RESULT',
                details: response.details,
                address: response.shippingAddress && {
                    recipient: response.shippingAddress.recipient,
                    addressLine: response.shippingAddress.addressLine,
                    city: response.shippingAddress.city,
                    region: response.shippingAddress.region,
                    postalCode: response.shippingAddress.postalCode,
                    country: response.shippingAddress.country
                }
            })
        })
}

const onInitiate = _.compose(
    featureDetect,
    connectState,
    transformState,
    makeRequest,
    processResponse
)

ReactDOM.render(
        <Provider store={store}>
        <App onInitiate={onInitiate} />
        </Provider>, document.getElementById('root')
);
