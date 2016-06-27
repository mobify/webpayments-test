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

const shipping = (state = {free: false}, action) => {
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


const onInitiate = () => {
    if (!('PaymentRequest' in window)) {
        store.dispatch({
            type: 'SET_ERROR',
            error: 'Payment Request not supported, must have Chrome Dev with chrome://flags/#enable-experimental-web-platform-features enabled'
        })
        return
    }

    let { paymentMethods, details, shipping } = store.getState()

    if (!_.some(paymentMethods, (method) => method.active)) {
        store.dispatch({
            type: 'SET_ERROR',
            error: 'Must provide at least one payment method'
        })
    }

    let supportedInstruments = [{
        supportedMethods: _.pluck(
            paymentMethods.filter((method) => method.active),
            'value'
        )
    }]

    const detailDigest = _.object(
        details.map(({key, value}) => [key, value])
    )

    let details2 = {
        total: {label: detailDigest.label, amount: {currency: detailDigest.currency, value: detailDigest.value}}
    }
    if (shipping.free) {
        details2.shippingOptions = [{
            id: 'freeShipping',
            label: 'Free Shipping',
            amount: {currency: detailDigest.currency, value: '0.00'},
            selected: true
        }]
    }

    const options = {requestShipping: _.some(shipping)}

    let request = new PaymentRequest(supportedInstruments, details2, options)


    request.show().then((response) => {
        response.complete()
            .then(() => {
                console.log(response)
                store.dispatch({
                    type: 'SET_RESULT',
                    details: response.details,
                    address: {
                        recipient: response.shippingAddress.recipient,
                        addressLine: response.shippingAddress.addressLine,
                        city: response.shippingAddress.city,
                        region: response.shippingAddress.region,
                        postalCode: response.shippingAddress.postalCode,
                        country: response.shippingAddress.country
                    }
                })
            })
    }).catch((newError) => {
        console.log(newError.message)
        store.dispatch({
            type: 'SET_ERROR',
            error: newError.message
        })
    })
}

ReactDOM.render(
        <Provider store={store}>
        <App onInitiate={onInitiate} />
        </Provider>, document.getElementById('root')
);
