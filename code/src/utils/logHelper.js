export function buildSystemLog(message = "") {
  return `~ SYSTEM LOG (${new Date().toLocaleString()}): ${message} ~`;
}