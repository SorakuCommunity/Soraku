/**
 * Soraku Webhook + Health Server
 * Berjalan di main process (shard manager level) — BUKAN per shard
 * Dipanggil dari shard.js sebelum ClusterManager start
 */
import { startWebhookServer } from './Webhooks/server.js'

// Jalankan server — client akan di-set nanti saat bot ready
// via setState yang di-export dari server.js
startWebhookServer(null)
