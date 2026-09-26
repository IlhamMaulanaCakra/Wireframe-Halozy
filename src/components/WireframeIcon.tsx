import React from 'react';
export const WireframeIcon = ({ className }: { className?: string }) => (
  <svg className={`text-gray-500 ${className || "w-4 h-4"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" preserveAspectRatio="none">
    <rect width="24" height="24" strokeWidth="1" />
    <line x1="0" y1="0" x2="24" y2="24" strokeWidth="1" />
    <line x1="24" y1="0" x2="0" y2="24" strokeWidth="1" />
  </svg>
);
