import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

let error = null

const onInitiate = () => {
    if (!('PaymentRequest' in window)) {
        error = "Payment Request not supported, must have Chrome Dev with chrome://flags/#enable-experimental-web-platform-features enabled"
        render()
        return
    }
    let supportedInstruments = [{
        supportedMethods: [
            'visa',
            'mastercard',
            'amex'
        ]
    }]

    let details = {
        total: {label: 'Test total', amount: {currency: 'CAD', value: '10.50'}}
    }

    let request = new PaymentRequest(supportedInstruments, details)

    request.show().then((response) => {
        response.complete()
            .then(() => {
                console.log(response)
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
    ReactDOM.render(<App onInitiate={onInitiate} error={error} />, document.getElementById('root'));
}
render()
