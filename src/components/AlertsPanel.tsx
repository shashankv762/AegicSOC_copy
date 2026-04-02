import React from 'react';
import { usePolling } from '../hooks/usePolling';
import { api } from '../api/client';
import { formatDistanceToNow } from 'date-fns';
import { ShieldAlert, Check, Search } from 'lucide-react';

interface AlertsPanelProps {
  onInvestigate: (alert: any) => void;
}

export default function AlertsPanel({ onInvestigate }: AlertsPanelProps) {
  const { data: alerts, refresh } = usePolling(() => api.getAlerts({ limit: 20, acknowledged: false }), 5000);

  const handleAcknowledge = async (e, id) => {
    e.stopPropagation();
    await api.acknowledgeAlert(id, true);
    refresh();
  };

  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-soc-surface border border-soc-border rounded-xl p-8 text-center">
        <div className="w-12 h-12 bg-soc-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-6 h-6 text-soc-green" />
        </div>
        <h4 className="font-bold text-soc-text">All Clear</h4>
        <p className="text-sm text-soc-muted">No active alerts requiring attention.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`bg-soc-surface border border-soc-border rounded-xl p-4 transition-all hover:border-soc-muted border-l-4 ${
            alert.severity === 'Critical' ? 'border-l-soc-red' : 
            alert.severity === 'Medium' ? 'border-l-soc-yellow' : 'border-l-soc-blue'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
              alert.severity === 'Critical' ? 'bg-soc-red/10 text-soc-red' : 
              alert.severity === 'Medium' ? 'bg-soc-yellow/10 text-soc-yellow' : 'bg-soc-blue/10 text-soc-blue'
            }`}>
              {alert.severity}
            </span>
            <span className="text-[10px] text-soc-muted">
              {formatDistanceToNow(new Date(alert.created_at))} ago
            </span>
          </div>
          
          <p className="text-sm font-medium text-soc-text mb-3 line-clamp-2">
            {alert.reason}
          </p>

          <div className="flex gap-2">
            <button
              onClick={(e) => handleAcknowledge(e, alert.id)}
              className="flex-1 py-1.5 text-xs font-bold bg-soc-bg hover:bg-soc-border text-soc-text rounded-lg transition-colors border border-soc-border"
            >
              Acknowledge
            </button>
            <button
              onClick={() => onInvestigate(alert)}
              className="px-3 py-1.5 bg-soc-blue/10 hover:bg-soc-blue/20 text-soc-blue rounded-lg transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
