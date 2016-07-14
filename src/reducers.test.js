import test from 'ava'

import * as Actions from './actions'
import * as Reducers from './reducers'
import {fromJS, is} from 'immutable'

test('paymentMethods: toggleMethod toggles a method', (t) => {
    t.true(is(
        Reducers.paymentMethods(
            fromJS([{
                name: 'Test',
                value: 'text',
                options: {},
                active: false
            }]),
            Actions.toggleMethod(0)
        ),
        fromJS([{
            name: 'Test',
            value: 'text',
            options: {},
            active: true
        }])
    ))

    t.true(is(
        Reducers.paymentMethods(
            fromJS([{
                name: 'Test',
                value: 'text',
                options: {},
                active: true
            }]),
            Actions.toggleMethod(0)
        ),
        fromJS([{
            name: 'Test',
            value: 'text',
            options: {},
            active: false
        }])
    ))
})

test('details: SET_DETAIL_VALUE works', (t) => {
    t.true(is(
        Reducers.details(
            fromJS([
                {},
                {
                    label: 'Test',
                    value: 'testing',
                    key: 'test'
                }
            ]),
            Actions.setDetailValue(1, 'new_test')
        ),
        fromJS([
            {},
            {
                label: 'Test',
                value: 'new_test',
                key: 'test'
            }
        ])
    ))
})

test('error: initial state is null', (t) => {
    t.is(
        Reducers.error(undefined, {}),
        null
    )
})

test('error: sets string when error set', (t) => {
    t.is(
        Reducers.error('input', Actions.setError('output')),
        'output'
    )
})

test('error: clears string when result set', (t) => {
    t.is(
        Reducers.error('input', Actions.setResult({})),
        null
    )
})

test('shipping: flips flag correctly', (t) => {
    t.true(is(
        Reducers.shipping(
            fromJS({thing: true, otherThing: false}),
            Actions.flipShippingFlag('thing')
        ),
        fromJS({thing: false, otherThing: false})
    ))

    t.true(is(
        Reducers.shipping(
            fromJS({thing: true, otherThing: false}),
            Actions.flipShippingFlag('otherThing')
        ),
        fromJS({thing: true, otherThing: true})
    ))
})

test('misc: flips flag correctly', (t) => {
    t.true(is(
        Reducers.misc(
            fromJS({thing: true, otherThing: false}),
            Actions.flipMiscFlag('thing')
        ),
        fromJS({thing: false, otherThing: false})
    ))

    t.true(is(
        Reducers.misc(
            fromJS({thing: true, otherThing: false}),
            Actions.flipMiscFlag('otherThing')
        ),
        fromJS({thing: true, otherThing: true})
    ))
})
