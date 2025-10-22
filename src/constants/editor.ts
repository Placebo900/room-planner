// Constants for the room planner editor

export const SCALE = 0.1; // 1px = 10mm
export const GRID_SIZE = 50; // 500mm grid (5cm in pixels)
export const GRID_MAJOR_SIZE = 100; // 1000mm grid (10cm) - major grid lines
export const WALL_THICKNESS = 10;
export const SNAP_DISTANCE = 20; // Distance for snapping points together
export const AXIS_SNAP_DISTANCE = 15; // Distance for snapping to horizontal/vertical axis
export const DOUBLE_CLICK_THRESHOLD = 300; // ms for detecting double click
export const MIN_WALL_LENGTH = 50; // Minimum wall length in pixels (500mm)

// Colors
export const COLORS = {
  grid: {
    minor: '#f5f5f5',
    major: '#e8e8e8',
    origin: '#d0d0d0'
  },
  wall: {
    default: '#1f2937',
    selected: '#3b82f6',
    hover: '#4b5563'
  },
  preview: {
    line: '#22c55e',
    snapIndicator: '#f59e0b'
  },
  dimensions: {
    text: '#2563eb',
    background: 'rgba(255, 255, 255, 0.9)'
  }
} as const;

// UI Constants
export const HOVER_SCALE = 1.05;
export const SELECTION_GLOW = 8;
