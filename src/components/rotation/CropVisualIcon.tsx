import React from 'react';
import { Sprout } from 'lucide-react';

export type CropIconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface CropVisualIconProps {
  cropId: string;
  size?: CropIconSize;
  className?: string;
  showBadge?: boolean;
}

export interface CropVisualMetadata {
  category: 'vegetable' | 'legume' | 'cereal' | 'cover_crop' | 'fiber' | 'oilseed';
  categoryLabel: string;
  color: string;
  bgColor: string;
  borderColor: string;
  pillBg: string;
  pillText: string;
  emoji: string;
}

export function getCropVisualMetadata(cropId: string): CropVisualMetadata {
  const id = cropId.toLowerCase();

  switch (id) {
    case 'tomato':
      return {
        category: 'vegetable',
        categoryLabel: 'Solanaceae Vegetable',
        color: '#e11d48',
        bgColor: 'bg-rose-50',
        borderColor: 'border-rose-200',
        pillBg: 'bg-rose-100',
        pillText: 'text-rose-800',
        emoji: '🍅',
      };
    case 'potato':
      return {
        category: 'vegetable',
        categoryLabel: 'Tuber Vegetable',
        color: '#b45309',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        pillBg: 'bg-amber-100',
        pillText: 'text-amber-800',
        emoji: '🥔',
      };
    case 'carrot':
      return {
        category: 'vegetable',
        categoryLabel: 'Root Vegetable',
        color: '#ea580c',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        pillBg: 'bg-orange-100',
        pillText: 'text-orange-800',
        emoji: '🥕',
      };
    case 'green_peas':
      return {
        category: 'vegetable',
        categoryLabel: 'Legume Vegetable',
        color: '#16a34a',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        pillBg: 'bg-emerald-100',
        pillText: 'text-emerald-800',
        emoji: '🫛',
      };
    case 'cabbage':
      return {
        category: 'vegetable',
        categoryLabel: 'Brassica Vegetable',
        color: '#059669',
        bgColor: 'bg-teal-50',
        borderColor: 'border-teal-200',
        pillBg: 'bg-teal-100',
        pillText: 'text-teal-800',
        emoji: '🥬',
      };
    case 'onion':
      return {
        category: 'vegetable',
        categoryLabel: 'Alliaceae Vegetable',
        color: '#9333ea',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        pillBg: 'bg-purple-100',
        pillText: 'text-purple-800',
        emoji: '🧅',
      };
    case 'maize':
      return {
        category: 'cereal',
        categoryLabel: 'Cereal Grain',
        color: '#ca8a04',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        pillBg: 'bg-yellow-100',
        pillText: 'text-yellow-800',
        emoji: '🌽',
      };
    case 'soybean':
      return {
        category: 'legume',
        categoryLabel: 'Legume / Pulse',
        color: '#65a30d',
        bgColor: 'bg-lime-50',
        borderColor: 'border-lime-200',
        pillBg: 'bg-lime-100',
        pillText: 'text-lime-800',
        emoji: '🌱',
      };
    case 'wheat':
      return {
        category: 'cereal',
        categoryLabel: 'Cereal Grain',
        color: '#d97706',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        pillBg: 'bg-amber-100',
        pillText: 'text-amber-800',
        emoji: '🌾',
      };
    case 'chickpea':
      return {
        category: 'legume',
        categoryLabel: 'Legume / Pulse',
        color: '#0d9488',
        bgColor: 'bg-teal-50',
        borderColor: 'border-teal-200',
        pillBg: 'bg-teal-100',
        pillText: 'text-teal-800',
        emoji: '🧆',
      };
    case 'pearl_millet':
      return {
        category: 'cereal',
        categoryLabel: 'Millets & Sorghum',
        color: '#b45309',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        pillBg: 'bg-amber-100',
        pillText: 'text-amber-800',
        emoji: '🌾',
      };
    case 'sorghum':
      return {
        category: 'cereal',
        categoryLabel: 'Millets & Sorghum',
        color: '#c2410c',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        pillBg: 'bg-orange-100',
        pillText: 'text-orange-800',
        emoji: '🌾',
      };
    case 'rice':
      return {
        category: 'cereal',
        categoryLabel: 'Cereal Grain',
        color: '#eab308',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        pillBg: 'bg-yellow-100',
        pillText: 'text-yellow-800',
        emoji: '🍚',
      };
    case 'groundnut':
      return {
        category: 'legume',
        categoryLabel: 'Legume / Oilseed',
        color: '#9a3412',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        pillBg: 'bg-amber-100',
        pillText: 'text-amber-800',
        emoji: '🥜',
      };
    case 'cotton':
      return {
        category: 'fiber',
        categoryLabel: 'Industrial Fiber',
        color: '#0284c7',
        bgColor: 'bg-sky-50',
        borderColor: 'border-sky-200',
        pillBg: 'bg-sky-100',
        pillText: 'text-sky-800',
        emoji: '☁️',
      };
    case 'cover_crop_mix':
      return {
        category: 'cover_crop',
        categoryLabel: 'Ecological Cover Crop',
        color: '#15803d',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        pillBg: 'bg-green-100',
        pillText: 'text-green-800',
        emoji: '🍀',
      };
    default:
      return {
        category: 'vegetable',
        categoryLabel: 'Agricultural Crop',
        color: '#2d6a4f',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        pillBg: 'bg-emerald-100',
        pillText: 'text-emerald-800',
        emoji: '🌿',
      };
  }
}

const sizePixels: Record<CropIconSize, { box: number; icon: number; frame: string }> = {
  xs: { box: 20, icon: 14, frame: 'w-5 h-5 rounded-md' },
  sm: { box: 28, icon: 18, frame: 'w-7 h-7 rounded-lg' },
  md: { box: 36, icon: 24, frame: 'w-9 h-9 rounded-lg' },
  lg: { box: 48, icon: 32, frame: 'w-12 h-12 rounded-xl' },
  xl: { box: 64, icon: 42, frame: 'w-16 h-16 rounded-2xl' },
};

export function CropVisualIcon({ cropId, size = 'md', className = '', showBadge = false }: CropVisualIconProps) {
  const meta = getCropVisualMetadata(cropId);
  const dim = sizePixels[size];

  const renderVectorIcon = () => {
    const s = dim.icon;
    switch (cropId.toLowerCase()) {
      case 'tomato':
        return (
          <svg width={s} height={s} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Tomato Body */}
            <circle cx="16" cy="18" r="11" fill="#ef4444" />
            <path d="M16 7C11 7 8 11.5 8 18C8 24.5 11.5 28 16 28C20.5 28 24 24.5 24 18C24 11.5 21 7 16 7Z" fill="#dc2626" />
            {/* Highlight */}
            <ellipse cx="12" cy="14" rx="3" ry="1.5" transform="rotate(-30 12 14)" fill="#fca5a5" opacity="0.6" />
            {/* Green Stem and Calyx */}
            <path d="M16 3V7M16 7L12 5M16 7L20 5M16 7L13 9M16 7L19 9" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="16" cy="7" r="1.5" fill="#166534" />
          </svg>
        );

      case 'potato':
        return (
          <svg width={s} height={s} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Potato Body */}
            <path d="M7 16C7 10.5 11 7 18 7C24.5 7 26.5 11.5 26.5 16.5C26.5 21.5 22.5 26 15 26C8.5 26 7 21 7 16Z" fill="#d97706" />
            <path d="M8.5 17C8.5 12 12 8.5 18 8.5C23.5 8.5 25 12.5 25 16.5C25 20.5 21.5 24.5 15.5 24.5C10 24.5 8.5 21 8.5 17Z" fill="#b45309" opacity="0.85" />
            {/* Eyes / Dimples */}
            <ellipse cx="13" cy="13" rx="1.5" ry="0.8" fill="#78350f" opacity="0.7" />
            <ellipse cx="20" cy="15" rx="1.5" ry="0.8" fill="#78350f" opacity="0.7" />
            <ellipse cx="15" cy="20" rx="1.8" ry="0.8" fill="#78350f" opacity="0.7" />
            {/* Small Sprout */}
            <path d="M18 7C18 5 19 4 21 4" stroke="#65a30d" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );

      case 'carrot':
        return (
          <svg width={s} height={s} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Carrot Greens */}
            <path d="M16 10L14 3M16 10L18 3M16 10L11 6M16 10L21 6" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" />
            {/* Carrot Body */}
            <path d="M11 10C11 9 21 9 21 10L17 28C16.5 29 15.5 29 15 28L11 10Z" fill="#ea580c" />
            {/* Horizontal Ridges */}
            <line x1="13" y1="14" x2="19" y2="14" stroke="#c2410c" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="14" y1="18" x2="18" y2="18" stroke="#c2410c" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="15" y1="22" x2="17" y2="22" stroke="#c2410c" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        );

      case 'green_peas':
        return (
          <svg width={s} height={s} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Opened Pea Pod */}
            <path d="M5 24C9 26 21 24 27 9C24 15 13 21 5 24Z" fill="#15803d" />
            <path d="M4 22C8 24 19 22 25 7C22 13 11 19 4 22Z" fill="#16a34a" />
            {/* Round Peas */}
            <circle cx="10" cy="20" r="3" fill="#86efac" stroke="#166534" strokeWidth="1" />
            <circle cx="16" cy="16" r="3" fill="#86efac" stroke="#166534" strokeWidth="1" />
            <circle cx="21" cy="11" r="2.8" fill="#86efac" stroke="#166534" strokeWidth="1" />
            {/* Stem */}
            <path d="M26 8C27 6 28 5 30 5" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );

      case 'cabbage':
        return (
          <svg width={s} height={s} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Outer Leaves */}
            <circle cx="16" cy="16" r="11" fill="#059669" />
            <path d="M6 14C9 8 23 8 26 14C23 20 9 20 6 14Z" fill="#10b981" opacity="0.9" />
            <path d="M16 6C10 10 10 22 16 26C22 22 22 10 16 6Z" fill="#34d399" opacity="0.8" />
            <path d="M12 12C14 10 18 10 20 12C20 16 12 16 12 12Z" fill="#a7f3d0" />
            {/* Leaf Veins */}
            <path d="M16 6V26" stroke="#ecfdf5" strokeWidth="1" strokeLinecap="round" />
          </svg>
        );

      case 'onion':
        return (
          <svg width={s} height={s} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Onion Bulb */}
            <path d="M16 7C10 7 7 12 7 18C7 24 11 27 16 27C21 27 25 24 25 18C25 12 22 7 16 7Z" fill="#9333ea" />
            <path d="M16 8C12 8 9.5 12.5 9.5 18C9.5 23 12.5 25.5 16 25.5C19.5 25.5 22.5 23 22.5 18C22.5 12.5 20 8 16 8Z" fill="#a855f7" />
            {/* Scales/Stripes */}
            <path d="M16 8V25M13 10C11.5 13 11.5 21 13 24M19 10C20.5 13 20.5 21 19 24" stroke="#c084fc" strokeWidth="1" strokeLinecap="round" />
            {/* Top Shoot & Root */}
            <path d="M16 7L16 2M16 4L18 2" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M14 27L13 30M16 27L16 30M18 27L19 30" stroke="#d8b4fe" strokeWidth="1" strokeLinecap="round" />
          </svg>
        );

      case 'maize':
        return (
          <svg width={s} height={s} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Corn Ear */}
            <rect x="12" y="7" width="8" height="17" rx="4" fill="#eab308" />
            {/* Kernels Grid Pattern */}
            <path d="M12 11H20M12 15H20M12 19H20M16 7V24" stroke="#ca8a04" strokeWidth="1" strokeLinecap="round" />
            {/* Husk Leaves */}
            <path d="M12 23C9 21 7 14 10 10C11 15 12 20 14 24" fill="#84cc16" opacity="0.9" />
            <path d="M20 23C23 21 25 14 22 10C21 15 20 20 18 24" fill="#65a30d" opacity="0.9" />
            {/* Stem */}
            <path d="M16 24V28" stroke="#4d7c0f" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case 'soybean':
        return (
          <svg width={s} height={s} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Soybean Pod */}
            <path d="M7 21C9 23 18 24 24 14C23 18 16 22 7 21Z" fill="#4d7c0f" />
            <path d="M6 19C10 22 18 20 23 11C20 16 13 19 6 19Z" fill="#65a30d" />
            {/* Round Soybeans inside pod */}
            <circle cx="11" cy="18" r="3" fill="#bef264" stroke="#365314" strokeWidth="1" />
            <circle cx="17" cy="14" r="3" fill="#bef264" stroke="#365314" strokeWidth="1" />
            {/* Leaflet */}
            <path d="M23 11C25 8 28 8 29 10C29 13 26 13 23 11Z" fill="#84cc16" />
          </svg>
        );

      case 'wheat':
        return (
          <svg width={s} height={s} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Central Stem */}
            <path d="M16 28V6" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" />
            {/* Wheat Grains / Spikelets */}
            <ellipse cx="14" cy="9" rx="2.5" ry="4" transform="rotate(-30 14 9)" fill="#f59e0b" stroke="#b45309" strokeWidth="0.8" />
            <ellipse cx="18" cy="9" rx="2.5" ry="4" transform="rotate(30 18 9)" fill="#f59e0b" stroke="#b45309" strokeWidth="0.8" />
            <ellipse cx="13.5" cy="15" rx="2.5" ry="4" transform="rotate(-30 13.5 15)" fill="#f59e0b" stroke="#b45309" strokeWidth="0.8" />
            <ellipse cx="18.5" cy="15" rx="2.5" ry="4" transform="rotate(30 18.5 15)" fill="#f59e0b" stroke="#b45309" strokeWidth="0.8" />
            <ellipse cx="14" cy="21" rx="2.5" ry="4" transform="rotate(-30 14 21)" fill="#d97706" stroke="#b45309" strokeWidth="0.8" />
            <ellipse cx="18" cy="21" rx="2.5" ry="4" transform="rotate(30 18 21)" fill="#d97706" stroke="#b45309" strokeWidth="0.8" />
            {/* Awns (Beards) */}
            <path d="M13 7L10 3M19 7L22 3M16 6L16 2" stroke="#d97706" strokeWidth="1" strokeLinecap="round" />
          </svg>
        );

      case 'chickpea':
        return (
          <svg width={s} height={s} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Swollen Pod */}
            <path d="M9 18C8 12 13 8 19 8C23 8 25 11 25 15C25 21 19 24 13 24C10 24 9 21 9 18Z" fill="#0d9488" />
            {/* Inside Chickpea Grain */}
            <path d="M14 18C13 14 16 12 19 13C21 14 21 18 19 20C16 21 14 20 14 18Z" fill="#ccfbf1" stroke="#0f766e" strokeWidth="1" />
            {/* Beak / Tip */}
            <path d="M19 13C20 11 22 11 22 13" stroke="#0f766e" strokeWidth="1" strokeLinecap="round" />
            {/* Pod Stem */}
            <path d="M19 8C19 5 21 4 23 4" stroke="#115e59" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );

      case 'pearl_millet':
      case 'sorghum':
        return (
          <svg width={s} height={s} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 28V6" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
            {/* Dense Panicle */}
            <rect x="13" y="6" width="6" height="18" rx="3" fill="#c2410c" />
            <circle cx="14" cy="8" r="1.5" fill="#f97316" />
            <circle cx="18" cy="8" r="1.5" fill="#f97316" />
            <circle cx="14" cy="12" r="1.5" fill="#fed7aa" />
            <circle cx="18" cy="12" r="1.5" fill="#fed7aa" />
            <circle cx="14" cy="16" r="1.5" fill="#f97316" />
            <circle cx="18" cy="16" r="1.5" fill="#f97316" />
            <circle cx="15" cy="20" r="1.5" fill="#ea580c" />
            {/* Whisker Bristles */}
            <path d="M13 7L10 6M19 7L22 6M13 13L9 13M19 13L23 13M13 19L10 20M19 19L22 20" stroke="#9a3412" strokeWidth="1" strokeLinecap="round" />
          </svg>
        );

      case 'rice':
        return (
          <svg width={s} height={s} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Drooping Stem */}
            <path d="M10 27C12 21 16 15 22 7C24 9 24 13 22 17" stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round" />
            {/* Rice Grains */}
            <ellipse cx="18" cy="10" rx="1.5" ry="3" transform="rotate(35 18 10)" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
            <ellipse cx="21" cy="12" rx="1.5" ry="3" transform="rotate(45 21 12)" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
            <ellipse cx="23" cy="16" rx="1.5" ry="3" transform="rotate(70 23 16)" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
            <ellipse cx="21" cy="20" rx="1.5" ry="3" transform="rotate(85 21 20)" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
            <ellipse cx="17" cy="23" rx="1.5" ry="3" transform="rotate(110 17 23)" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
          </svg>
        );

      case 'groundnut':
        return (
          <svg width={s} height={s} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Peanut Pod with waist */}
            <path d="M12 8C15 8 16 11 16 13C16 15 15 16 14 17C13 18 12 20 12 23C12 26 15 27 18 26C21 25 21 22 20 20C19 18 18 17 19 15C20 13 22 11 21 8C20 6 15 5 12 8Z" fill="#d97706" />
            {/* Net Textures */}
            <path d="M14 10C17 10 18 12 18 14M14 20C17 19 18 22 17 24" stroke="#92400e" strokeWidth="1" strokeLinecap="round" />
          </svg>
        );

      case 'cotton':
        return (
          <svg width={s} height={s} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Calyx Bracts */}
            <path d="M10 24L16 27L22 24L19 28L13 28L10 24Z" fill="#15803d" />
            {/* Fluffy Cotton Boll */}
            <circle cx="12" cy="17" r="5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <circle cx="20" cy="17" r="5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <circle cx="16" cy="12" r="5" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
            <circle cx="16" cy="18" r="4.5" fill="#f8fafc" />
            {/* Central stem */}
            <path d="M16 27V30" stroke="#166534" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );

      case 'cover_crop_mix':
        return (
          <svg width={s} height={s} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Clover Leaves */}
            <circle cx="12" cy="12" r="4" fill="#22c55e" />
            <circle cx="20" cy="12" r="4" fill="#16a34a" />
            <circle cx="16" cy="8" r="4" fill="#15803d" />
            {/* Radish Taproot Drill */}
            <path d="M16 16L18 27L16 29L14 27L16 16Z" fill="#e11d48" />
            <line x1="16" y1="16" x2="16" y2="29" stroke="#be123c" strokeWidth="1" />
            {/* Root Hairs */}
            <line x1="15" y1="23" x2="13" y2="24" stroke="#fb7185" strokeWidth="1" strokeLinecap="round" />
            <line x1="17" y1="25" x2="19" y2="26" stroke="#fb7185" strokeWidth="1" strokeLinecap="round" />
          </svg>
        );

      default:
        return <Sprout size={s} className="text-[#2d6a4f]" />;
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 ${dim.frame} ${meta.bgColor} border ${meta.borderColor} shadow-2xs relative ${className}`}
      title={`${cropId} (${meta.categoryLabel})`}
    >
      {renderVectorIcon()}
      {showBadge && (
        <span className="absolute -bottom-1 -right-1 text-[10px] leading-none">
          {meta.emoji}
        </span>
      )}
    </div>
  );
}
