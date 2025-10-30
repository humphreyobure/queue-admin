<template>
  <div class="card">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-600">{{ title }}</p>
        <p class="text-3xl font-bold text-gray-900 mt-1">{{ value }}</p>
      </div>
      <div :class="iconBgClass" class="p-3 rounded-full">
        <component :is="icon" class="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  title: String,
  value: [String, Number],
  icon: Object,
  iconBgClass: String,
})
</script>