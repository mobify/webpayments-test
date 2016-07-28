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

const buildShippingDetails = (shippingOptions, currency) => {
    return shippingOptions.map(({id, label, value}) => {
        return {
            ...buildAmount(label, currency, value),
            id
        }
    })
}

const getCurrentShipping = ({shippingOptions}) => {
    if (!shippingOptions) {
        return null
    }

    return shippingOptions.reduce((last, current) => {
        return current.selected ? current : last
    })
}

const calculateTotal = (details, currency) => {
    const {displayItems} = details

    details.total = buildAmount(
        'Total',
        currency,
        displayItems.map(({amount: {value}}) => parseFloat(value))
            .reduce((a, b) => a + b, 0)
    )
    return details
}

const buildDetails = ({subtotal, currency, shippingOptions}) => {
    let details = {}

    if (shippingOptions && shippingOptions.length > 0) {
        details.shippingOptions = buildShippingDetails(shippingOptions, currency)
        details.shippingOptions[0].selected = true
    }

    details.displayItems = [
        buildAmount('Subtotal', currency, subtotal)
    ]

    if (details.shippingOptions) {
        details.displayItems.push(getCurrentShipping(details))
    }

    details = calculateTotal(details, currency)

    return details
}

export const buildRequest = (data, options) => {
    const request = new PaymentRequest(buildInstruments(data), buildDetails(data), options)

    request.addEventListener('shippingoptionchange', (evt) => {
        // evt.updateWith(
    })

    return request
}

export const performRequest = (request, successHandler, failHandler) => {
    return request.show()
        .then(successHandler)
        .catch(failHandler)
}
