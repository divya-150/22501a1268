const logs = [];
export function logEvent(event) {
  logs.push({ timestamp: new Date(), event });
}
export function getLogs() {
  return logs;
}
