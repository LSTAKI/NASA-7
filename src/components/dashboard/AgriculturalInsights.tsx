'use client';

import React from 'react';
import { AgriculturalInsight } from '@/types';
import { DEMO_INSIGHTS } from '@/data/mock/demonstration-data';
import { Badge } from '@/components/ui/Badge';
import { AlertCircle, Droplets, Sparkles, CheckCircle2, TrendingUp } from 'lucide-react';

interface AgriculturalInsightsProps {
  insights?: AgriculturalInsight[];
}

export function AgriculturalInsights({ insights = DEMO_INSIGHTS }: AgriculturalInsightsProps) {
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'warning':
        return <Badge variant="danger" size="sm">Action Needed</Badge>;
      case 'advisory':
        return <Badge variant="amber" size="sm">Field Tip</Badge>;
      default:
        return <Badge variant="sage" size="sm">Observation</Badge>;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'water_stress':
        return <Droplets className="w-4 h-4 text-[#d4973b]" />;
      case 'soil_health':
        return <Sparkles className="w-4 h-4 text-[#2e7d32]" />;
      case 'rainfall_anomaly':
        return <TrendingUp className="w-4 h-4 text-[#0284c7]" />;
      default:
        return <AlertCircle className="w-4 h-4 text-[#616d64]" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#e8e5dc] p-5 lg:p-6 shadow-2xs flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#f3efe9]">
        <div>
          <h3 className="font-bold text-[#1e2420] text-base tracking-tight flex items-center gap-2">
            Field Advice &amp; Soil Insights
          </h3>
          <p className="text-xs text-[#616d64] mt-0.5">
            Smart suggestions based on current weather and soil conditions
          </p>
        </div>
        <Badge variant="charcoal" size="sm">
          {insights.length} Signals Active
        </Badge>
      </div>

      <div className="space-y-3.5">
        {insights.map(item => (
          <div
            key={item.id}
            className="p-4 rounded-xl border border-[#e8e5dc] bg-[#fdfcf9] hover:border-[#c5dfcc] transition-all"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                {getIcon(item.type)}
                <h4 className="font-bold text-xs text-[#1e2420] tracking-tight">{item.title}</h4>
              </div>
              {getSeverityBadge(item.severity)}
            </div>

            <p className="text-xs text-[#616d64] leading-relaxed mb-2.5">
              {item.observation}
            </p>

            <div className="p-3 rounded-xl bg-[#eaf3ee] border border-[#c5dfcc] text-xs text-[#18392b] flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#2e7d32] shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-[#18392b]">Agronomic Tip: </strong>
                <span>{item.agronomicRecommendation}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#8d9890] mt-2.5 pt-2 border-t border-[#f3efe9]">
              <span>Source: {item.dataSource}</span>
              <span>Confidence: {item.confidence}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
