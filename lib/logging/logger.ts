export type LogLevel = "info" | "warn" | "error";

export function log(level: LogLevel, message: string, meta?: unknown) {
  const entry = {
    level,
    message,
    meta,
    timestamp: new Date().toISOString(),
  };

  console[level](JSON.stringify(entry));
}
