import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FormHeader from '@/components/FormHeader.vue'

const mockJsonData = {
  data: {
    form_name: 'Sample Form',
    banner: 'sample-banner-url.jpg',
    languages: ['en', 'hi'],
    header: {
      en: 'Header Text EN',
      hi: 'Header Text HI'
    }
  }
}

describe('FormHeader', () => {
  it('renders the header text from jsonData', () => {
    const wrapper = mount(FormHeader, {
      props: { jsonData: mockJsonData, language: 'en' }
    })
    expect(wrapper.find('.heading').text()).toBe(mockJsonData.data.form_name)
  })

  it('renders the banner image with correct src', () => {
    const wrapper = mount(FormHeader, {
      props: { jsonData: mockJsonData, language: 'en' }
    })
    const image = wrapper.find('.banner')
    expect(image.attributes('src')).toBe(mockJsonData.data.banner)
  })

  it('populates the language dropdown correctly and responds to changes', async () => {
    const wrapper = mount(FormHeader, {
      props: { jsonData: mockJsonData, language: 'en' }
    })
    const select = wrapper.find('#languageSelect')
    expect(select.element.options.length).toBe(mockJsonData.data.languages.length)

    await select.setValue('hi')
    expect(wrapper.emitted('languageChanged')[0]).toEqual(['hi'])
  })
})
