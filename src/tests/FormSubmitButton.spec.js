import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FormSubmitButton from '@/components/FormSubmitButton.vue'
import tinycolor from 'tinycolor2'

const mockJsonData = {
  data: {
    submit_button_label: 'Secure Travel Reservations',
    form_submit_button_color: '#0E90D9'
  }
}

describe('FormSubmitButton', () => {
  it('renders button text based on json data', () => {
    const wrapper = mount(FormSubmitButton, {
      props: {
        buttonText: mockJsonData.data.submit_button_label,
        buttonColor: mockJsonData.data.form_submit_button_color
      }
    })
    expect(wrapper.text()).toContain(mockJsonData.data.submit_button_label)
  })

  it('applies the correct style based on json data', () => {
    const wrapper = mount(FormSubmitButton, {
      props: {
        buttonText: mockJsonData.data.submit_button_label,
        buttonColor: mockJsonData.data.form_submit_button_color
      }
    })

    const button = wrapper.find('button')
    const expectedColor = tinycolor(mockJsonData.data.form_submit_button_color).toRgbString()
    expect(button.attributes('style')).toContain(`background-color: ${expectedColor}`)
  })
})
