import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'

let error = null
let result = null

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

let store = createStore(
    combineReducers({
        paymentMethods,
        details
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
    result = null
    if (!('PaymentRequest' in window)) {
        error = 'Payment Request not supported, must have Chrome Dev with chrome://flags/#enable-experimental-web-platform-features enabled'
        render()
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
                result = response.details
                error = null
                render()
            })
    }).catch((newError) => {
        console.log(newError.message)
        error = newError.message
        render()
    })
}

let render = () => {
    ReactDOM.render(
            <Provider store={store}>
            <App onInitiate={onInitiate} error={error} result={result} />
            </Provider>, document.getElementById('root'));
}
render()
