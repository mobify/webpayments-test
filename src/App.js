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

const ResultDisplay = ({result}) => {
    return (
        <div style={{border: '1px solid green', margin: '1em', padding: '1em'}}>
            {JSON.stringify(result, null, 4)}
        </div>
    )
}

const App = ({onInitiate, error, result, paymentMethods, onChange}) => {
    return (
        <div>
            <h1>Web Payments Test</h1>
            <PaymentMethodSelector methods={paymentMethods} onChange={onChange} />
            <AmountEditor />
            <PaymentRequestor onInitiate={onInitiate}/>
            {error && <ErrorDisplay error={error} />}
            {result && <ResultDisplay result={result} />}
        </div>
    )
}



export default App
