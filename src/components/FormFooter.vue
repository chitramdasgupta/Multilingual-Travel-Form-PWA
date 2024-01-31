<template>
  <footer class="footer">
    <p>{{ footerText }}</p>
  </footer>
</template>

<script>
export default {
  props: ['footerText']
}
</script>

<style scoped>
.footer {
  color: #7d7c7c;
}
</style>
