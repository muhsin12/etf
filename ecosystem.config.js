module.exports = {
  apps: [{
    name: 'mmp-garage',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/mmp-garage',
    instances: 'max', // Use all available CPU cores
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      NEXT_PUBLIC_API_URL: 'https://www.gulf-restaurant.com'
    },
    // Logging
    log_file: '/var/log/pm2/mmp-garage.log',
    out_file: '/var/log/pm2/mmp-garage-out.log',
    error_file: '/var/log/pm2/mmp-garage-error.log',
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