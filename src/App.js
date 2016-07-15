import React from 'react'
import {connect} from 'react-redux'
import PaymentMethodSelector from './PaymentMethodSelector'
import {setDetailValue, flipShippingFlag, flipMiscFlag} from './actions'

/**
 * The UI components for the demo app.
 */

export const AmountEditorItem = ({label, value, onChange}) => {
    return (
        <li>
            <label>
                {label}
                <input
                    type="text"
                    onChange={onChange}
                    value={value}
                    style={{marginLeft: '0.5em'}}
                />
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
                    <AmountEditorItem
                        key={idx}
                        {...detail}
                        onChange={({target}) => onChange(idx, target)}
                    />)}
            </ul>
        </div>
    )
}

AmountEditor = connect(
    ({details}) => {
        return {
            details: details.toJS()
        }
    },
    (dispatch) => {
        return {
            onChange: (idx, target) => {
                dispatch(
                    setDetailValue(idx, target.value)
                )
            }
        }
    }
)(AmountEditor)


let ShippingOptions = ({free, paid, onChange}) => {
    return (
        <div>
            <h2>Shipping Options</h2>
            <ul>
                <li>
                    <label>
                        Free Shipping
                        <input type="checkbox" checked={free} onChange={() => onChange('free')} />
                    </label>
                </li>
                <li>
                    <label>
                        Paid Shipping ($5.00)
                        <input type="checkbox" checked={paid} onChange={() => onChange('paid')} />
                    </label>
                </li>
            </ul>
        </div>
    )
}

ShippingOptions = connect(
    ({shipping}) => {
        return shipping.toJS()
    },
    (dispatch) => {
        return {
            onChange: (flag) => {
                dispatch(flipShippingFlag(flag))
            }
        }
    }
)(ShippingOptions)

const MiscOptions = connect(
    ({misc}) => {
        return misc.toJS()
    },
    (dispatch) => {
        return {
            onChange: (flag) => {
                dispatch(flipMiscFlag(flag))
            }
        }
    }
)(({email, phone, onChange}) => {
    return (
        <div>
            <ul>
                <li>
                    <label>
                        Prompt for email
                        <input type="checkbox" checked={email} onChange={() => onChange('email')} />
                    </label>
                </li>
                <li>
                    <label>
                        Prompt for phone number
                        <input type="checkbox" checked={phone} onChange={() => onChange('phone')} />
                    </label>
                </li>
            </ul>
        </div>
    )
})

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


let ResultDisplay = ({details, address, email, phone}) => {
    if (!details && !address) {
        return null
    }
    return (
        <div style={{border: '1px solid green', margin: '1em', padding: '1em'}}>
            <DetailsDisplay {...details} />
            <hr />
            {address && <AddressDisplay {...address} />}
            <hr />
            {email && <p>User Email: {email}</p>}
            {phone && <p>User Phone: {phone}</p>}
        </div>
    )
}

ResultDisplay = connect(
    ({result}) => {
        return {
            ...result
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
            <hr />
            <MiscOptions />
            <PaymentRequestor onInitiate={onInitiate} />
            <ErrorDisplay />
            <ResultDisplay />
        </div>
    )
}



export default App
