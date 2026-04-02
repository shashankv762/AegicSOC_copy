import React from 'react';
import { LayoutDashboard, Bell, List, MessageSquare, ShieldCheck, Activity, Globe, Cpu } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  alertCount: number;
}

export default function Sidebar({ activeTab, setActiveTab, alertCount }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'processes', label: 'Processes', icon: Cpu },
    { id: 'network', label: 'Network', icon: Globe },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: alertCount },
    { id: 'logs', label: 'Logs', icon: List },
    { id: 'chatbot', label: 'Chatbot', icon: MessageSquare },
  ];

  return (
    <div className="w-64 h-screen fixed left-0 top-0 bg-soc-surface border-r border-soc-border flex flex-col">
      <div className="p-6 flex items-center gap-3 border-b border-soc-border">
        <ShieldCheck className="w-8 h-8 text-soc-blue" />
        <h1 className="text-xl font-bold text-soc-text tracking-tight">CyberSOC</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === item.id
                ? 'bg-soc-blue/10 text-soc-blue border border-soc-blue/20'
                : 'text-soc-muted hover:bg-soc-bg hover:text-soc-text'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
            {item.badge > 0 && (
              <span className="ml-auto bg-soc-red text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-soc-border">
        <div className="flex items-center gap-2 px-4 py-2 bg-soc-bg rounded-lg">
          <div className="w-2 h-2 bg-soc-green rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-soc-green uppercase tracking-widest">Monitoring Active</span>
        </div>
      </div>
    </div>
  );
}
