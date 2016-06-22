import React, { Component } from 'react';

const PaymentMethod = ({name, value, active, onChange}) => {
    return (
        <li>
            <label>
                {name}
                <input type='checkbox' checked={active} onChange={onChange} />
            </label>
        </li>
    )
}

const PaymentMethodSelector = ({methods, onChange}) => {
    return (
        <div>
            <h2>Select Payment Method:</h2>
            <ul>
                {methods.map((method, idx) => <PaymentMethod key={idx} {...method} onChange={onChange.bind(null, idx)} />)}
            </ul>
        </div>
    )
}

const AmountEditorItem = ({label, value, onChange}) => {
    return (
        <li>
            <label>
                {label}
                <input type='text' onChange={onChange} value={value} style={{'margin-left': "0.5em"}}/>
            </label>
        </li>
    )
}


const AmountEditor = ({details, onChange}) => {
    return (
        <div>
            <h2>Specify amount:</h2>
            <ul>
                {details.map((detail, idx) =>
                <AmountEditorItem key={idx} {...detail} onChange={onChange.bind(null, idx)} />)}
        </ul>
        </div>
    )
}

const PaymentRequestor = ({onInitiate}) => {
    return (
        <button onClick={onInitiate}>Initiate Request</button>
    )
}

const ErrorDisplay = ({error}) => {
    return (
        <div style={{border: '1px solid red', color: 'red', margin: '1em', padding: '1em'}}>
            {error}
        </div>
    )
}

const ResultDisplay = ({cardholderName, cardNumber, expiryMonth, expiryYear, cardSecurityCode}) => {
    return (
        <div style={{border: '1px solid green', margin: '1em', padding: '1em'}}>
            <ul>
                <li>Cardholder Name: {cardholderName}</li>
                <li>Card Number: {cardNumber}</li>
                <li>Expiry: {expiryMonth}/{expiryYear}</li>
                <li>CVV: {cardSecurityCode}</li>
            </ul>
        </div>
    )
}

const App = ({onInitiate, error, result, paymentMethods, details, onChange, onDetailChange}) => {
    return (
        <div>
            <h1>Web Payments Test</h1>
            <PaymentMethodSelector methods={paymentMethods} onChange={onChange} />
            <AmountEditor details={details} onChange={onDetailChange} />
            <PaymentRequestor onInitiate={onInitiate}/>
            {error && <ErrorDisplay error={error} />}
            {result && <ResultDisplay {...result} />}
        </div>
    )
}



export default App
