import test from 'ava'

import * as Reducers from './reducers'
import * as _ from 'underscore'
import {List, Map, fromJS, is} from 'immutable'

test('paymentMethods: toggleMethod toggles a method', t => {
    t.true(is(
        Reducers.paymentMethods(
            fromJS([{
                name: 'Test',
                value: 'text',
                options: {},
                active: false
            }]),
            {
                type: 'TOGGLE_METHOD',
                index: 0
            }
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
            {
                type: 'TOGGLE_METHOD',
                index: 0
            }
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
            {
                type: 'SET_DETAIL_VALUE',
                index: 1,
                value: 'new_test'
            }
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

test('error: sets string with SET_ERROR', (t) => {
    t.is(
        Reducers.error('input', {
            type: 'SET_ERROR',
            error: 'output'
        }),
        'output'
    )
})

test('error: clears string on SET_RESULT', (t) => {
    t.is(
        Reducers.error('input', {type: 'SET_RESULT'}),
        null
    )
})
