import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * DepartmentBackground Component
 * 
 * Displays contextual civic-tech background images based on selected complaint department.
 * Backgrounds are slightly blurred and darkened to ensure text readability.
 * 
 * Usage:
 * <DepartmentBackground department="electricity" blur="md" darkening="40" />
 */

const DEPARTMENT_BACKGROUNDS = {
  roads_transport: {
    name: 'Roads & Transport',
    image: '/backgrounds/roads_transport.jpg',
    fallbackColor: 'from-slate-600 to-slate-700',
    emoji: '🚗',
  },
  electricity: {
    name: 'Electricity',
    image: '/backgrounds/electricity.jpg',
    fallbackColor: 'from-yellow-600 to-amber-700',
    emoji: '⚡',
  },
  water_supply: {
    name: 'Water Supply',
    image: '/backgrounds/water_supply.jpg',
    fallbackColor: 'from-cyan-600 to-blue-700',
    emoji: '💧',
  },
  sanitation: {
    name: 'Sanitation',
    image: '/backgrounds/sanitation.jpg',
    fallbackColor: 'from-emerald-600 to-green-700',
    emoji: '🗑️',
  },
  drainage: {
    name: 'Drainage',
    image: '/backgrounds/drainage.jpg',
    fallbackColor: 'from-slate-600 to-blue-700',
    emoji: '🌊',
  },
  public_property: {
    name: 'Public Property',
    image: '/backgrounds/public_property.jpg',
    fallbackColor: 'from-purple-600 to-violet-700',
    emoji: '🏗️',
  },
  streetlight: {
    name: 'Streetlight',
    image: '/backgrounds/streetlight.jpg',
    fallbackColor: 'from-orange-600 to-yellow-700',
    emoji: '💡',
  },
  illegal_dumping: {
    name: 'Illegal Dumping',
    image: '/backgrounds/illegal_dumping.jpg',
    fallbackColor: 'from-red-600 to-orange-700',
    emoji: '🚫',
  },
};

export default function DepartmentBackground({
  department = 'roads_transport',
  blur = 'md',
  darkening = '40',
  children,
  overlay = true,
  height = 'h-96',
  animated = true,
}) {
  const deptConfig = DEPARTMENT_BACKGROUNDS[department] || DEPARTMENT_BACKGROUNDS.roads_transport;

  // Blur mapping
  const blurMap = {
    none: 'blur-0',
    sm: 'blur-sm',
    md: 'blur-md',
    lg: 'blur-lg',
    xl: 'blur-xl',
  };

  // Handle image load error
  const handleImageError = (e) => {
    e.target.style.display = 'none';
  };

  return (
    <motion.div
      initial={animated ? { opacity: 0 } : { opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative ${height} w-full overflow-hidden rounded-2xl`}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        {/* Fallback gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${deptConfig.fallbackColor}`} />

        {/* Actual background image */}
        <img
          src={deptConfig.image}
          alt={deptConfig.name}
          className={`absolute inset-0 w-full h-full object-cover ${blurMap[blur]}`}
          onError={handleImageError}
          loading="lazy"
        />
      </div>

      {/* Dark overlay for readability */}
      {overlay && (
        <div
          className="absolute inset-0 bg-black/40"
          style={{ opacity: parseInt(darkening) / 100 }}
        />
      )}

      {/* Content overlay */}
      {children && (
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      )}

      {/* Department badge (optional) */}
      <div className="absolute top-4 left-4 z-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg">
          <span className="text-xl">{deptConfig.emoji}</span>
          <span className="text-sm font-semibold text-gray-800">{deptConfig.name}</span>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Simpler version - just background without children
 */
export function DepartmentBackgroundImage({
  department = 'roads_transport',
  blur = 'md',
  darkening = '40',
  height = 'h-96',
  rounded = 'rounded-2xl',
  shadow = true,
}) {
  const deptConfig = DEPARTMENT_BACKGROUNDS[department] || DEPARTMENT_BACKGROUNDS.roads_transport;

  const blurMap = {
    none: 'blur-0',
    sm: 'blur-sm',
    md: 'blur-md',
    lg: 'blur-lg',
    xl: 'blur-xl',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative ${height} w-full overflow-hidden ${rounded} ${
        shadow ? 'shadow-2xl' : ''
      }`}
    >
      {/* Fallback gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${deptConfig.fallbackColor}`} />

      {/* Background image */}
      <img
        src={deptConfig.image}
        alt={deptConfig.name}
        className={`absolute inset-0 w-full h-full object-cover ${blurMap[blur]}`}
        loading="lazy"
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: parseInt(darkening) / 100 }}
      />
    </motion.div>
  );
}

/**
 * Export department config for other components
 */
export { DEPARTMENT_BACKGROUNDS };
