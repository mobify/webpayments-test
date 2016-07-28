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

const buildAmount = (label, currency, value) => {
    value = `${value}`
    return {
        label,
        amount: {currency, value}
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
        availableShipping: Object.keys(shipping).length > 1 ? undefined : Object.keys(shipping)
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

const processAddress = (address) => {
    return {
        city: address.city,
        region: address.region,
        postalCode: address.postalCode,
        country: address.country
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
        state = {
            ...state,
            currentShipping: request.shippingOption
        }
        evt.updateWith(Promise.resolve(produceDetails(input, state)))
    })

    request.addEventListener('shippingaddresschange', (evt) => {
        const addressInfo = processAddress(request.shippingAddress)
        state = {
            ...state,
            addressInfo,
            availableShipping: availableShippingMethods(input, addressInfo)
        }
        console.log(state)
        evt.updateWith(Promise.resolve(produceDetails(input, state)))
    })

    return request
}

export const performRequest = (request, successHandler, failHandler) => {
    return request.show()
        .then(successHandler)
        .catch(failHandler)
}
