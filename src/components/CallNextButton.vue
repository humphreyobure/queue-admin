<template>
  <div class="card">
    <h3 class="text-lg font-semibold mb-4">Call Next Patient</h3>
    
    <!-- Counter Selection -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Select Counter
      </label>
      <select
        v-model="selectedCounter"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        :disabled="loading"
      >
        <option value="">-- Choose Counter --</option>
        <option
          v-for="counter in openCounters"
          :key="counter.id"
          :value="counter.id"
        >
          {{ counter.name }} - {{ counter.service_type?.name }}
        </option>
      </select>
    </div>

    <!-- Call Next Button -->
    <button
      @click="callNext"
      :disabled="!selectedCounter || loading"
      class="btn btn-primary w-full text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span v-if="loading">Calling...</span>
      <span v-else>📢 Call Next Patient</span>
    </button>

    <!-- Success/Error Messages -->
    <div v-if="message" :class="messageClass" class="mt-4 p-3 rounded-lg text-sm">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'
import api from '../config/api'

const props = defineProps({
  counters: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['queue-called'])

const selectedCounter = ref('')
const loading = ref(false)
const message = ref('')
const messageType = ref('success')

const openCounters = computed(() => {
  return props.counters.filter(c => c.status === 'open')
})

const messageClass = computed(() => {
  return messageType.value === 'success'
    ? 'bg-green-100 text-green-800 border border-green-200'
    : 'bg-red-100 text-red-800 border border-red-200'
})

const callNext = async () => {
  if (!selectedCounter.value) return

  loading.value = true
  message.value = ''

  try {
    const response = await api.post('/queues/call-next', {
      counter_id: selectedCounter.value,
    })

    message.value = `✅ Called: ${response.data.queue.ticket_number}`
    messageType.value = 'success'
    
    // Emit event to parent to refresh data
    emit('queue-called', response.data.queue)

    // Clear message after 3 seconds
    setTimeout(() => {
      message.value = ''
    }, 3000)

  } catch (error) {
    message.value = error.response?.data?.message || '❌ No patients waiting for this service'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}
</script>