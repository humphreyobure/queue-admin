<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold">Active Queues</h3>
      
      <!-- Filter by status -->
      <select
        v-model="filterStatus"
        class="px-3 py-1 border border-gray-300 rounded-lg text-sm"
      >
        <option value="">All Status</option>
        <option value="waiting">Waiting</option>
        <option value="called">Called</option>
        <option value="serving">Serving</option>
      </select>
    </div>

    <!-- Queue Table -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Ticket
            </th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Patient
            </th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Service
            </th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Status
            </th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Counter
            </th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Time
            </th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="queue in filteredQueues"
            :key="queue.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-4 py-3">
              <span class="font-mono font-bold text-lg text-primary">
                {{ queue.ticket_number }}
              </span>
            </td>
            <td class="px-4 py-3">
              <span class="text-sm">{{ queue.patient_name || 'Walk-in' }}</span>
            </td>
            <td class="px-4 py-3">
              <span class="text-sm text-gray-600">
                {{ queue.service_type?.name }}
              </span>
            </td>
            <td class="px-4 py-3">
              <span :class="getStatusBadge(queue.status)" class="badge">
                {{ queue.status }}
              </span>
            </td>
            <td class="px-4 py-3">
              <span class="text-sm">
                {{ queue.counter?.name || '-' }}
              </span>
            </td>
            <td class="px-4 py-3">
              <span class="text-xs text-gray-500">
                {{ formatTime(queue.created_at) }}
              </span>
            </td>
            <td class="px-4 py-3">
              <button
                v-if="queue.status === 'called' || queue.status === 'serving'"
                @click="completeQueue(queue.id)"
                class="text-xs btn btn-success px-3 py-1"
              >
                Complete
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div
        v-if="filteredQueues.length === 0"
        class="text-center py-12 text-gray-500"
      >
        <p class="text-lg">No queues found</p>
        <p class="text-sm">Waiting for patients to check in...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'
import api from '../config/api'

const props = defineProps({
  queues: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['queue-completed'])

const filterStatus = ref('')

const filteredQueues = computed(() => {
  if (!filterStatus.value) return props.queues
  return props.queues.filter(q => q.status === filterStatus.value)
})

const getStatusBadge = (status) => {
  const badges = {
    waiting: 'badge-waiting',
    called: 'badge-called',
    serving: 'bg-purple-100 text-purple-800',
    completed: 'badge-completed',
  }
  return badges[status] || 'bg-gray-100 text-gray-800'
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const completeQueue = async (queueId) => {
  try {
    await api.patch(`/queues/${queueId}/complete`)
    emit('queue-completed', queueId)
  } catch (error) {
    console.error('Failed to complete queue:', error)
    alert('Failed to complete queue')
  }
}
</script>