import React, { Component } from 'react'
import { connect } from 'react-redux'
import PaymentMethodSelector from './PaymentMethodSelector'

const AmountEditorItem = ({label, value, onChange}) => {
    return (
        <li>
            <label>
                {label}
                <input type='text' onChange={onChange} value={value} style={{marginLeft: '0.5em'}}/>
            </label>
        </li>
    )
}


let AmountEditor = ({details, onChange}) => {
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

AmountEditor = connect(
    ({details}) => {
        return {
            details
        }
    },
    (dispatch) => {
        return {
            onChange: (idx, {target}) => {
                dispatch({
                    type: 'SET_DETAIL_VALUE',
                    index: idx,
                    value: target.value
                })
            }
        }
    }
)(AmountEditor)


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

const App = ({onInitiate, error, result}) => {
    return (
        <div>
            <h1>Web Payments Test</h1>
            <PaymentMethodSelector />
            <AmountEditor />
            <PaymentRequestor onInitiate={onInitiate}/>
            {error && <ErrorDisplay error={error} />}
            {result && <ResultDisplay {...result} />}
        </div>
    )
}



export default App
