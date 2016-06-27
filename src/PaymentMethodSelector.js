import React from 'react'
import { connect } from 'react-redux'

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

let PaymentMethodSelector = ({methods, onChange}) => {
    return (
        <div>
            <h2>Select Payment Method:</h2>
            <ul>
                {methods.map((method, idx) => <PaymentMethod key={idx} {...method} onChange={() => {onChange(idx)}} />)}
            </ul>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        methods: state.paymentMethods
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onChange: (idx) => {
            dispatch({
                type: 'TOGGLE_METHOD',
                index: idx
            })
        }
    }
}

PaymentMethodSelector = connect(mapStateToProps, mapDispatchToProps)(PaymentMethodSelector)

export default PaymentMethodSelector
