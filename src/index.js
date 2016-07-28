import React from 'react'
import ReactDOM from 'react-dom'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import _ from 'underscore'

import App from './App'
import reducer from './reducers'
import {setError, setResult} from './actions'
import {buildRequest, performRequest} from './request-wrapper'

let store = createStore(reducer, {}, window.devToolsExtension && window.devToolsExtension())

//* *******
// The following sequence of functions implements the call to the Web
// Payments API, based on the parameters in the Redux store.

// Detect the presence of the PaymentRequest object
const featureDetect = (next) => () => {
    if ('PaymentRequest' in window) {
        next()
        return
    }
    store.dispatch(setError(
        'Payment Request not supported, must have Chrome Dev with chrome://flags/#enable-experimental-web-platform-features enabled'
    ))
}

// Pass the Redux state to the remaining code as a function parameter.
const connectState = (next) => () => { next(store.getState()) }

const stripImmutable = (next) => ({paymentMethods, details, shipping, misc}) => {
    next({
        paymentMethods: paymentMethods.toJS(),
        details: details.toJS(),
        shipping: shipping.toJS(),
        misc: misc.toJS()
    })
}

// Convert the Redux state of the payment method options to
// a valid supportedInstruments parameter.
const processMethods = (paymentMethods) => {
    const creditCards = paymentMethods
          .filter((method) => method.active)
          .map(({value}) => value)
    return {creditCards}
}

// Converts the total in the Redux state to a value object.
const processDetails = (details) => {
    const detailDigest = _.object(
        details.map(({key, value}) => [key, value])
    )
    return {
        subtotal: detailDigest.value,
        currency: detailDigest.currency
    }
}

const processShipping = ({free, paid}) => {
    const shippingOptions = []

    if (free) {
        shippingOptions.push({
            id: 'freeShipping',
            label: 'Free Shipping',
            value: '0.00'
        })
    }
    if (paid) {
        shippingOptions.push({
            id: 'paidShipping',
            label: 'Premium Shipping',
            value: '5.00'
        })
    }
    return shippingOptions.length > 0 ? {shippingOptions} : {}
}

const transformState = (next) => ({paymentMethods, details, shipping, misc}) => {
    const data = {
            ...processMethods(paymentMethods),
            ...processDetails(details),
            ...processShipping(shipping)
    }

    next({data, misc})
}

const makeRequest = (next) => ({data, misc}) => {
    const options = {
        requestShipping: data.shippingOptions.length > 0,
        requestPayerPhone: misc.phone,
        requestPayerEmail: misc.email
    }

    let request
    try {
        request = buildRequest(data, options)
    } catch (err) {
        store.dispatch(setError(err.message))
    }

    performRequest(
        request,
        next,
        (newError) => {
            console.log(newError.message || newError)
            store.dispatch(setError(newError.message || newError))
        }
    )
}

const processResponse = (response) => {
    response.complete()
        .then(() => {
            console.log(response)
            store.dispatch(setResult({
                details: response.details,
                address: response.shippingAddress && {
                    recipient: response.shippingAddress.recipient,
                    addressLine: response.shippingAddress.addressLine,
                    city: response.shippingAddress.city,
                    region: response.shippingAddress.region,
                    postalCode: response.shippingAddress.postalCode,
                    country: response.shippingAddress.country
                },
                email: response.payerEmail,
                phone: response.payerPhone
            }))
        })
}

const onInitiate = featureDetect(
    connectState(
        stripImmutable(
            transformState(
                makeRequest(
                    processResponse
                )
            )
        )
    )
)

ReactDOM.render(
    <Provider store={store}>
        <App onInitiate={onInitiate} />
    </Provider>, document.getElementById('root')
)
