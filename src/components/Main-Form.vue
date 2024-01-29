<template>
  <div>
    <div v-if="jsonData" :style="{ backgroundColor: jsonData.data.background_color }" class="container">
      <div>
        <select v-model="language" @change="changeLanguage">
          <option v-for="lang in jsonData.data.languages" :key="lang" :value="lang">{{ lang }}</option>
        </select>
      </div>
      <header class="header">
        <h1>{{ jsonData.data.form_name }}</h1>
        <img :src="jsonData.data.banner" alt="Banner image" height="20" width="20" />
        <p>{{ jsonData.data.header[this.language] || jsonData.data.header.en }}</p>
      </header>

      <main :style="{ backgroundColor: jsonData.data.form_background_color }" class="main">
        <form @submit.prevent="submit" class="form-main">
          <div v-for="field in fields" :key="field.id" class="form-field">
            <label :for="field.code" :style="{ color: jsonData.data.attribute_label_color }">
              {{ field.name }}
            </label>
            <br />

            <template v-if="field.type === 'text' || field.type === 'date' || field.type === 'file'">
              <input :type="field.type" :placeholder="field.placeholder" v-model="field.value"
                :required="field.is_required === 1" class="form-input" />
            </template>

            <template v-else-if="field.type === 'select'">
              <select :placeholder="field.placeholder" v-model="field.value" :required="field.is_required === 1"
                class="form-input">
                <option v-for="option in field.options" :key="option.id" :value="option.name">
                  {{ option.name }}
                </option>
              </select>
            </template>
          </div>

          <button type="submit" :style="{ backgroundColor: jsonData.data.form_submit_button_color }" class="form-submit">
            {{ jsonData.data.submit_button_label }}
          </button>
        </form>
      </main>

      <footer>
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

    submit() {
      console.log('Submit clicked')
      const enteredValues = this.fields.map((field) => `${field.name.en}: ${field.value}`)
      alert(`Entered Values:\n${enteredValues.join('\n')}`)
    },

    changeLanguage() {
      this.fetchJsonData();
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  width: 60%;
}

.main {
  width: 50%;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}

.form-main {
  padding-top: 2rem;
  padding-bottom: 2rem;
  padding-left: 2rem;
}

.form-field {
  margin-bottom: 1rem;
}

.form-input {
  padding: 0.25rem;
  border: 1px solid #7c7c7c;
  width: 90%;
}

.form-submit {
  padding: 0.25rem;
  border: none;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 5px 15px;
  text-wrap: wrap;
}
</style>