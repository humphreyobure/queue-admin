<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900">
            🏥 Queue Management System
          </h1>
          <div class="flex items-center gap-2">
            <div
              :class="wsConnected ? 'bg-green-500' : 'bg-red-500'"
              class="w-3 h-3 rounded-full animate-pulse"
            ></div>
            <span class="text-sm text-gray-600">
              {{ wsConnected ? 'Live' : 'Disconnected' }}
            </span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-6 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Waiting"
          :value="stats.waiting"
          :icon="ClockIcon"
          iconBgClass="bg-blue-500"
        />
        <StatsCard
          title="Called"
          :value="stats.called"
          :icon="PhoneIcon"
          iconBgClass="bg-yellow-500"
        />
        <StatsCard
          title="Completed Today"
          :value="stats.completed_today"
          :icon="CheckCircleIcon"
          iconBgClass="bg-green-500"
        />
        <StatsCard
          title="Avg Wait (min)"
          :value="stats.average_wait_time"
          :icon="ChartBarIcon"
          iconBgClass="bg-purple-500"
        />
      </div>

      <!-- Main Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column: Call Next & Counter Status -->
        <div class="space-y-6">
          <CallNextButton
            :counters="counters"
            @queue-called="handleQueueCalled"
          />
          <CounterStatus :counters="counters" />
        </div>

        <!-- Right Column: Queue List -->
        <div class="lg:col-span-2">
          <QueueList
            :queues="queues"
            @queue-completed="handleQueueCompleted"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  ClockIcon, 
  PhoneIcon, 
  CheckCircleIcon, 
  ChartBarIcon 
} from '@heroicons/vue/24/outline'
import api from '../config/api'
import echo from '../config/echo'
import StatsCard from '../components/StatsCard.vue'
import CounterStatus from '../components/CounterStatus.vue'
import CallNextButton from '../components/CallNextButton.vue'
import QueueList from '../components/QueueList.vue'

// State
const queues = ref([])
const counters = ref([])
const stats = ref({
  waiting: 0,
  called: 0,
  completed_today: 0,
  average_wait_time: 0,
})
const wsConnected = ref(false)

// Fetch data from API
const fetchQueues = async () => {
  try {
    const response = await api.get('/queues')
    queues.value = response.data.queues
  } catch (error) {
    console.error('Failed to fetch queues:', error)
  }
}

const fetchCounters = async () => {
  try {
    const response = await api.get('/counters')
    counters.value = response.data.counters
  } catch (error) {
    console.error('Failed to fetch counters:', error)
  }
}

const fetchStats = async () => {
  try {
    const response = await api.get('/queues/stats')
    stats.value = response.data
  } catch (error) {
    console.error('Failed to fetch stats:', error)
  }
}

// Event handlers
const handleQueueCalled = () => {
  fetchQueues()
  fetchCounters()
  fetchStats()
}

const handleQueueCompleted = () => {
  fetchQueues()
  fetchCounters()
  fetchStats()
}

// WebSocket listener
let channel

const setupWebSocket = () => {
  channel = echo.channel('queue-updates')
  
  channel.listen('.queue.updated', (data) => {
    console.log('Queue updated:', data)
    
    // Refresh all data when queue updates
    fetchQueues()
    fetchCounters()
    fetchStats()
    
    // Play notification sound
    playNotificationSound()
  })

  // Update connection status
  echo.connector.pusher.connection.bind('connected', () => {
    wsConnected.value = true
  })

  echo.connector.pusher.connection.bind('disconnected', () => {
    wsConnected.value = false
  })
}

const playNotificationSound = () => {
  // Optional: Play sound when queue updates
  const audio = new Audio('/notification.mp3')
  audio.play().catch(() => {
    // Sound play failed (no file or permission denied)
  })
}

// Lifecycle hooks
onMounted(() => {
  fetchQueues()
  fetchCounters()
  fetchStats()
  setupWebSocket()
  
  // Refresh data every 30 seconds (fallback if WebSocket fails)
  const interval = setInterval(() => {
    fetchQueues()
    fetchStats()
  }, 30000)
  
  // Cleanup on unmount
  onUnmounted(() => {
    clearInterval(interval)
    if (channel) {
      echo.leave('queue-updates')
    }
  })
})
</script>