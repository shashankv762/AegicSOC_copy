import axios from 'axios';

const THREAT_IPS = ["192.168.1.50", "10.0.0.15", "45.33.22.11", "185.220.101.2", "91.240.118.222"];
const USERNAMES = ["admin", "root", "user1", "guest", "db_admin", "web_master", "jdoe", "asmith", "backup_svc"];
const EVENT_TYPES = [
  { type: 'login_success', weight: 60 },
  { type: 'login_failure', weight: 20 },
  { type: 'port_scan', weight: 10 },
  { type: 'brute_force', weight: 7 },
  { type: 'data_exfil', weight: 3 }
];
const GEO_COUNTRIES = ["US", "RU", "CN", "IN", "BR", "GB", "DE", "FR"];

function getRandomItem(arr: any[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getWeightedRandom(items: any[]) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  for (const item of items) {
    if (random < item.weight) return item.type;
    random -= item.weight;
  }
  return items[0].type;
}

async function generateLog() {
  const eventType = getWeightedRandom(EVENT_TYPES);
  const isThreat = Math.random() < 0.1;
  
  const log = {
    timestamp: new Date().toISOString(),
    source_ip: isThreat ? getRandomItem(THREAT_IPS) : `192.168.1.${Math.floor(Math.random() * 254)}`,
    username: getRandomItem(USERNAMES),
    event_type: eventType,
    status_code: eventType === 'login_success' ? 200 : (eventType === 'login_failure' ? 401 : 403),
    bytes_transferred: eventType === 'data_exfil' ? Math.floor(Math.random() * 1000000) + 50000 : Math.floor(Math.random() * 500),
    port: eventType === 'port_scan' ? Math.floor(Math.random() * 60000) + 1024 : (Math.random() > 0.5 ? 443 : 80),
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    geo_country: getRandomItem(GEO_COUNTRIES)
  };

  try {
    await axios.post('http://localhost:3000/api/logs', log);
    const color = eventType === 'login_success' ? '\x1b[32m' : (eventType === 'login_failure' || eventType === 'port_scan' ? '\x1b[33m' : '\x1b[31m');
    console.log(`${color}[${log.timestamp}] ${log.event_type.toUpperCase()} from ${log.source_ip}\x1b[0m`);
  } catch (error: any) {
    console.error(`Failed to send log to server: ${error.response?.status || error.message}`);
  }
}

console.log("Starting Log Generator in 5 seconds...");
setTimeout(() => {
  setInterval(generateLog, 2000);
}, 5000);
