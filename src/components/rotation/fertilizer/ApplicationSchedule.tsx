'use client';

import React from 'react';
import { ApplicationScheduleResult } from '@/types/fertilizer';
import { Calendar, Clock, AlertCircle, CheckCircle2, ChevronRight, Layers } from 'lucide-react';

interface ApplicationScheduleProps {
  schedule: ApplicationScheduleResult;
}

export const ApplicationSchedule: React.FC<ApplicationScheduleProps> = ({ schedule }) => {
  const { stages, scheduleStatus, isAllocationValid, allocationWarnings } = schedule;

  return (
    <div className="bg-white rounded-2xl border border-[#E0DCD3] p-5 md:p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EAE6DF] gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#EAF3EE] flex items-center justify-center text-[#2E7D32]">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#1E2420]">
              Phenological Application Schedule
            </h3>
            <p className="text-xs text-[#5C645E]">
              Split application timing tailored to crop growth stages
            </p>
          </div>
        </div>

        {/* Schedule Verification Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {scheduleStatus === 'verified' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF3EE] text-[#2E7D32] border border-[#2E7D32]/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified Agricultural University Schedule
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFFDF5] text-[#D4973B] border border-[#D4973B]/30">
              <AlertCircle className="w-3.5 h-3.5" />
              Provisional Green Manure Timing
            </span>
          )}
        </div>
      </div>

      {/* Allocation warnings if splits do not total 100% */}
      {!isAllocationValid && allocationWarnings.length > 0 && (
        <div className="mt-4 p-3 rounded-xl bg-[#FFF5F2] border border-[#D96B27]/40 text-xs text-[#D96B27] flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold">Allocation Anomaly Detected:</strong>
            <ul className="list-disc list-inside mt-0.5 space-y-0.5">
              {allocationWarnings.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Timeline Steps Layout */}
      <div className="mt-6 relative">
        {/* Continuous connector line on desktop */}
        <div className="hidden md:block absolute left-4 top-8 bottom-8 w-0.5 bg-[#EAE6DF]" />

        <div className="space-y-6">
          {stages.map((stage, index) => {
            const isBasal = index === 0;

            return (
              <div
                key={stage.stage}
                className="relative flex flex-col md:flex-row items-start gap-4 md:gap-6 pl-0 md:pl-10"
              >
                {/* Step Circle / Number */}
                <div className="hidden md:flex absolute left-0 top-1 w-8 h-8 rounded-full bg-[#F9F8F5] border-2 border-[#528C70] items-center justify-center text-xs font-bold text-[#1E2420] z-10">
                  {index + 1}
                </div>

                {/* Stage Content Card */}
                <div className="flex-1 w-full bg-[#F9F8F5] border border-[#E8E4DB] rounded-2xl p-4 md:p-5 hover:border-[#528C70]/40 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-3 border-b border-[#EAE6DF]">
                    <div className="flex items-center gap-2">
                      <span className="md:hidden w-6 h-6 rounded-full bg-[#528C70] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {index + 1}
                      </span>
                      <h4 className="text-sm font-bold text-[#1E2420]">
                        {stage.stageDisplayName}
                      </h4>
                    </div>

                    {stage.timingDaysRange && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#528C70] font-medium bg-white px-2.5 py-1 rounded-lg border border-[#E0DCD3]">
                        <Clock className="w-3.5 h-3.5" />
                        {stage.timingDaysRange.min === 0 && stage.timingDaysRange.max === 0
                          ? 'At Sowing / Puddling'
                          : `${stage.timingDaysRange.min} - ${stage.timingDaysRange.max} DAS/DAT`}
                      </span>
                    )}
                  </div>

                  {/* Nutrient Split Percentages */}
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#5C645E]">
                    <span className="font-semibold text-[#1E2420]">Target Nutrient Split:</span>
                    <span className="px-2 py-0.5 rounded bg-white border border-[#E0DCD3] font-mono">
                      N: {stage.percentages.nitrogen}%
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white border border-[#E0DCD3] font-mono">
                      P₂O₅: {stage.percentages.phosphorus}%
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white border border-[#E0DCD3] font-mono">
                      K₂O: {stage.percentages.potassium}%
                    </span>
                  </div>

                  {/* Products Allocated to this Stage */}
                  <div className="mt-4">
                    <span className="text-xs font-semibold text-[#1E2420] uppercase tracking-wider block mb-2">
                      Fertilizers to Apply at this Stage
                    </span>

                    {stage.stageProducts.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {stage.stageProducts.map(p => (
                          <div
                            key={p.productId}
                            className="p-3 rounded-xl bg-white border border-[#E0DCD3] flex items-center justify-between"
                          >
                            <div>
                              <span className="text-xs font-semibold text-[#1E2420] block">
                                {p.productName}
                              </span>
                              <span className="text-[11px] text-[#5C645E]">
                                ≈ {p.stageBagsApprox} {p.stageBagsApprox === 1 ? 'bag' : 'bags'} ({p.bagWeightKg} kg)
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-bold text-[#2E7D32]">
                                {p.quantityKg.toFixed(1)}
                              </span>
                              <span className="text-[11px] text-[#5C645E] ml-1">kg</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-white border border-[#E0DCD3] text-xs text-[#5C645E]">
                        No commercial synthetic fertilizer applied at this stage.
                      </div>
                    )}
                  </div>

                  {/* Application Method & Advisory */}
                  <div className="mt-4 pt-3 border-t border-[#EAE6DF] space-y-1.5 text-xs">
                    <div>
                      <strong className="text-[#1E2420] font-medium">Placement Method: </strong>
                      <span className="text-[#5C645E]">{stage.applicationMethod}</span>
                    </div>
                    {stage.criticalAdvisory && (
                      <div className="text-[#D96B27] bg-[#FFF5F2] p-2 rounded-lg border border-[#D96B27]/20 flex items-start gap-1.5">
                        <span className="font-semibold shrink-0">⚠️ Advisory:</span>
                        <span>{stage.criticalAdvisory}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
