<template>
  <div>
    <div v-if="jsonData" :style="{ backgroundColor: jsonData.data.background_color }" class="container">
      <div>
        <label for="languageSelect">Select Language: </label>
        <select id="languageSelect" v-model="language" @change="changeLanguage">
          <option v-for="lang in jsonData.data.languages" :key="lang" :value="lang">
            {{ languageNames[lang] || lang }}
          </option>
        </select>
      </div>
      <header class="header">
        <h1 class="heading">{{ jsonData.data.form_name }}</h1>
        <img :src="jsonData.data.banner" alt="Banner image" height="20" width="80" class="banner" />
        <p>{{ jsonData.data.header[this.language] || jsonData.data.header.en }}</p>
      </header>

      <main :style="{ backgroundColor: jsonData.data.form_background_color }" class="main">
        <form @submit.prevent="submit" class="form-main">
          <div v-for="field in fields" :key="field.id" class="form-field">
            <label :for="field.code" :style="{ color: jsonData.data.attribute_label_color }">
              {{ field.name }}
              <span v-if="field.is_required === 1" style="color: red"> *</span>
            </label>
            <br />

            <template v-if="field.type === 'text' || field.type === 'date'">
              <input :type="field.type" :placeholder="field.placeholder" v-model="field.value" class="form-input" />
              <div v-if="errors[field.code]" class="error-message">
                <span v-for="(error, index) in errors[field.code]" :key="index">
                  <span>{{ error }}</span><br>
                </span>
              </div>
            </template>

            <template v-else-if="field.type === 'select'">
              <select :placeholder="field.placeholder" v-model="field.value" class="form-input">
                <option v-for="option in field.options" :key="option.id" :value="option.name">
                  {{ option.name }}
                </option>
              </select>
            </template>

            <template v-else-if="field.type === 'file'">
              <input type="file" @change="handleFileUpload($event, field)" class="form-input" />
              <div v-if="errors[field.code]" class="error-message">
                <span v-for="(error, index) in errors[field.code]" :key="index">
                  <span>{{ error }}</span><br>
                </span>
              </div>
            </template>
          </div>

          <button type="submit" :style="{ backgroundColor: jsonData.data.form_submit_button_color }" class="form-submit">
            {{ jsonData.data.submit_button_label }}
          </button>
        </form>
      </main>

      <footer class="footer">
        <p>{{ jsonData.data.footer[this.language] || jsonData.data.footer.en }}</p>
      </footer>
    </div>
  </div>
</template>


<script>
export default {
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

    handleFileUpload(event, field) {
      const file = event.target.files[0];
      field.value = file;
    },

    submit() {
      // Reset errors object
      this.errors = {};

      // Check for empty required fields
      this.fields.forEach(field => {
        if (field.is_required === 1 && !field.value) {
          if (!this.errors[field.code]) {
            this.errors[field.code] = [];
          }
          this.errors[field.code].push('Please fill this field.');
        }
      });

      // Validate date_of_birth field
      if (this.fields.some(field => field.code === "date_of_birth" && this.validateDateOfBirth(field.value))) {
        if (!this.errors.date_of_birth) {
          this.errors.date_of_birth = [];
        }
        this.errors.date_of_birth.push('Date of birth cannot be in the future.');
      }

      // Validate pan_card_number field
      if (this.fields.some(field => field.code === "pan_card_number" && !this.validatePANCardNumber(field.value))) {
        if (!this.errors.pan_card_number) {
          this.errors.pan_card_number = [];
        }
        this.errors.pan_card_number.push('Invalid PAN (must be 10 characters).');
      }

      // Validate pincode field
      if (this.fields.some(field => field.code === "pincode" && !this.validatePincode(field.value))) {
        if (!this.errors.pincode) {
          this.errors.pincode = [];
        }
        this.errors.pincode.push('Invalid pincode (must be 6 digits).');
      }

      // Validate passport issue date field
      if (this.fields.some(field => field.code === "passport_issue_date" && this.validateDateOfBirth(field.value))) {
        if (!this.errors.passport_issue_date) {
          this.errors.passport_issue_date = [];
        }
        this.errors.passport_issue_date.push('Passport issue date cannot be in the future.');
      }

      // Validate passport expiry date field
      if (this.fields.some(field => field.code === "passport_expiry_date" && !this.validateDateOfBirth(field.value))) {
        if (!this.errors.passport_expiry_date) {
          this.errors.passport_expiry_date = [];
        }
        this.errors.passport_expiry_date.push('Expired passport is not accepted.');
      }

      // Validate file input fields
      this.fields.forEach(field => {
        if (field.type === 'file' && field.value && !this.validateFileSize(field.value)) {
          if (!this.errors[field.code]) {
            this.errors[field.code] = [];
          }
          this.errors[field.code].push('File size must be less than or equal to 5 MB.');
        }
      });

      if (Object.keys(this.errors).length === 0) {
        // No errors, proceed with form submission
        const enteredValues = this.fields.map(field => `${field.name.en}: ${field.value}`);
        alert(`${this.jsonData.data.submit_success_content}\n Entered Values:\n${enteredValues.join('\n')}`);
      }
    },

    changeLanguage() {
      this.fetchJsonData()
    },

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
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.heading {
  text-decoration: underline;
}

.banner {
  max-width: 100%;
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

.form-main {
  padding: 1.5rem;
}

.form-field {
  margin-bottom: 1rem;
}

.form-input {
  padding: 0.25rem;
  border: 1px solid lightgray;
  width: -webkit-fill-available;
  width: -moz-available;
  background-color: #fff;
}

.form-submit {
  padding: 0.5rem 0.75rem 0.5rem 0.75rem;
  border: none;
  text-wrap: wrap;
  font-weight: 700;
  color: #fff;
}

.error-message {
  color: red;
}

.footer {
  color: #7d7c7c;
}
</style>
