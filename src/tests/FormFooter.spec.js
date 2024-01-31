import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FormFooter from '@/components/FormFooter.vue'

const mockData = {
  success: true,
  data: {
    footer: {
      en: 'Footer Text'
    }
  }
}

describe('FormFooter', () => {
  it('renders footer text from JSON data', () => {
    const footerText = mockData.data.footer.en
    const wrapper = mount(FormFooter, {
      props: { footerText }
    })

    expect(wrapper.text()).toContain(footerText)
  })
})
