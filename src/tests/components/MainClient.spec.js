import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MainClient from '@/components/MainClient.vue'
import FormHeader from '@/components/FormHeader.vue'
import FormComponent from '@/components/FormComponent.vue'
import FormFooter from '@/components/FormFooter.vue'

describe('MainClient', () => {
  it('does not render container when jsonData is null', () => {
    const wrapper = mount(MainClient)
    expect(wrapper.find('.container').exists()).toBe(false)
  })

  it('renders container and child components when jsonData is fetched', async () => {
    const mockJsonData = {
      success: true,
      data: {
        id: 1,
        form_name: 'Tripraasa Group Journey Passport Submission',
        languages: ['en', 'hi', 'gj', 'ka', 'mt', 'tm', 'tl'],
        banner: 'Sample Banner Image URL',
        add_member: 1,
        header: {
          en: 'Header Text',
          hi: 'शीर्ष-सूचना पाठ'
        },
        footer: {
          en: 'Footer Text',
          hi: 'पाद-सूचना पाठ'
        },
        submit_button_label: 'Secure Travel Reservations',
        submit_success_action: 'message',
        submit_success_content: 'Bravo! Your Journey with Tripraasa Begins Now.',
        background_color: '#F7F8F9',
        form_background_color: '#FFFFFF',
        form_submit_button_color: '#0E90D9',
        attribute_label_color: '#546E7A',
        attributes: [
          {
            id: 1,
            code: 'date_of_birth',
            name: {
              en: 'Date Of Birth'
            },
            placeholder: {
              en: 'Select Date Of Birth'
            },
            type: 'date'
          },
          {
            id: 2,
            code: 'gender',
            name: {
              en: 'Gender'
            },
            type: 'select',
            options: [
              {
                id: 1,
                name: 'Male'
              },
              {
                id: 2,
                name: 'Female'
              }
            ]
          }
        ]
      },
      message: 'Web form Updated successfully'
    }

    const wrapper = mount(MainClient)

    await wrapper.setData({ jsonData: mockJsonData })
    expect(wrapper.find('.container').exists()).toBe(true)
    expect(wrapper.findComponent(FormHeader).exists()).toBe(true)
    expect(wrapper.findComponent(FormComponent).exists()).toBe(true)
    expect(wrapper.findComponent(FormFooter).exists()).toBe(true)
  })
})
