import React from 'react';
import type { Tool, ViewMode } from '../../types/editor';

interface ToolbarProps {
  tool: Tool;
  viewMode: ViewMode;
  onToolChange: (tool: Tool) => void;
  onViewModeChange: (mode: ViewMode) => void;
}

interface ToolButton {
  tool: Tool;
  icon: string;
  label: string;
}

const toolButtons: ToolButton[] = [
  { tool: 'select', icon: '👆', label: 'Select' },
  { tool: 'wall', icon: '🧱', label: 'Стена' },
  { tool: 'window', icon: '🪟', label: 'Окно' },
  { tool: 'door', icon: '🚪', label: 'Дверь' },
  { tool: 'stool', icon: '🪑', label: 'Стул' },
  { tool: 'table', icon: '🔲', label: 'Стол' },
  { tool: 'sofa', icon: '🛋️', label: 'Диван/Кресло' },
  { tool: 'bed', icon: '🛏️', label: 'Кровать' },
  { tool: 'sink', icon: '🚰', label: 'Раковина' },
  { tool: 'shower', icon: '🚿', label: 'Душ/Ванна' },
  { tool: 'toilet', icon: '🚽', label: 'Туалет' },
  { tool: 'tv', icon: '📺', label: 'Телевизор' },
];

export const Toolbar: React.FC<ToolbarProps> = ({ 
  tool, 
  viewMode, 
  onToolChange, 
  onViewModeChange 
}) => {
  return (
    <div className="bg-white border-b border-gray-200 p-2">
      <div className="flex items-center justify-between">
        {/* Tool buttons */}
        <div className="flex gap-2">
          {toolButtons.map(({ tool: t, icon, label }) => (
            <button
              key={t}
              onClick={() => onToolChange(t)}
              className={`px-3 py-2 rounded flex flex-col items-center gap-1 transition-all ${
                tool === t 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              title={label}
            >
              <span className="text-xl">{icon}</span>
              <span className="text-xs whitespace-nowrap">{label}</span>
            </button>
          ))}
        </div>
        
        {/* View mode and actions */}
        <div className="flex gap-2 items-center">
          <button
            onClick={() => onViewModeChange('2D')}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              viewMode === '2D' 
                ? 'bg-green-500 text-white' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            2D
          </button>
          <button
            onClick={() => onViewModeChange('3D')}
            disabled
            className="px-4 py-2 rounded font-medium bg-gray-100 text-gray-400 cursor-not-allowed"
            title="3D режим в разработке"
          >
            3D
          </button>
          <button 
            className="px-4 py-2 bg-purple-100 text-purple-700 rounded font-medium hover:bg-purple-200 transition-colors"
            disabled
            title="Генерация видео в разработке"
          >
            Click to generate video of home!
          </button>
        </div>
      </div>
    </div>
  );
};
