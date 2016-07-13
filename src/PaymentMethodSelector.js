import React from 'react'
import {connect} from 'react-redux'

import {toggleMethod} from './actions'

const PaymentMethod = ({name, active, onChange}) => {
    return (
        <li>
            <label>
                {name}
                <input type="checkbox" checked={active} onChange={onChange} />
            </label>
        </li>
    )
}

let PaymentMethodSelector = ({methods, onChange}) => {
    return (
        <div>
            <h2>Select Payment Method:</h2>
            <ul>
                {methods.map((method, idx) =>
                    <PaymentMethod key={idx} {...method} onChange={() => { onChange(idx) }} />)}
            </ul>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        methods: state.paymentMethods.toJS()
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onChange: (idx) => {
            dispatch(toggleMethod(idx))
        }
    }
}

PaymentMethodSelector = connect(mapStateToProps, mapDispatchToProps)(PaymentMethodSelector)

export default PaymentMethodSelector
