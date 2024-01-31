import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FormComponent from '@/components/FormComponent.vue'
import FormField from '@/components/FormField.vue'
import FormSubmitButton from '@/components/FormSubmitButton.vue'

describe('FormComponent', () => {
  it('renders FormField for each field', () => {
    const wrapper = mount(FormComponent, {
      props: {
        fields: [
          { id: 1, name: 'Field1' },
          { id: 2, name: 'Field2' }
        ],
        errors: {}
      },
      global: {
        components: {
          FormField,
          FormSubmitButton
        }
      }
    })
    expect(wrapper.findAllComponents(FormField).length).toBe(2)
  })

  it('renders FormSubmitButton with correct props', () => {
    const submitButtonLabel = 'Submit'
    const submitButtonColor = 'blue'
    const wrapper = mount(FormComponent, {
      props: {
        submitButtonLabel,
        submitButtonColor
      }
    })
    const submitButton = wrapper.findComponent(FormSubmitButton)
    expect(submitButton.props('buttonText')).toBe(submitButtonLabel)
    expect(submitButton.props('buttonColor')).toBe(submitButtonColor)
  })
})
