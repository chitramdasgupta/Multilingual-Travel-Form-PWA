<template>
  <div class="form-field">
    <label :for="fieldData.code" :style="{ color: attributeLabelColor }">
      {{ fieldData.name }}
      <span v-if="fieldData.is_required === 1" style="color: red"> *</span>
    </label>
    <br />

    <template v-if="fieldData.type === 'text' || fieldData.type === 'date'">
      <input :type="fieldData.type" :placeholder="fieldData.placeholder" :value="fieldValue"
        @input="fieldValue = $event.target.value" class="form-input" />
    </template>

    <template v-else-if="fieldData.type === 'select'">
      <select :placeholder="fieldData.placeholder" :value="selectValue" @input="selectValue = $event.target.value"
        class="form-input">
        <option v-for="option in fieldData.options" :key="option.id" :value="option.name">
          {{ option.name }}
        </option>
      </select>
    </template>


    <template v-else-if="fieldData.type === 'file'">
      <input type="file" @change="$emit('fileUpload', $event, fieldData)" class="form-input" />
    </template>

    <div v-if="errors[fieldData.code]" class="error-message">
      <span v-for="(error, index) in errors[fieldData.code]" :key="index">
        <span>{{ error }}</span><br>
      </span>
    </div>
  </div>
</template>
  
<script>
export default {
  props: ['fieldData', 'attributeLabelColor', 'errors'],
  computed: {
    fieldValue: {
      get() {
        return this.fieldData.value;
      },
      set(newValue) {
        this.$emit('update-value', { id: this.fieldData.id, value: newValue });
      },
    },
    selectValue: {
      get() {
        return this.fieldData.value;
      },
      set(newValue) {
        this.$emit('update-value', { id: this.fieldData.id, value: newValue });
      },
    },
  },
};
</script>
  
<style scoped>
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
</style>
  