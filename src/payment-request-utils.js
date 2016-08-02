export const roundPrice = (price, places = 2) => {
    const factor = Math.pow(10, places)
    return Math.round(price * factor) / factor
}

export const buildAmount = (label, currency, value) => {
    value = `${value}`
    return {
        label,
        amount: {currency, value}
    }
}

export const processAddress = (address) => {
    return {
        city: address.city,
        region: address.region,
        postalCode: address.postalCode,
        country: address.country
    }
}
