import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

// Make Pusher available globally for Laravel Echo
window.Pusher = Pusher

// Use environment variables for dynamic configuration
const echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY || 'my-app-key',
  wsHost: import.meta.env.VITE_REVERB_HOST || window.location.hostname,
  wsPort: import.meta.env.VITE_REVERB_PORT || 8080,
  wssPort: import.meta.env.VITE_REVERB_PORT || 8080,
  forceTLS: false,
  enabledTransports: ['ws', 'wss'],
  disableStats: true,
})

// Connection status logging
echo.connector.pusher.connection.bind('connected', () => {
  console.log('✅ Connected to WebSocket server')
  console.log(`🔌 Connected to: ws://${echo.options.wsHost}:${echo.options.wsPort}`)
})

echo.connector.pusher.connection.bind('disconnected', () => {
  console.log('❌ Disconnected from WebSocket server')
})

echo.connector.pusher.connection.bind('error', (err) => {
  console.error('WebSocket error:', err)
})

export default echo