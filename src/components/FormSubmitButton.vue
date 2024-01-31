<template>
  <button type="submit" :style="{ backgroundColor: buttonColor }" class="form-submit">
    {{ buttonText }}
  </button>
</template>

<script>
export default {
  props: ['buttonText', 'buttonColor']
}
</script>

<style scoped>
.form-submit {
  padding: 0.5rem 0.75rem 0.5rem 0.75rem;
  border: none;
  text-wrap: wrap;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
}

.form-submit:hover {
  background-color: #2626c1 !important;
}
</style>
