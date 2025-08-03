module.exports = {
  apps: [{
    name: 'mmp-garage',
    script: 'npm',
    args: 'start',
    cwd: '/home/gulf-restaurant/htdocs/www.gulf-restaurant.com',
    instances: 1, // Start with single instance for VPS
    exec_mode: 'fork', // Use fork mode for better compatibility
    env: {
      NODE_ENV: 'production',
      PORT: 3001 // Match your VPS Node.js settings
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001,
      NEXT_PUBLIC_API_URL: 'https://www.gulf-restaurant.com'
    },
    // Logging - use home directory for logs
    log_file: '/home/gulf-restaurant/logs/mmp-garage.log',
    out_file: '/home/gulf-restaurant/logs/mmp-garage-out.log',
    error_file: '/home/gulf-restaurant/logs/mmp-garage-error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Auto-restart configuration
    watch: false, // Don't watch files in production
    ignore_watch: ['node_modules', 'logs', '.next'],
    max_memory_restart: '1G',
    
    // Graceful shutdown
    kill_timeout: 5000,
    wait_ready: true,
    listen_timeout: 10000,
    
    // Health monitoring
    min_uptime: '10s',
    max_restarts: 10,
    
    // Source map support
    source_map_support: true,
    
    // Merge logs from all instances
    merge_logs: true,
    
    // Time zone
    time: true
  }]
};