import { useState, useCallback, useRef } from 'react';
import type { Point, Wall, EditorElement, Tool } from '../types/editor';
import { WALL_THICKNESS, DOUBLE_CLICK_THRESHOLD } from '../constants/editor';
import { findSnapPoint, isClosingShape, snapToAxis, findAxisSnapPoints } from '../utils/geometry';

interface UseWallDrawingProps {
  tool: Tool;
  elements: EditorElement[];
  onAddElement: (element: EditorElement) => void;
  onFinishDrawing: () => void;
}

export const useWallDrawing = ({
  tool,
  elements,
  onAddElement,
  onFinishDrawing
}: UseWallDrawingProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingStart, setDrawingStart] = useState<Point | null>(null);
  const [previewEnd, setPreviewEnd] = useState<Point | null>(null);
  const [isAxisSnapped, setIsAxisSnapped] = useState(false);
  const lastClickTimeRef = useRef<number>(0);

  /**
   * Finish the wall drawing session - RESET ALL STATE
   */
  const finishWallDrawing = useCallback(() => {
    setIsDrawing(false);
    setDrawingStart(null);
    setPreviewEnd(null);
    setIsAxisSnapped(false);
    onFinishDrawing();
  }, [onFinishDrawing]);

  /**
   * Handle mouse move for dynamic preview with axis snapping
   */
  const handleMouseMove = useCallback((point: Point) => {
    if (tool === 'wall' && drawingStart && isDrawing) {
      // First try to snap to existing points
      let snappedPoint = findSnapPoint(point, elements);
      
      // Then try axis alignment with starting point
      if (drawingStart) {
        const axisSnapped = snapToAxis(snappedPoint, drawingStart);
        
        // Also check axis alignment with other wall endpoints
        const axisSnapResult = findAxisSnapPoints(axisSnapped, elements);
        
        if (axisSnapResult.isSnapped) {
          snappedPoint = axisSnapResult.point;
          setIsAxisSnapped(true);
        } else if (axisSnapped.x !== snappedPoint.x || axisSnapped.y !== snappedPoint.y) {
          snappedPoint = axisSnapped;
          setIsAxisSnapped(true);
        } else {
          setIsAxisSnapped(false);
        }
      }
      
      setPreviewEnd(snappedPoint);
    }
  }, [tool, drawingStart, isDrawing, elements]);

  /**
   * Start or continue wall drawing
   */
  const handleClick = useCallback((point: Point) => {
    if (tool !== 'wall') return;

    const now = Date.now();
    const timeSinceLastClick = now - lastClickTimeRef.current;
    lastClickTimeRef.current = now;

    // Double click detection - finish drawing
    if (timeSinceLastClick < DOUBLE_CLICK_THRESHOLD && isDrawing) {
      finishWallDrawing();
      return;
    }

    // Use previewEnd if we're drawing (it has all snapping applied)
    // Otherwise snap the click point
    let snappedPoint: Point;
    if (isDrawing && previewEnd) {
      snappedPoint = previewEnd;
    } else {
      snappedPoint = findSnapPoint(point, elements);
    }

    // Check if closing the shape
    if (isDrawing && isClosingShape(snappedPoint, elements)) {
      // Close the shape by connecting to the first point
      if (drawingStart) {
        const firstWall = elements.filter(el => el.type === 'wall')[0] as Wall;
        const closingWall: Wall = {
          id: Date.now().toString(),
          type: 'wall',
          startPoint: drawingStart,
          endPoint: firstWall.startPoint,
          thickness: WALL_THICKNESS
        };
        onAddElement(closingWall);
      }
      finishWallDrawing();
      return;
    }

    // First click - start new wall
    if (!isDrawing) {
      setDrawingStart(snappedPoint);
      setPreviewEnd(snappedPoint);
      setIsDrawing(true);
      return;
    }

    // Subsequent clicks - create wall and continue
    if (drawingStart) {
      const newWall: Wall = {
        id: Date.now().toString(),
        type: 'wall',
        startPoint: drawingStart,
        endPoint: snappedPoint,
        thickness: WALL_THICKNESS
      };
      
      onAddElement(newWall);
      
      // Continue drawing from the end point
      setDrawingStart(snappedPoint);
      setPreviewEnd(null);
    }
  }, [tool, drawingStart, previewEnd, isDrawing, elements, onAddElement, finishWallDrawing]);

  /**
   * Cancel drawing (ESC key) - RESET ALL STATE
   */
  const cancelDrawing = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      setDrawingStart(null);
      setPreviewEnd(null);
      setIsAxisSnapped(false);
    }
  }, [isDrawing]);

  return {
    isDrawing,
    drawingStart,
    previewEnd,
    isAxisSnapped,
    handleClick,
    handleMouseMove,
    cancelDrawing,
    finishDrawing: finishWallDrawing
  };
};
