import React, { useState, useEffect } from 'react';
import type { Wall } from '../../types/editor';
import { calculateDistance, pixelsToMm, mmToPixels, formatDistance } from '../../utils/geometry';
import { WALL_THICKNESS } from '../../constants/editor';

interface WallPropertiesPanelProps {
  wall: Wall;
  onUpdate: (wallId: string, updates: Partial<Wall>) => void;
  onClose: () => void;
  onDelete: (wallId: string) => void;
}

/**
 * Wall Properties Panel Component
 * Similar to Planner 5D's wall editing interface
 * Allows editing wall dimensions and properties
 */
export const WallPropertiesPanel: React.FC<WallPropertiesPanelProps> = ({
  wall,
  onUpdate,
  onClose,
  onDelete
}) => {
  const currentLength = pixelsToMm(calculateDistance(wall.startPoint, wall.endPoint));
  const [length, setLength] = useState(Math.round(currentLength));
  const [height, setHeight] = useState(wall.height || 270); // Default 2.7m
  const [thickness, setThickness] = useState(wall.thickness || WALL_THICKNESS);

  useEffect(() => {
    setLength(Math.round(pixelsToMm(calculateDistance(wall.startPoint, wall.endPoint))));
    setHeight(wall.height || 270);
    setThickness(wall.thickness || WALL_THICKNESS);
  }, [wall]);

  const handleLengthChange = (newLength: number) => {
    if (newLength < 100) return; // Minimum 100mm
    
    setLength(newLength);
    
    // Calculate new endpoint maintaining the same angle
    const angle = Math.atan2(
      wall.endPoint.y - wall.startPoint.y,
      wall.endPoint.x - wall.startPoint.x
    );
    
    const newLengthPixels = mmToPixels(newLength);
    const newEndPoint = {
      x: wall.startPoint.x + Math.cos(angle) * newLengthPixels,
      y: wall.startPoint.y + Math.sin(angle) * newLengthPixels
    };
    
    onUpdate(wall.id, { endPoint: newEndPoint });
  };

  const handleHeightChange = (newHeight: number) => {
    if (newHeight < 200 || newHeight > 500) return; // Between 2m and 5m
    setHeight(newHeight);
    onUpdate(wall.id, { height: newHeight });
  };

  const handleThicknessChange = (newThickness: number) => {
    if (newThickness < 5 || newThickness > 30) return; // Between 5cm and 30cm
    setThickness(newThickness);
    onUpdate(wall.id, { thickness: newThickness });
  };

  const handleDelete = () => {
    if (confirm('Вы уверены, что хотите удалить эту стену?')) {
      onDelete(wall.id);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t-4 border-blue-500 z-50 animate-slide-up">
      <div className="max-w-4xl mx-auto px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Редактирование стены</h3>
            <p className="text-sm text-gray-500 mt-1">
              Настройте параметры выбранной стены
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-2xl w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100"
            title="Закрыть (ESC)"
          >
            ×
          </button>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Length Control */}
          <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-xl border-2 border-blue-100 hover:border-blue-300 transition-all shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <span className="mr-2">📏</span>
              Длина стены
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={length}
                onChange={(e) => handleLengthChange(Number(e.target.value))}
                className="w-24 px-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold text-lg text-gray-900"
                min="100"
                step="10"
              />
              <span className="text-gray-900 font-medium whitespace-nowrap">
                {formatDistance(length)}
              </span>
            </div>
            <input
              type="range"
              value={length}
              onChange={(e) => handleLengthChange(Number(e.target.value))}
              min="100"
              max="10000"
              step="10"
              className="w-full mt-3 accent-blue-500"
            />
          </div>

          {/* Height Control */}
          <div className="bg-gradient-to-br from-green-50 to-white p-5 rounded-xl border-2 border-green-100 hover:border-green-300 transition-all shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <span className="mr-2">📐</span>
              Высота стены
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={height}
                onChange={(e) => handleHeightChange(Number(e.target.value))}
                className="w-24 px-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all font-semibold text-lg text-gray-900"
                min="200"
                max="500"
                step="5"
              />
              <span className="text-gray-900 font-medium whitespace-nowrap">
                {(height / 100).toFixed(2)}m
              </span>
            </div>
            <input
              type="range"
              value={height}
              onChange={(e) => handleHeightChange(Number(e.target.value))}
              min="200"
              max="500"
              step="5"
              className="w-full mt-3 accent-green-500"
            />
          </div>

          {/* Thickness Control */}
          <div className="bg-gradient-to-br from-purple-50 to-white p-5 rounded-xl border-2 border-purple-100 hover:border-purple-300 transition-all shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <span className="mr-2">📊</span>
              Толщина стены
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={thickness}
                onChange={(e) => handleThicknessChange(Number(e.target.value))}
                className="w-24 px-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-semibold text-lg text-gray-900"
                min="5"
                max="30"
                step="1"
              />
              <span className="text-gray-900 font-medium whitespace-nowrap">
                {thickness}см
              </span>
            </div>
            <input
              type="range"
              value={thickness}
              onChange={(e) => handleThicknessChange(Number(e.target.value))}
              min="5"
              max="30"
              step="1"
              className="w-full mt-3 accent-purple-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <button
            onClick={handleDelete}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg flex items-center space-x-2 transform hover:scale-105"
          >
            <span>🗑️</span>
            <span>Удалить стену</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all transform hover:scale-105"
            >
              Закрыть
            </button>
            <div className="text-sm text-gray-500">
              Нажмите ESC для закрытия
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

