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
        return <Badge variant="danger" size="sm">Advisory Warning</Badge>;
      case 'advisory':
        return <Badge variant="amber" size="sm">Field Action</Badge>;
      default:
        return <Badge variant="sage" size="sm">Field Observation</Badge>;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'water_stress':
        return <Droplets className="w-4 h-4 text-[#d97706]" />;
      case 'soil_health':
        return <Sparkles className="w-4 h-4 text-[#2d6a4f]" />;
      case 'rainfall_anomaly':
        return <TrendingUp className="w-4 h-4 text-[#0284c7]" />;
      default:
        return <AlertCircle className="w-4 h-4 text-[#5a626a]" />;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#e6e8e2] p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#f4f5f1]">
        <div>
          <h3 className="font-bold text-[#191c1f] text-base tracking-tight flex items-center gap-2">
            Agricultural Observations &amp; Insights
          </h3>
          <p className="text-xs text-[#5a626a] mt-0.5">
            Automated agronomic cross-referencing from satellite observations
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
            className="p-3.5 rounded-lg border border-[#e6e8e2] bg-[#fbfbf8] hover:border-[#b7e4c7] transition-all"
          >
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                {getIcon(item.type)}
                <h4 className="font-semibold text-xs text-[#191c1f] tracking-tight">{item.title}</h4>
              </div>
              {getSeverityBadge(item.severity)}
            </div>

            <p className="text-xs text-[#5a626a] leading-relaxed mb-2">
              {item.observation}
            </p>

            <div className="p-2.5 rounded-md bg-[#eaf7ee]/70 border border-[#c7e9d2]/60 text-xs text-[#1b4332] flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#2d6a4f] shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold">Agronomic Recommendation: </strong>
                <span>{item.agronomicRecommendation}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#88929c] mt-2 pt-1.5 border-t border-[#f0f1ec]">
              <span>Source: {item.dataSource}</span>
              <span>Confidence: {item.confidence}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
