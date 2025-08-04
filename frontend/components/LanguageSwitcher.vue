<template>
  <v-select
    :items="languages"
    v-model="locale"
    label="Хэл / Language"
    dense
    hide-details
    style="max-width: 150px"
    item-title="title"
    item-value="value"
  />
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()
const languages = [
  { value: 'mn', title: 'Монгол' },
  { value: 'en', title: 'English' }
]
</script>