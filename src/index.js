import React from 'react'
import ReactDOM from 'react-dom'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import _ from 'underscore'

import App from './App'
import reducer from './reducers'
import {setError, setResult} from './actions'

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
    const supportedInstruments = paymentMethods
          .filter((method) => method.active)
          .map(({value, options}) => {
              return {
                  supportedMethods: [value],
                   // Each payment method can have an options object
                   // associated with it. Credit cards do not use this
                   // but e.g. Android Pay would.
                  data: options
              }
          })

    if (supportedInstruments.length === 0) {
        return null
    }
    return supportedInstruments
}

// Converts the total in the Redux state to a value object.
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
    const shippingOptions = []

    if (free) {
        shippingOptions.push({
            id: 'freeShipping',
            label: 'Free Shipping',
            amount: {currency, value: '0.00'}
        })
    }
    if (paid) {
        shippingOptions.push({
            id: 'paidShipping',
            label: 'Premium Shipping',
            amount: {currency, value: '5.00'}
        })
    }
    if (shippingOptions.length > 0) {
        shippingOptions[0].selected = true
    }
    return shippingOptions
}

const transformState = (next) => ({paymentMethods, details, shipping, misc}) => {
    const supportedInstruments = processMethods(paymentMethods)
    const total = processDetails(details)
    const shippingOptions = processShipping(shipping, total.amount.currency)

    if (supportedInstruments) {
        next({supportedInstruments, total, shippingOptions, misc})
        return
    }

    store.dispatch(setError('Must provide at least one payment method'))
}

const makeRequest = (next) => ({supportedInstruments, total, shippingOptions, misc}) => {
    const details = {
        total,
        shippingOptions
    }

    const options = {
        requestShipping: shippingOptions.length > 0,
        requestPayerPhone: misc.phone,
        requestPayerEmail: misc.email
    }

    const request = new PaymentRequest(supportedInstruments, details, options)

    request.show()
        .then(next)
        .catch((newError) => {
            console.log(newError.message)
            store.dispatch(setError(newError.message))
        })
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
