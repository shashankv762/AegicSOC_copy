import React from 'react';
import { usePolling } from '../hooks/usePolling';
import { api } from '../api/client';
import { Activity, AlertTriangle, Search } from 'lucide-react';

export default function ProcessPanel() {
  const { data: processes, loading } = usePolling(() => api.getProcesses(), 3000);

  if (loading && !processes) return <div className="p-8 text-center text-soc-muted">Loading processes...</div>;

  return (
    <div className="bg-soc-surface border border-soc-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-soc-border flex justify-between items-center">
        <h3 className="font-bold flex items-center gap-2">
          <Activity className="w-4 h-4 text-soc-purple" />
          System Processes
        </h3>
        <span className="text-xs text-soc-muted">Real-time Task Manager</span>
      </div>
      <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-soc-bg text-soc-muted sticky top-0">
            <tr>
              <th className="px-4 py-3 font-medium">PID</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">CPU %</th>
              <th className="px-4 py-3 font-medium">Memory %</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Path</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-soc-border">
            {processes?.map((proc) => (
              <tr
                key={proc.id}
                className={`transition-colors hover:bg-soc-bg/50 ${
                  proc.is_suspicious ? 'bg-soc-red/5' : ''
                }`}
              >
                <td className="px-4 py-3 font-mono text-soc-blue">{proc.pid}</td>
                <td className="px-4 py-3 font-medium flex items-center gap-2">
                  {proc.name}
                  {proc.is_suspicious && (
                    <AlertTriangle className="w-3 h-3 text-soc-red" />
                  )}
                </td>
                <td className={`px-4 py-3 ${proc.cpu_percent > 50 ? 'text-soc-yellow' : 'text-soc-muted'}`}>
                  {proc.cpu_percent.toFixed(1)}%
                </td>
                <td className="px-4 py-3 text-soc-muted">
                  {proc.memory_usage.toFixed(1)}%
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    proc.status === 'running' ? 'bg-soc-green/10 text-soc-green' : 'bg-soc-muted/10 text-soc-muted'
                  }`}>
                    {proc.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-soc-muted truncate max-w-[200px]" title={proc.exe_path}>
                  {proc.exe_path}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
