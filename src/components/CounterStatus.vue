<template>
  <div class="card">
    <h3 class="text-lg font-semibold mb-4">Counter Status</h3>
    <div class="space-y-3">
      <div
        v-for="counter in counters"
        :key="counter.id"
        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
      >
        <div class="flex items-center gap-3">
          <div
            :class="getStatusColor(counter.status)"
            class="w-3 h-3 rounded-full"
          ></div>
          <div>
            <p class="font-semibold">{{ counter.name }}</p>
            <p class="text-sm text-gray-600">
              {{ counter.service_type?.name || 'No service' }}
            </p>
          </div>
        </div>
        <div class="text-right">
          <p v-if="counter.current_queue" class="text-sm font-mono font-bold text-primary">
            {{ counter.current_queue.ticket_number }}
          </p>
          <span
            :class="getStatusBadgeClass(counter.status)"
            class="badge text-xs"
          >
            {{ counter.status }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  counters: {
    type: Array,
    default: () => [],
  },
})

const getStatusColor = (status) => {
  return {
    'bg-green-500': status === 'open',
    'bg-red-500': status === 'closed',
    'bg-yellow-500': status === 'break',
  }
}

const getStatusBadgeClass = (status) => {
  return {
    'bg-green-100 text-green-800': status === 'open',
    'bg-red-100 text-red-800': status === 'closed',
    'bg-yellow-100 text-yellow-800': status === 'break',
  }
}
</script>