import React, { Component } from 'react';

const PaymentMethodSelector = () => {
    return (
        <div>
            <h2>Select Payment Method:</h2>
            <p>visa, mastercard, amex</p>
        </div>
    )
}

const AmountEditor = () => {
    return (
        <div>
            <h2>Specify amount:</h2>
            <p> 10.50 CAD</p>
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

const App = ({onInitiate, error}) => {
    return (
        <div>
            <h1>Web Payments Test</h1>
            <PaymentMethodSelector />
            <AmountEditor />
            <PaymentRequestor onInitiate={onInitiate}/>
            {error && <ErrorDisplay error={error} />}
        </div>
    )
}



export default App
