'use client';

import React from 'react';
import { CalculatedFertilizerProductItem } from '@/types/fertilizer';
import { Package, ShieldAlert, Sparkles, AlertCircle, ArrowUpRight } from 'lucide-react';

interface FertilizerProductCardProps {
  product: CalculatedFertilizerProductItem;
  precautions?: string[];
  applicationTips?: string[];
}

export const FertilizerProductCard: React.FC<FertilizerProductCardProps> = ({
  product,
  precautions = [],
  applicationTips = [],
}) => {
  const totalPurchasedKg = product.bagsToPurchase * product.bagWeightKg;
  const leftoverKg = Math.max(0, totalPurchasedKg - product.exactQuantityKg);

  // Distinct visual theme by product ID
  const isUrea = product.productId === 'neem_coated_urea';
  const isDap = product.productId === 'dap';
  const isMop = product.productId === 'mop';
  const isSsp = product.productId === 'ssp';

  let tagColor = 'bg-[#EAF3EE] text-[#2E7D32] border-[#2E7D32]/20';
  let badgeLabel = 'Primary NPK Fertilizer';

  if (isUrea) {
    tagColor = 'bg-[#EAF3EE] text-[#2E7D32] border-[#2E7D32]/20';
    badgeLabel = '46% Nitrogen (NCU)';
  } else if (isDap) {
    tagColor = 'bg-[#FDF6E9] text-[#D4973B] border-[#D4973B]/30';
    badgeLabel = '18-46-0 Phosphorus & Nitrogen';
  } else if (isMop) {
    tagColor = 'bg-[#FFF5F2] text-[#D96B27] border-[#D96B27]/30';
    badgeLabel = '60% Potash (KCl)';
  } else if (isSsp) {
    tagColor = 'bg-[#F4F8F5] text-[#528C70] border-[#528C70]/30';
    badgeLabel = '16% P₂O₅ + 11% S + 19% Ca';
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E0DCD3] p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        {/* Top bar with Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${tagColor} mb-1.5`}>
              {badgeLabel}
            </span>
            <h4 className="text-lg font-bold text-[#1E2420]">{product.productName}</h4>
            <p className="text-xs text-[#5C645E]">{product.commonName}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#F9F8F5] border border-[#EAE6DF] flex items-center justify-center text-[#528C70] shrink-0">
            <Package className="w-5 h-5" />
          </div>
        </div>

        {/* Quantities Section: Exact vs Purchase Bags */}
        <div className="mt-4 p-4 rounded-xl bg-[#F9F8F5] border border-[#E8E4DB] space-y-3">
          {/* Exact Application Quantity */}
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-medium text-[#5C645E]">Exact Application Quantity</span>
            <div className="text-xl font-extrabold text-[#1E2420]">
              {product.exactQuantityKg.toFixed(1)}{' '}
              <span className="text-xs font-semibold text-[#5C645E]">kg</span>
            </div>
          </div>

          <div className="h-px bg-[#EAE6DF]" />

          {/* Bags to Purchase */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-[#5C645E] block">Purchase Quantity</span>
              <span className="text-[11px] text-[#5C645E]">
                Commercial packaging: {product.bagUnitLabel}
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-[#2E7D32]">
                {product.bagsToPurchase}
              </span>
              <span className="text-xs font-medium text-[#1E2420] ml-1">
                {product.bagsToPurchase === 1 ? 'bag' : 'bags'}
              </span>
              <span className="text-[11px] text-[#5C645E] block font-mono">
                ({totalPurchasedKg} kg total)
              </span>
            </div>
          </div>
        </div>

        {/* Storage / Remaining Quantity Explanation */}
        {leftoverKg > 0.05 ? (
          <div className="mt-3 px-3 py-2 rounded-lg bg-[#F9F8F5] border border-[#EAE6DF] text-[11px] text-[#5C645E] flex items-start gap-2">
            <span className="font-semibold text-[#1E2420] shrink-0">Storage note:</span>
            <span>
              Purchasing {product.bagsToPurchase} full bags will leave{' '}
              <strong className="text-[#1E2420]">{leftoverKg.toFixed(1)} kg</strong> unused. Store sealed in a dry, ventilated shed for subsequent seasons.
            </span>
          </div>
        ) : (
          <div className="mt-3 px-3 py-2 rounded-lg bg-[#EAF3EE] text-[11px] text-[#2E7D32] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Exact match with standard packaging (zero storage remainder).</span>
          </div>
        )}

        {/* Agronomic Purpose / Role */}
        <div className="mt-4">
          <span className="text-xs font-semibold text-[#1E2420] uppercase tracking-wider block mb-1">
            Application Role
          </span>
          <p className="text-xs text-[#5C645E] leading-relaxed">
            {product.applicationRole}
          </p>
        </div>

        {/* Key Nutrients Supplied by this Product */}
        <div className="mt-3 pt-3 border-t border-[#EAE6DF]">
          <span className="text-[11px] font-semibold text-[#1E2420] block mb-1.5">
            Nutrients Delivered to Field
          </span>
          <div className="flex flex-wrap gap-1.5 text-xs">
            {product.nutrientsSuppliedKg.nitrogen > 0 && (
              <span className="px-2 py-0.5 rounded bg-white border border-[#E0DCD3] font-medium text-[#1E2420]">
                {product.nutrientsSuppliedKg.nitrogen.toFixed(1)} kg N
              </span>
            )}
            {product.nutrientsSuppliedKg.phosphorus > 0 && (
              <span className="px-2 py-0.5 rounded bg-white border border-[#E0DCD3] font-medium text-[#1E2420]">
                {product.nutrientsSuppliedKg.phosphorus.toFixed(1)} kg P₂O₅
              </span>
            )}
            {product.nutrientsSuppliedKg.potassium > 0 && (
              <span className="px-2 py-0.5 rounded bg-white border border-[#E0DCD3] font-medium text-[#1E2420]">
                {product.nutrientsSuppliedKg.potassium.toFixed(1)} kg K₂O
              </span>
            )}
            {product.nutrientsSuppliedKg.sulfur !== undefined && product.nutrientsSuppliedKg.sulfur > 0 && (
              <span className="px-2 py-0.5 rounded bg-[#FDF6E9] border border-[#D4973B]/30 font-medium text-[#D4973B]">
                {product.nutrientsSuppliedKg.sulfur.toFixed(1)} kg S
              </span>
            )}
            {product.nutrientsSuppliedKg.calcium !== undefined && product.nutrientsSuppliedKg.calcium > 0 && (
              <span className="px-2 py-0.5 rounded bg-[#F4F8F5] border border-[#528C70]/30 font-medium text-[#528C70]">
                {product.nutrientsSuppliedKg.calcium.toFixed(1)} kg Ca
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Precautions Footer */}
      {precautions.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[#EAE6DF] text-[11px] text-[#5C645E] flex items-start gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-[#D96B27] shrink-0 mt-0.5" />
          <span className="line-clamp-2">{precautions[0]}</span>
        </div>
      )}
    </div>
  );
};
