'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import {
  LayoutDashboard,
  Globe2,
  Layers,
  CloudSun,
  MapPin,
  Sparkles,
  TrendingUp,
  FileText,
  Settings,
  X,
  Sprout,
  ShieldCheck
} from 'lucide-react';
import { useActiveFarm } from '@/hooks/useActiveFarm';
import { Badge } from '@/components/ui/Badge';

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  const pathname = usePathname();
  const { farms, activeFarm, setActiveFarmId } = useActiveFarm();

  const navItems = [
    { label: 'Overview', href: '/', icon: LayoutDashboard },
    { label: 'Earth Intelligence', href: '/earth-intelligence', icon: Globe2 },
    { label: 'Soil Intelligence', href: '/soil-intelligence', icon: Layers },
    { label: 'Climate Analysis', href: '/climate-analysis', icon: CloudSun },
    { label: 'Farm Management', href: '/farms', icon: MapPin },
    { label: 'Crop Rotation Advisor', href: '/rotation-advisor', icon: Sparkles },
    { label: 'Strategy Simulator', href: '/simulator', icon: TrendingUp },
    { label: 'Reports', href: '/reports', icon: FileText },
    { label: 'Settings', href: '/settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#1b4332] text-white flex flex-col justify-between transition-transform duration-200 ease-in-out lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header / Brand */}
        <div className="p-5 border-b border-[#2d6a4f]/60">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all">
                <Sprout className="w-6 h-6 text-[#74c69d]" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold tracking-tight text-lg leading-tight flex items-center gap-1.5">
                  ARACHNOVA
                  <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-[#52b788]/20 text-[#95d5b2] border border-[#52b788]/30">
                    v1.0
                  </span>
                </span>
                <span className="text-[11px] text-[#95d5b2] font-normal tracking-wide">
                  Agricultural Intelligence
                </span>
              </div>
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Active Farm Switcher in Sidebar */}
          <div className="mt-5 bg-[#2d6a4f]/50 rounded-lg p-2.5 border border-[#52b788]/20">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-semibold text-[#95d5b2] tracking-wider">
                Active Farm Focus
              </span>
              <span className="text-[10px] text-white/60">
                {activeFarm ? `${activeFarm.areaHectares} ha` : ''}
              </span>
            </div>
            <select
              value={activeFarm?.id || ''}
              onChange={e => setActiveFarmId(e.target.value)}
              className="w-full bg-[#1b4332] text-xs text-white border border-[#40916c] rounded-md px-2 py-1.5 font-medium focus:outline-none focus:ring-1 focus:ring-[#74c69d] cursor-pointer"
            >
              {farms.map(f => (
                <option key={f.id} value={f.id} className="bg-[#1b4332] text-white">
                  {f.name} ({f.country})
                </option>
              ))}
            </select>
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#95d5b2]/80">
              <span className="font-mono text-[10px]">
                {activeFarm ? `${activeFarm.location.latitude.toFixed(2)}°, ${activeFarm.location.longitude.toFixed(2)}°` : ''}
              </span>
              <span className="capitalize">{activeFarm?.irrigationType || 'rainfed'}</span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-[#2d6a4f] text-white shadow-xs font-semibold'
                    : 'text-[#d8f3dc]/80 hover:bg-[#2d6a4f]/40 hover:text-white'
                )}
              >
                <Icon
                  className={cn(
                    'w-5 h-5 transition-colors',
                    isActive ? 'text-[#74c69d]' : 'text-[#95d5b2]/70 group-hover:text-[#74c69d]'
                  )}
                />
                <span className="flex-1 truncate">{item.label}</span>
                {item.href === '/rotation-advisor' && (
                  <Badge variant="sage" size="sm" className="bg-[#52b788]/20 text-[#95d5b2] border-transparent text-[10px]">
                    AI
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Attribution / System Status */}
        <div className="p-4 border-t border-[#2d6a4f]/60 bg-[#16382a]/50 text-xs">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-[#74c69d]" />
            <span className="text-[11px] font-medium text-white/90">Earth Observation Hybrid</span>
          </div>
          <p className="text-[10px] text-[#95d5b2]/70 leading-relaxed">
            NASA POWER &bull; Open-Meteo ERA5 &bull; ISRIC SoilGrids 250m. Real API proxies active.
          </p>
        </div>
      </aside>
    </>
  );
}
