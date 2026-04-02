import React from 'react';
import { usePolling } from '../hooks/usePolling';
import { api } from '../api/client';
import { AlertCircle, CheckCircle2, Activity } from 'lucide-react';

interface LogFeedProps {
  onSelectLog: (log: any) => void;
}

export default function LogFeed({ onSelectLog }: LogFeedProps) {
  const { data: logs, loading } = usePolling(() => api.getLogs({ limit: 50 }), 3000);

  if (loading && !logs) return <div className="p-8 text-center text-soc-muted">Loading logs...</div>;

  return (
    <div className="bg-soc-surface border border-soc-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-soc-border flex justify-between items-center">
        <h3 className="font-bold flex items-center gap-2">
          <Activity className="w-4 h-4 text-soc-blue" />
          Live Log Stream
        </h3>
        <span className="text-xs text-soc-muted">Last 50 events</span>
      </div>
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-soc-bg text-soc-muted sticky top-0">
            <tr>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Source IP</th>
              <th className="px-4 py-3 font-medium">Event Type</th>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Anomaly</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-soc-border">
            {logs?.map((log) => (
              <tr
                key={log.id}
                onClick={() => onSelectLog(log)}
                className={`cursor-pointer transition-colors hover:bg-soc-bg/50 ${
                  log.is_anomaly ? 'bg-soc-red/5' : ''
                }`}
              >
                <td className="px-4 py-3 text-soc-muted whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </td>
                <td className="px-4 py-3 font-mono text-soc-blue">{log.source_ip}</td>
                <td className="px-4 py-3">
                  <span className="capitalize">{log.event_type.replace('_', ' ')}</span>
                </td>
                <td className="px-4 py-3 text-soc-muted">{log.username}</td>
                <td className="px-4 py-3">
                  <span className={log.status_code >= 400 ? 'text-soc-red' : 'text-soc-green'}>
                    {log.status_code}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {log.is_anomaly ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-soc-red/10 text-soc-red text-[10px] font-bold uppercase">
                      <AlertCircle className="w-3 h-3" />
                      Anomaly
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-soc-green/10 text-soc-green text-[10px] font-bold uppercase">
                      <CheckCircle2 className="w-3 h-3" />
                      Normal
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
