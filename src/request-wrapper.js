import {roundPrice, buildAmount, processAddress} from './payment-request-utils'

const buildInstruments = ({creditCards, androidPay}) => {
    const supportedInstruments = []

    if (creditCards && creditCards.length > 0) {
        supportedInstruments.push({
            supportedMethods: creditCards
        })
    }

    if (androidPay) {
        supportedInstruments.push({
            supportedMethods: ['https://android.pay/pay'],
            options: androidPay
        })
    }

    if (supportedInstruments.length === 0) {
        throw Error('Must pass at least one payment method')
    }
    return supportedInstruments
}

const buildOptions = ({shipping, needPhone, needEmail}) => {
    return {
        requestShipping: !!shipping,
        requestPayerPhone: needPhone,
        requestPayerEmail: needEmail
    }
}

const availableShippingMethods = ({shipping}, addressInfo) => {
    return Object.keys(shipping)
        .filter((id) => {
            if (!shipping[id].addressPredicate) {
                return true
            }
            return shipping[id].addressPredicate(addressInfo)
        })
}

const initialState = ({shipping}) => {
    if (!shipping) {
        return {}
    }
    return {
        currentShipping: Object.keys(shipping).filter((id) => shipping[id].default)[0],
        availableShipping: Object.keys(shipping).length > 1 ? undefined : Object.keys(shipping),
        taxes: [{label: 'GST', rate: 0.05}, {label: 'PST', rate: 0.075}]
    }
}

const produceDetails = (
    {currency, subtotal, shipping},
    {currentShipping, availableShipping, taxes = []}
) => {
    const taxValueList = taxes.map(({label, rate}) => {
        return {label, cost: roundPrice(subtotal * rate)}
    })

    const total = subtotal +
              (currentShipping ? shipping[currentShipping].cost : 0) +
              taxValueList.reduce((sum, {cost}) => sum + cost, 0)

    return {
        displayItems: [
            buildAmount('Subtotal', currency, subtotal),
            ...(taxValueList.map(({label, cost}) => buildAmount(label, currency, cost)))
        ],
        shippingOptions: availableShipping &&
            availableShipping.map((id) => {
                const {label, cost} = shipping[id]
                return {
                    id,
                    ...buildAmount(label, currency, cost),
                    selected: id === currentShipping
                }
            }),
        total: buildAmount('Total', currency, total)
    }
}

const changeShipping = (state, shipping) => {
    return {
        ...state,
        currentShipping: shipping
    }
}

const changeAddress = (input, state, address) => {
    const addressInfo = processAddress(address)
    return {
        ...state,
        addressInfo,
        availableShipping: availableShippingMethods(input, addressInfo)
    }
}

export const buildRequest = (input) => {
    let state = initialState(input)

    const details = produceDetails(input, state)

    const request = new PaymentRequest(
        buildInstruments(input),
        details,
        buildOptions(input)
    )

    request.addEventListener('shippingoptionchange', (evt) => {
        state = changeShipping(state, request.shippingOption)
        evt.updateWith(Promise.resolve(produceDetails(input, state)))
    })

    request.addEventListener('shippingaddresschange', (evt) => {
        state = changeAddress(input, state, request.shippingAddress)
        evt.updateWith(Promise.resolve(produceDetails(input, state)))
    })

    return request
}

export const performRequest = (request, successHandler, failHandler) => {
    return request.show()
        .then(successHandler)
        .catch(failHandler)
}
