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


let ShippingOptions = ({free, onChange}) => {
    return (
        <div>
            <h2>Shipping Options</h2>
            <label>
                Free Shipping
                <input type='checkbox' checked={free} onChange={() => onChange('free')} />
            </label>
        </div>
    )
}

ShippingOptions = connect(
    ({shipping}) => {
        return {...shipping}
    },
    (dispatch) => {
        return {
            onChange: (flag) => {
                dispatch({
                    type: "FLIP_SHIPPING_FLAG",
                    flag
                })
            }
        }
    }
)(ShippingOptions)


const PaymentRequestor = ({onInitiate}) => {
    return (
        <button onClick={onInitiate}>Initiate Request</button>
    )
}

let ErrorDisplay = ({error}) => {
    if (error === null) {
        return null
    }

    return (
        <div style={{border: '1px solid red', color: 'red', margin: '1em', padding: '1em'}}>
            {error}
        </div>
    )
}

ErrorDisplay = connect(({error}) => {
    return {
        error
    }
})(ErrorDisplay)

let DetailsDisplay = ({cardholderName, cardNumber, expiryMonth, expiryYear, cardSecurityCode}) => {
    return (
        <ul>
            <li>Cardholder Name: {cardholderName}</li>
            <li>Card Number: {cardNumber}</li>
            <li>Expiry: {expiryMonth}/{expiryYear}</li>
            <li>CVV: {cardSecurityCode}</li>
        </ul>
    )
}

const AddressDisplay = ({recipient, addressLine, city, region, country, postalCode}) => {
    return (
        <ul>
            <li>Shipping Recipient: {recipient}</li>
            <li>Address: {addressLine.join(' ')}</li>
            <li>City: {city}</li>
            <li>Region: {region}</li>
            <li>Postal Code: {postalCode}</li>
            <li>Country: {country}</li>
        </ul>
    )
}


let ResultDisplay = ({details, address}) => {
    if (!details && !address) {
        return null
    }
    return (
        <div style={{border: '1px solid green', margin: '1em', padding: '1em'}}>
            <DetailsDisplay {...details} />
            <hr />
            {address && <AddressDisplay {...address} />}
        </div>
    )
}

ResultDisplay = connect(
    ({result: {details, address}}) => {
        return {
            details,
            address
        }
    }
)(ResultDisplay)

const App = ({onInitiate}) => {
    return (
        <div>
            <h1>Web Payments Test</h1>
            <PaymentMethodSelector />
            <AmountEditor />
            <ShippingOptions />
            <PaymentRequestor onInitiate={onInitiate}/>
            <ErrorDisplay />
            <ResultDisplay />
        </div>
    )
}



export default App
