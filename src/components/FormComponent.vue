<template>
  <form @submit.prevent="submit" class="form-main">
    <FormField v-for="field in fields" :key="field.id" :fieldData="field" :attributeLabelColor="attributeLabelColor"
      :errors="errors" @fileUpload="handleFileUpload" @update-value="handleValueUpdate" />
    <FormSubmitButton :buttonText="submitButtonLabel" :buttonColor="submitButtonColor" />
  </form>
</template>
  
<script>
import { validateField } from '../helpers/formValidation';
import FormField from './FormField.vue';
import FormSubmitButton from './FormSubmitButton.vue';

export default {
  components: {
    FormField,
    FormSubmitButton,
  },
  props: ['fields', 'attributeLabelColor', 'errors', 'submitButtonLabel', 'submitButtonColor'],
  methods: {
    handleFileUpload(event, fieldData) {
      const file = event.target.files[0];
      this.$emit('update-field', { fieldData, file });
    },
    collectErrors() {
      const allErrors = {};
      this.fields.forEach(field => {
        const fieldErrors = validateField(field);
        if (fieldErrors.length) {
          allErrors[field.code] = fieldErrors;
        }
      });
      return allErrors;
    },
    submit() {
      const collectedErrors = this.collectErrors();

      this.$emit('update-errors', collectedErrors);

      if (Object.keys(collectedErrors).length === 0) {
        // No errors, proceed with form submission
        const enteredValues = this.fields.map(field => `${field.name.en}: ${field.value}`);
        alert(`${this.jsonData.data.submit_success_content}\n Entered Values:\n${enteredValues.join('\n')}`);
      }
    },
    handleValueUpdate({ id, value }) {
      this.$emit('update-field-value', { id, value });
    }

  },
};
</script>
  
<style scoped>
.form-main {
  padding: 1.5rem;
}
</style>
  