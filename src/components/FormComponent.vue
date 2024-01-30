<template>
  <form @submit.prevent="submit" class="form-main">
    <FormField v-for="field in fields" :key="field.id" :fieldData="field" :attributeLabelColor="attributeLabelColor"
      :errors="errors" @fileUpload="handleFileUpload" @update-value="handleValueUpdate" />
    <FormSubmitButton :buttonText="submitButtonLabel" :buttonColor="submitButtonColor" />
  </form>
</template>
  
<script>
import FormField from './FormField.vue';
import FormSubmitButton from './FormSubmitButton.vue';

export default {
  components: {
    FormField,
    FormSubmitButton,
  },
  props: ['fields', 'attributeLabelColor', 'errors', 'submitButtonLabel', 'submitButtonColor'],
  methods: {
    // validation methods
    validateDateOfBirth(date) {
      const selectedDate = new Date(date);
      const currentDate = new Date();

      return selectedDate > currentDate;
    },

    validatePANCardNumber(panNumber) {
      return panNumber.length === 10;
    },

    validatePincode(pincode) {
      const pincodeRegex = /^\d{6}$/;
      return pincodeRegex.test(pincode);
    },

    validateFileSize(file) {
      const maxFileSize = 5 * 1024 * 1024;
      return file.size <= maxFileSize;
    },
    handleFileUpload(event, fieldData) {
      const file = event.target.files[0];
      this.$emit('update-field', { fieldData, file });
    },


    submit() {
      let localErrors = { ...this.errors };

      localErrors = {};

      // Check for empty required fields
      this.fields.forEach(field => {
        if (field.is_required === 1 && !field.value) {
          if (!localErrors[field.code]) {
            localErrors[field.code] = [];
          }
          localErrors[field.code].push('Please fill this field.');
        }
      });

      // Validate date_of_birth field
      if (this.fields.some(field => field.code === "date_of_birth" && this.validateDateOfBirth(field.value))) {
        if (!localErrors.date_of_birth) {
          localErrors.date_of_birth = [];
        }
        localErrors.date_of_birth.push('Date of birth cannot be in the future.');
      }

      // Validate pan_card_number field
      if (this.fields.some(field => field.code === "pan_card_number" && !this.validatePANCardNumber(field.value))) {
        if (!localErrors.pan_card_number) {
          localErrors.pan_card_number = [];
        }
        localErrors.pan_card_number.push('Invalid PAN (must be 10 characters).');
      }

      // Validate pincode field
      if (this.fields.some(field => field.code === "pincode" && !this.validatePincode(field.value))) {
        if (!localErrors.pincode) {
          localErrors.pincode = [];
        }
        localErrors.pincode.push('Invalid pincode (must be 6 digits).');
      }

      // Validate passport issue date field
      if (this.fields.some(field => field.code === "passport_issue_date" && this.validateDateOfBirth(field.value))) {
        if (!localErrors.passport_issue_date) {
          localErrors.passport_issue_date = [];
        }
        localErrors.passport_issue_date.push('Passport issue date cannot be in the future.');
      }

      // Validate passport expiry date field
      if (this.fields.some(field => field.code === "passport_expiry_date" && !this.validateDateOfBirth(field.value))) {
        if (!localErrors.passport_expiry_date) {
          localErrors.passport_expiry_date = [];
        }
        localErrors.passport_expiry_date.push('Expired passport is not accepted.');
      }

      // Validate file input fields
      this.fields.forEach(field => {
        if (field.type === 'file' && field.value && !this.validateFileSize(field.value)) {
          if (!localErrors[field.code]) {
            localErrors[field.code] = [];
          }
          localErrors[field.code].push('File size must be less than or equal to 5 MB.');
        }
      });

      this.$emit('update-errors', localErrors);

      if (Object.keys(localErrors).length === 0) {
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
  