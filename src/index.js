import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'

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

const result = (state = null, action) => {
    switch (action.type) {
        case 'SET_RESULT':
            return action.details
        case 'SET_ERROR':
            return null
        default:
            return state
    }
}

let store = createStore(
    combineReducers({
        paymentMethods,
        details,
        error,
        result
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
    let supportedInstruments = [{
        supportedMethods: store.getState().paymentMethods.reduce((arr, method) => {
            if (method.active) {
                arr.push(method.value)
            }
            return arr
        }, [])
    }]

    const detailDigest = store.getState().details.reduce((digest, {key, value}) => {
        digest[key] = value
        return digest
    }, {})

    let details = {
        total: {label: detailDigest.label, amount: {currency: detailDigest.currency, value: detailDigest.value}}
    }

    let request = new PaymentRequest(supportedInstruments, details)

    request.show().then((response) => {
        response.complete()
            .then(() => {
                console.log(response)
                store.dispatch({
                    type: 'SET_RESULT',
                    details: response.details
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
