export const toggleMethod = (index) => {
    return {
        type: 'TOGGLE_METHOD',
        index
    }
}

export const setDetailValue = (index, value) => {
    return {
        type: 'SET_DETAIL_VALUE',
        index,
        value
    }
}

export const setError = (error) => {
    return {
        type: 'SET_ERROR',
        error
    }
}

export const setResult = (resultInfo) => {
    return {
        type: 'SET_RESULT',
        ...resultInfo
    }
}

export const flipShippingFlag = (flag) => {
    return {
        type: 'FLIP_SHIPPING_FLAG',
        flag
    }
}

export const flipMiscFlag = (flag) => {
    return {
        type: 'FLIP_MISC_FLAG',
        flag
    }
}
