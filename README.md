# Queue Management System - Admin Panel

Vue.js admin dashboard for managing queues in real-time.

## Tech Stack
- Vue.js 3
- Vite
- Tailwind CSS
- Laravel Echo
- Axios

## Features
- Real-time queue updates
- Call next patient
- Multi-counter management
- Service type configuration
- Live statistics

## Setup
```bash
npm install
```

## Running
```bash
npm run dev
```

Access at: `http://localhost:5173`

## Configuration

Update API endpoint in `src/api.js`:
```javascript
baseURL: 'http://your-api-url/api'
```

## Related Projects
- [Backend API](https://github.com/humphreyobure/queue-backend)