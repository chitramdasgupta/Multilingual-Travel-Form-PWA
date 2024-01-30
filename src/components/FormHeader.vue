<template>
  <div>
    <div>
      <label for="languageSelect">Select Language: </label>
      <select id="languageSelect" v-model="selectedLanguage" @change="emitLanguageChange">
        <option v-for="lang in jsonData.data.languages" :key="lang" :value="lang">
          {{ languageNames[lang] || lang }}
        </option>
      </select>
    </div>
    <header class="header">
      <h1 class="heading">{{ jsonData.data.form_name }}</h1>
      <img :src="jsonData.data.banner" alt="Banner image" height="20" width="80" class="banner" />
      <p>{{ jsonData.data.header[selectedLanguage] || jsonData.data.header.en }}</p>
    </header>
  </div>
</template>
  
<script>
export default {
  props: ['jsonData', 'language'],
  data() {
    return {
      selectedLanguage: this.language,
      languageNames: {
        en: 'English',
        hi: 'Hindi',
        gj: 'Gujarati',
        ka: 'Kannada',
        mt: 'Marathi',
        tm: 'Tamil',
        tl: 'Telugu',
      },
    };
  },
  methods: {
    emitLanguageChange() {
      this.$emit('languageChanged', this.selectedLanguage);
    },
  },
};
</script>
  
<style>
.heading {
  text-decoration: underline;
}

.banner {
  max-width: 100%;
}
</style>
  