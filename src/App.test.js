import test from 'ava'
import React from 'react'
import {shallow} from 'enzyme'
import sinon from 'sinon'

import {AmountEditorItem} from './App'

test('AmountEditorItem: includes the label value in a label', (t) => {
    const wrapper = shallow(<AmountEditorItem label="Amount!" />)

    t.true(wrapper.find('label').text().includes('Amount!'))
})
