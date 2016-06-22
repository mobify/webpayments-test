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
    render()
}

let detailItems = [
    {label: 'Description', value: 'Test Total', key: 'label'},
    {label: 'Currency', value: 'CAD', key: 'currency'},
    {label: 'Amount', value: '10.50', key: 'value'}
]

const onDetailChange = (idx, {target}) => {
    detailItems[idx].value = target.value
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

    const detailDigest = detailItems.reduce((digest, {key, value}) => {
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
    ReactDOM.render(<App onInitiate={onInitiate} error={error} result={result} paymentMethods={paymentMethods} onChange={onChange} details={detailItems} onDetailChange={onDetailChange} />, document.getElementById('root'));
}
render()
