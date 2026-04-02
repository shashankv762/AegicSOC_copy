import React from 'react';
import { usePolling } from '../hooks/usePolling';
import { api } from '../api/client';
import { Globe, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function NetworkPanel() {
  const { data: network, loading } = usePolling(() => api.getNetwork(), 3000);

  if (loading && !network) return <div className="p-8 text-center text-soc-muted">Loading network...</div>;

  return (
    <div className="bg-soc-surface border border-soc-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-soc-border flex justify-between items-center">
        <h3 className="font-bold flex items-center gap-2">
          <Globe className="w-4 h-4 text-soc-blue" />
          Network Connections
        </h3>
        <span className="text-xs text-soc-muted">Active established connections</span>
      </div>
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-soc-bg text-soc-muted sticky top-0">
            <tr>
              <th className="px-4 py-3 font-medium">Local Address</th>
              <th className="px-4 py-3 font-medium">Remote Address</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">PID</th>
              <th className="px-4 py-3 font-medium">Risk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-soc-border">
            {network?.map((conn) => (
              <tr
                key={conn.id}
                className={`transition-colors hover:bg-soc-bg/50 ${
                  conn.is_suspicious ? 'bg-soc-red/5' : ''
                }`}
              >
                <td className="px-4 py-3 font-mono text-soc-muted">{conn.local_address}</td>
                <td className="px-4 py-3 font-mono text-soc-blue">{conn.remote_address}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-full bg-soc-green/10 text-soc-green text-[10px] font-bold uppercase">
                    {conn.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-soc-muted">{conn.pid}</td>
                <td className="px-4 py-3">
                  {conn.is_suspicious ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-soc-red/10 text-soc-red text-[10px] font-bold uppercase">
                      <ShieldAlert className="w-3 h-3" />
                      Suspicious
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-soc-green/10 text-soc-green text-[10px] font-bold uppercase">
                      <CheckCircle2 className="w-3 h-3" />
                      Safe
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
