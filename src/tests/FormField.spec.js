import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FormField from '@/components/FormField.vue'

describe('FormField', () => {
  const mockFieldData = {
    code: 'testField',
    name: 'Test Field',
    type: 'text',
    placeholder: 'Enter Text',
    value: '',
    is_required: 1,
    options: [{ id: '1', name: 'Option 1' }]
  }

  it('renders the label with correct text and color', () => {
    const attributeLabelColor = 'blue'
    const wrapper = mount(FormField, {
      props: { fieldData: mockFieldData, attributeLabelColor, errors: {} }
    })
    const label = wrapper.find('label')
    expect(label.text()).toContain(mockFieldData.name)
    expect(label.attributes('style')).toContain(`color: ${attributeLabelColor}`)
  })

  it('renders required field indicator for required fields', () => {
    const wrapper = mount(FormField, {
      props: { fieldData: mockFieldData, attributeLabelColor: 'blue', errors: {} }
    })
    const requiredIndicator = wrapper.find('span').text().includes('*')
    expect(requiredIndicator).toBe(true)
  })

  it('renders error message when there are errors', async () => {
    const errors = { [mockFieldData.code]: ['Error message'] }
    const wrapper = mount(FormField, {
      props: { fieldData: mockFieldData, attributeLabelColor: 'blue', errors }
    })
    expect(wrapper.find('.error-message').text()).toContain('Error message')
  })
})
