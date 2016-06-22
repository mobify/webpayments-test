import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

let error = null
let result = null

let paymentMethods = [
    {name: 'Visa', value: 'visa', active: true},
    {name: 'MasterCard', value: 'mastercard', active: false},
    {name: 'American Express', value: 'amex', active: true}
]

const onChange = (idx) => {
    paymentMethods[idx].active = !paymentMethods[idx].active
    console.log(paymentMethods)
    render()
}

const onInitiate = () => {
    result = null
    if (!('PaymentRequest' in window)) {
        error = 'Payment Request not supported, must have Chrome Dev with chrome://flags/#enable-experimental-web-platform-features enabled'
        render()
        return
    }
    let supportedInstruments = [{
        supportedMethods: paymentMethods.reduce((arr, method) => {
            if (method.active) {
                arr.push(method.value)
            }
            return arr
        }, [])
    }]
    console.log(supportedInstruments)

    let details = {
        total: {label: 'Test total', amount: {currency: 'CAD', value: '10.50'}}
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
    ReactDOM.render(<App onInitiate={onInitiate} error={error} result={result} paymentMethods={paymentMethods} onChange={onChange} />, document.getElementById('root'));
}
render()
