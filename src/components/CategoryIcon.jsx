import React from 'react';
import * as LucideIcons from 'lucide-react';

export default function CategoryIcon({ name, className = "w-5 h-5", color }) {
  const IconComponent = LucideIcons[name] || LucideIcons.Tag;
  return (
    <IconComponent 
      className={className} 
      style={color ? { color } : undefined} 
      strokeWidth={2}
    />
  );
}
