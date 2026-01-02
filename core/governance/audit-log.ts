export interface AuditEvent {
  action: string;
  timestamp: number;
}

const log: AuditEvent[] = [];

export function recordAudit(event: AuditEvent) {
  log.push(event);
}

export function getAuditLog() {
  return log;
}
