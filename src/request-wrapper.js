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

const buildDetails = ({subtotal, currency}) => {
    let details = {}

    details.displayItems = [
        buildAmount('Subtotal', currency, subtotal)
    ]

    details = calculateTotal(details, currency)

    return details
}

export const buildRequest = (data, details, options) => {
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
