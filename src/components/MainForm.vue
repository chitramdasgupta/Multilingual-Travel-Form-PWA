<template>
  <div>
    <div v-if="jsonData" :style="{ backgroundColor: jsonData.data.background_color }" class="container">
      <FormHeader :jsonData="jsonData" :language="language" @languageChanged="updateLanguage" />
      <main :style="{ backgroundColor: jsonData.data.form_background_color }" class="main">
        <FormComponent :fields="fields" :attributeLabelColor="jsonData.data.attribute_label_color" :errors="errors"
          :submitButtonLabel="jsonData.data.submit_button_label"
          :submitButtonColor="jsonData.data.form_submit_button_color" @update-field="handleFieldUpdate"
          @update-errors="errors = $event" />
      </main>
      <FormFooter :footerText="jsonData.data.footer[language] || jsonData.data.footer.en" />
    </div>
  </div>
</template>

<script>
import FormHeader from './FormHeader.vue';
import FormComponent from './FormComponent.vue'
import FormFooter from './FormFooter.vue';

export default {
  components: {
    FormHeader,
    FormComponent,
    FormFooter,
  },
  data() {
    return {
      jsonData: null,
      fields: [],
      language: 'en',
      languageNames: {
        en: 'English',
        hi: 'Hindi',
        gj: 'Gujarati',
        ka: 'Kannada',
        mt: 'Marathi',
        tm: 'Tamil',
        tl: 'Telugu'
      },
      errors: {},
    }
  },

  mounted() {
    this.fetchJsonData()
  },

  methods: {
    async fetchJsonData() {
      try {
        const response = await fetch('/src/data.json')
        if (!response.ok) {
          throw new Error('Failed to fetch JSON data')
        }
        this.jsonData = await response.json()

        this.fields = this.jsonData.data.attributes.map((field) => {
          const baseField = {
            id: field.id,
            name: field.name[this.language],
            type: field.type,
            code: field.code,
            placeholder: field.placeholder[this.language],
            value: '',
            is_required: field.is_required
          }

          if (field.type === 'select') {
            return { ...baseField, options: field.options }
          }

          return baseField
        })
      } catch (error) {
        console.error('Error fetching JSON data:', error.message)
      }
    },

    updateLanguage(newLanguage) {
      this.language = newLanguage;
      this.fields = this.fields.map(field => {
        return {
          ...field,
          name: this.jsonData.data.attributes.find(attr => attr.id === field.id).name[this.language],
          placeholder: this.jsonData.data.attributes.find(attr => attr.id === field.id).placeholder[this.language]
        };
      });
    },

    changeLanguage() {
      this.fetchJsonData()
    },

    handleFieldUpdate({ fieldData, file }) {
      this.fields = this.fields.map(field => {
        if (field.id === fieldData.id) {
          return { ...field, value: file };
        }
        return field;
      });
    },
  }
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main {
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}

@media (min-width: 768px) {
  .main {
    width: 750px;
  }
}

.error-message {
  color: red;
}
</style>
