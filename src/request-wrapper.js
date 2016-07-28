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

const buildAmount = (label, currency, value) => {
    value = `${value}`
    return {
        label,
        amount: {currency, value}
    }
}

const initialState = ({shipping}) => {
    if (!shipping) {
        return {}
    }
    return {
        currentShipping: Object.keys(shipping).filter((id) => shipping[id].default)[0],
        availableShipping: Object.keys(shipping)
    }
}

const produceDetails = (
    {currency, subtotal, shipping},
    {currentShipping, availableShipping}
) => {
    const total = subtotal + (currentShipping ? shipping[currentShipping].cost : 0)

    return {
        displayItems: [
            buildAmount('Subtotal', currency, subtotal)
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

export const buildRequest = (input, options) => {
    let state = initialState(input)

    const details = produceDetails(input, state)
    console.log(details)
    console.log(state)

    const request = new PaymentRequest(
        buildInstruments(input),
        details,
        options
    )

    request.addEventListener('shippingoptionchange', (evt) => {
        state = {
            ...state,
            currentShipping: request.shippingOption
        }
        evt.updateWith(Promise.resolve(produceDetails(input, state)))
    })

    return request
}

export const performRequest = (request, successHandler, failHandler) => {
    return request.show()
        .then(successHandler)
        .catch(failHandler)
}
