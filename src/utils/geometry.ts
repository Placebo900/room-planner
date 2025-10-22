import type { Point, Wall, EditorElement } from '../types/editor';
import { SCALE, SNAP_DISTANCE, AXIS_SNAP_DISTANCE } from '../constants/editor';

/**
 * Calculate Euclidean distance between two points
 */
export const calculateDistance = (p1: Point, p2: Point): number => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

/**
 * Calculate angle between three points (in degrees)
 */
export const calculateAngle = (p1: Point, p2: Point, p3: Point): number => {
  const angle1 = Math.atan2(p1.y - p2.y, p1.x - p2.x);
  const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
  let angle = (angle2 - angle1) * (180 / Math.PI);
  
  if (angle < 0) angle += 360;
  if (angle > 180) angle = 360 - angle;
  
  return Math.round(angle);
};

/**
 * Get midpoint between two points
 */
export const getMidpoint = (p1: Point, p2: Point): Point => {
  return { 
    x: (p1.x + p2.x) / 2, 
    y: (p1.y + p2.y) / 2 
  };
};

/**
 * Convert distance from pixels to millimeters
 */
export const pixelsToMm = (pixels: number): number => {
  return pixels / SCALE;
};

/**
 * Convert distance from millimeters to pixels
 */
export const mmToPixels = (mm: number): number => {
  return mm * SCALE;
};

/**
 * Snap point to horizontal/vertical axis relative to a reference point
 * Returns snapped point if close to axis, otherwise returns original
 * Rounds coordinates to avoid floating point precision issues
 */
export const snapToAxis = (point: Point, referencePoint: Point): Point => {
  const dx = Math.abs(point.x - referencePoint.x);
  const dy = Math.abs(point.y - referencePoint.y);
  
  // Snap to vertical axis (same X coordinate)
  if (dx < AXIS_SNAP_DISTANCE && dy > dx) {
    return { 
      x: Math.round(referencePoint.x), 
      y: Math.round(point.y) 
    };
  }
  
  // Snap to horizontal axis (same Y coordinate)
  if (dy < AXIS_SNAP_DISTANCE && dx > dy) {
    return { 
      x: Math.round(point.x), 
      y: Math.round(referencePoint.y) 
    };
  }
  
  return { 
    x: Math.round(point.x), 
    y: Math.round(point.y) 
  };
};

/**
 * Check if point is aligned with another point horizontally or vertically
 */
export const isAxisAligned = (p1: Point, p2: Point): { 
  horizontal: boolean; 
  vertical: boolean 
} => {
  return {
    horizontal: Math.abs(p1.y - p2.y) < AXIS_SNAP_DISTANCE,
    vertical: Math.abs(p1.x - p2.x) < AXIS_SNAP_DISTANCE
  };
};

/**
 * Find the nearest snap point from existing walls
 * Returns the snap point if found within SNAP_DISTANCE, otherwise returns the original point
 * Ensures exact coordinate matching by using the wall's actual coordinates
 */
export const findSnapPoint = (point: Point, elements: EditorElement[]): Point => {
  const walls = elements.filter(el => el.type === 'wall') as Wall[];
  
  for (const wall of walls) {
    // Check startPoint - return exact wall coordinates
    if (calculateDistance(point, wall.startPoint) < SNAP_DISTANCE) {
      return { 
        x: Math.round(wall.startPoint.x), 
        y: Math.round(wall.startPoint.y) 
      };
    }
    // Check endPoint - return exact wall coordinates
    if (calculateDistance(point, wall.endPoint) < SNAP_DISTANCE) {
      return { 
        x: Math.round(wall.endPoint.x), 
        y: Math.round(wall.endPoint.y) 
      };
    }
  }
  
  return { 
    x: Math.round(point.x), 
    y: Math.round(point.y) 
  };
};

/**
 * Find snap points for axis alignment with existing walls
 * Returns point snapped to horizontal or vertical alignment with wall endpoints
 * Rounds coordinates to ensure perfect alignment
 */
export const findAxisSnapPoints = (
  point: Point, 
  elements: EditorElement[]
): { point: Point; isSnapped: boolean; alignedWith?: Point } => {
  const walls = elements.filter(el => el.type === 'wall') as Wall[];
  
  for (const wall of walls) {
    const endpoints = [wall.startPoint, wall.endPoint];
    
    for (const endpoint of endpoints) {
      const alignment = isAxisAligned(point, endpoint);
      
      if (alignment.horizontal && Math.abs(point.y - endpoint.y) < AXIS_SNAP_DISTANCE) {
        return { 
          point: { 
            x: Math.round(point.x), 
            y: Math.round(endpoint.y) 
          }, 
          isSnapped: true,
          alignedWith: endpoint
        };
      }
      
      if (alignment.vertical && Math.abs(point.x - endpoint.x) < AXIS_SNAP_DISTANCE) {
        return { 
          point: { 
            x: Math.round(endpoint.x), 
            y: Math.round(point.y) 
          }, 
          isSnapped: true,
          alignedWith: endpoint
        };
      }
    }
  }
  
  return { 
    point: { 
      x: Math.round(point.x), 
      y: Math.round(point.y) 
    }, 
    isSnapped: false 
  };
};

/**
 * Check if a point closes the shape (creates a closed polygon)
 * Returns true if the point is close to the first wall's start point
 */
export const isClosingShape = (point: Point, elements: EditorElement[]): boolean => {
  const walls = elements.filter(el => el.type === 'wall') as Wall[];
  
  if (walls.length < 2) return false;
  
  const firstWall = walls[0];
  return calculateDistance(point, firstWall.startPoint) < SNAP_DISTANCE;
};

/**
 * Get all wall endpoints for snapping
 */
export const getWallEndpoints = (elements: EditorElement[]): Point[] => {
  const walls = elements.filter(el => el.type === 'wall') as Wall[];
  const points: Point[] = [];
  
  walls.forEach(wall => {
    points.push(wall.startPoint, wall.endPoint);
  });
  
  return points;
};

/**
 * Calculate the angle of a line in degrees
 */
export const calculateLineAngle = (p1: Point, p2: Point): number => {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
};

/**
 * Check if two points are approximately equal (within a tolerance)
 */
export const pointsEqual = (p1: Point, p2: Point, tolerance: number = 1): boolean => {
  return calculateDistance(p1, p2) < tolerance;
};

/**
 * Get the last wall's endpoint (for continuing wall drawing)
 * Returns null to always start fresh (fixing the bug)
 */
export const getLastWallEndpoint = (_elements: EditorElement[]): Point | null => {
  // Always return null to prevent auto-continuation bug
  return null;
};

/**
 * Calculate perpendicular offset point
 * Used for positioning dimension labels away from walls
 */
export const getPerpendicularOffset = (
  p1: Point, 
  p2: Point, 
  distance: number
): Point => {
  const angle = calculateLineAngle(p1, p2);
  const perpAngle = angle + 90;
  const radians = (perpAngle * Math.PI) / 180;
  
  const midpoint = getMidpoint(p1, p2);
  
  return {
    x: midpoint.x + Math.cos(radians) * distance,
    y: midpoint.y + Math.sin(radians) * distance
  };
};

/**
 * Find the closest point on a wall to a given point
 * Used for placing windows/doors on walls
 */
export const getClosestPointOnWall = (point: Point, wall: Wall): Point => {
  const { startPoint, endPoint } = wall;
  
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  const lengthSquared = dx * dx + dy * dy;
  
  if (lengthSquared === 0) return startPoint;
  
  let t = ((point.x - startPoint.x) * dx + (point.y - startPoint.y) * dy) / lengthSquared;
  t = Math.max(0, Math.min(1, t));
  
  return {
    x: startPoint.x + t * dx,
    y: startPoint.y + t * dy
  };
};

/**
 * Check if a point is close to a wall
 */
export const isPointOnWall = (point: Point, wall: Wall, threshold: number = 20): boolean => {
  const closestPoint = getClosestPointOnWall(point, wall);
  return calculateDistance(point, closestPoint) < threshold;
};

/**
 * Format distance for display (converts to meters if > 1000mm)
 */
export const formatDistance = (mm: number): string => {
  if (mm >= 1000) {
    return `${(mm / 1000).toFixed(2)}m`;
  }
  return `${Math.round(mm)}mm`;
};
