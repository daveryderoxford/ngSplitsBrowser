
export type LogSeverity = 'DEFAULT' | 'DEBUG'| 'INFO' | 'NOTICE' | 'WARN' | 'ERROR' | 'CRITICAL' | 'ALERT' | 'EMERGENCY';

export interface LogEntry {
   msg: string;
   severity?: LogSeverity;
   source?: string;
   jsonPayload?: any;
   timestamp?: string;
}

