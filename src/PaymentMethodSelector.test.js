import test from 'ava'
import React from 'react'
import {shallow} from 'enzyme'
import sinon from 'sinon'

import {PaymentMethod, PaymentMethodSelectorComponent} from './PaymentMethodSelector'

test('PaymentMethod: is a list element', (t) => {
    const wrapper = shallow(<PaymentMethod />)

    t.true(wrapper.is('li'))
})

test('PaymentMethod: renders name', (t) => {
    const wrapper = shallow(<PaymentMethod name="test" />)

    t.true(wrapper.text().includes('test'))
})

test('PaymentMethod: includes checkbox in correct state', (t) => {
    let wrapper = shallow(<PaymentMethod active={true} />)
    let inputElements = wrapper.find('input')

    t.is(inputElements.length, 1)
    let input = inputElements.first()
    t.is(input.prop('type'), 'checkbox')
    t.true(input.prop('checked'))

    wrapper = shallow(<PaymentMethod active={false} />)
    inputElements = wrapper.find('input')
    t.is(inputElements.length, 1)
    input = inputElements.first()
    t.is(input.prop('type'), 'checkbox')
    t.false(input.prop('checked'))
})

test('PaymentMethod: Calls the callback when checkbox clicked', (t) => {
    const mockOnChange = sinon.stub()
    const wrapper = shallow(<PaymentMethod onChange={mockOnChange} />)

    wrapper.find('input').simulate('change')
    t.true(mockOnChange.calledOnce)
})

test('PaymentMethodSelector: Includes a title', (t) => {
    const wrapper = shallow(<PaymentMethodSelectorComponent methods={[]} />)

    t.is(wrapper.find('h2').length, 1)
})

test('PaymentMethodSelector: Includes one PaymentMethod per input method', (t) => {
    let wrapper = shallow(
        <PaymentMethodSelectorComponent methods={[{}, {}]} />
    )
    t.is(wrapper.find(PaymentMethod).length, 2)

    wrapper = shallow(
        <PaymentMethodSelectorComponent methods={[{}]} />
    )
    t.is(wrapper.find(PaymentMethod).length, 1)
})
