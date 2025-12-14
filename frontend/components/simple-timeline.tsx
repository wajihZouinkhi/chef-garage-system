'use client';

import React from 'react';

interface TimelineItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  color?: string;
  bgColor?: string;
  isLast?: boolean;
}

interface TimelineProps {
  children: React.ReactNode;
}

export function SimpleTimeline({ children }: TimelineProps) {
  return (
    <div className="relative">
      {children}
    </div>
  );
}

export function SimpleTimelineItem({ children, icon, color = '#6b7280', bgColor = '#f3f4f6', isLast = false }: TimelineItemProps) {
  return (
    <div className="relative flex items-start pb-8">
      {/* Timeline line */}
      {!isLast && (
        <div 
          className="absolute left-5 top-12 w-0.5 h-full" 
          style={{ backgroundColor: '#d1d5db' }}
        />
      )}
      
      {/* Timeline dot */}
      <div 
        className="relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 flex-shrink-0"
        style={{ 
          backgroundColor: bgColor, 
          borderColor: color 
        }}
      >
        {icon}
      </div>
      
      {/* Content */}
      <div className="ml-6 flex-1">
        {children}
      </div>
    </div>
  );
}