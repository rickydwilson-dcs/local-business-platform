'use strict'

/**
 * NewRelic agent configuration for colossus-reference.
 *
 * See https://docs.newrelic.com/docs/apm/agents/nodejs-agent/installation-configuration/nodejs-agent-configuration/
 * for complete documentation of configuration options.
 */
exports.config = {
  /**
   * Application name - appears in NewRelic UI
   */
  app_name: ['colossus-reference'],

  /**
   * License key - get from NewRelic account settings
   * Use environment variable for security
   */
  license_key: process.env.NEW_RELIC_LICENSE_KEY,

  /**
   * Logging level
   * Options: 'trace', 'debug', 'info', 'warn', 'error'
   */
  logging: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    filepath: 'stdout', // Log to stdout for Vercel
  },

  /**
   * Distributed tracing - track requests across services
   */
  distributed_tracing: {
    enabled: true,
  },

  /**
   * Browser monitoring - track frontend performance
   */
  browser_monitoring: {
    enable: true,
  },

  /**
   * Error collection
   */
  error_collector: {
    enabled: true,
    ignore_status_codes: [404], // Don't report 404s
  },

  /**
   * Transaction tracer - detailed performance data
   */
  transaction_tracer: {
    enabled: true,
    record_sql: 'obfuscated', // Security: obfuscate SQL queries
  },

  /**
   * Custom instrumentation for Next.js
   */
  feature_flag: {
    new_promise_tracking: true,
  },

  /**
   * Allow all traffic (required for Vercel)
   */
  allow_all_headers: true,

  /**
   * Custom attributes to add to all transactions
   */
  attributes: {
    include: ['request.headers.*', 'request.parameters.*'],
  },
}
