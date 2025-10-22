import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Line, Circle, Text, Group } from 'react-konva';
import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import type { EditorElement, Point, Tool, Wall, Window as WindowType, Door, Furniture } from '../../types/editor';
import { Grid } from './Grid';
import { WallRender } from '../Elements/WallRender';
import { WindowRender } from '../Elements/WindowRender';
import { DoorRender } from '../Elements/DoorRender';
import { FurnitureRender } from '../Elements/FurnitureRender';
import { calculateDistance, pixelsToMm, formatDistance } from '../../utils/geometry';
import { COLORS } from '../../constants/editor';

interface EditorCanvasProps {
  width: number;
  height: number;
  elements: EditorElement[];
  selectedId: string | null;
  tool: Tool;
  isDrawing: boolean;
  drawingStart: Point | null;
  previewEnd: Point | null;
  isAxisSnapped: boolean;
  onStageClick: (point: Point) => void;
  onStageMouseMove: (point: Point) => void;
  onElementClick: (id: string) => void;
  onFurnitureDragEnd: (id: string, position: Point) => void;
  onWallEndpointDrag?: (wallId: string, isStart: boolean, newPoint: Point) => void;
  onWindowDrag?: (windowId: string, startPoint: Point, endPoint: Point) => void;
  onWindowEndpointDrag?: (windowId: string, isStart: boolean, newPoint: Point) => void;
  onDoorDrag?: (doorId: string, startPoint: Point, endPoint: Point) => void;
  onDoorEndpointDrag?: (doorId: string, isStart: boolean, newPoint: Point) => void;
}

const MIN_SCALE = 0.1;
const MAX_SCALE = 3;
const SCALE_BY = 1.1;

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  width,
  height,
  elements,
  selectedId,
  tool,
  isDrawing,
  drawingStart,
  previewEnd,
  isAxisSnapped,
  onStageClick,
  onStageMouseMove,
  onElementClick,
  onFurnitureDragEnd,
  onWallEndpointDrag,
  onWindowDrag,
  onWindowEndpointDrag,
  onDoorDrag,
  onDoorEndpointDrag
}) => {
  const stageRef = useRef<Konva.Stage>(null);
  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [isDraggingWallEndpoint, setIsDraggingWallEndpoint] = useState(false);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawing) {
        // ESC handled by parent
      }
      if (e.key === 'Delete' && selectedId) {
        // Delete handled by parent
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawing, selectedId]);

  // Handle zoom with mouse wheel / trackpad pinch
  const handleWheel = (e: KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    // Calculate new scale
    const delta = e.evt.deltaY;
    const scaleDirection = delta > 0 ? -1 : 1;
    const newScale = Math.max(
      MIN_SCALE,
      Math.min(MAX_SCALE, oldScale * (1 + scaleDirection * 0.05))
    );

    setStageScale(newScale);
    
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    
    setStagePos(newPos);
  };

  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;
    
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    // Transform pointer position based on current scale and position
    const point = {
      x: (pointer.x - stage.x()) / stage.scaleX(),
      y: (pointer.y - stage.y()) / stage.scaleY(),
    };

    // Only trigger if clicked on stage (not on an element)
    if (e.target === stage || e.target.getClassName() === 'Line') {
      onStageClick(point);
    }
  };

  const handleStageMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;
    
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    // Transform pointer position based on current scale and position
    const point = {
      x: (pointer.x - stage.x()) / stage.scaleX(),
      y: (pointer.y - stage.y()) / stage.scaleY(),
    };

    onStageMouseMove(point);
  };

  // Calculate preview line distance for display
  const previewDistance = drawingStart && previewEnd 
    ? pixelsToMm(calculateDistance(drawingStart, previewEnd))
    : null;

  // Determine cursor style based on tool
  const getCursorStyle = () => {
    if (tool === 'select') return 'cursor-default';
    if (tool === 'wall') return 'cursor-crosshair';
    return 'cursor-pointer';
  };

  return (
    <div className="relative">
      <Stage
        ref={stageRef}
        width={width}
        height={height}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stagePos.x}
        y={stagePos.y}
        draggable={tool === 'select' && !isDrawing && !isDraggingWallEndpoint}
        onWheel={handleWheel}
        onClick={handleStageClick}
        onMouseMove={handleStageMouseMove}
        onDragEnd={(e) => {
          setStagePos({ x: e.target.x(), y: e.target.y() });
        }}
        className={getCursorStyle()}
      >
      <Layer>
        {/* Professional Grid - dynamically sized based on viewport */}
        <Grid 
          width={width / stageScale + Math.abs(stagePos.x / stageScale) * 2} 
          height={height / stageScale + Math.abs(stagePos.y / stageScale) * 2}
          offsetX={stagePos.x / stageScale}
          offsetY={stagePos.y / stageScale}
        />
        
        {/* Render all elements */}
        {elements.map(element => {
          switch (element.type) {
            case 'wall':
              return (
                <WallRender
                  key={element.id}
                  wall={element as Wall}
                  onClick={onElementClick}
                  onEndpointDrag={onWallEndpointDrag}
                  onDragStart={() => setIsDraggingWallEndpoint(true)}
                  onDragEnd={() => setIsDraggingWallEndpoint(false)}
                  isSelected={selectedId === element.id}
                />
              );
            case 'window': {
              const windowEl = element as WindowType;
              const wall = elements.find(el => el.id === windowEl.wallId && el.type === 'wall') as Wall | undefined;
              return (
                <WindowRender
                  key={element.id}
                  window={windowEl}
                  wall={wall}
                  onClick={onElementClick}
                  onDrag={onWindowDrag}
                  onEndpointDrag={onWindowEndpointDrag}
                  isSelected={selectedId === element.id}
                />
              );
            }
            case 'door': {
              const doorEl = element as Door;
              const wall = elements.find(el => el.id === doorEl.wallId && el.type === 'wall') as Wall | undefined;
              return (
                <DoorRender
                  key={element.id}
                  door={doorEl}
                  wall={wall}
                  onClick={onElementClick}
                  onDrag={onDoorDrag}
                  onEndpointDrag={onDoorEndpointDrag}
                  isSelected={selectedId === element.id}
                />
              );
            }
            case 'furniture': {
              const walls = elements.filter(el => el.type === 'wall') as Wall[];
              return (
                <FurnitureRender
                  key={element.id}
                  furniture={element as Furniture}
                  walls={walls}
                  onClick={onElementClick}
                  onDragEnd={onFurnitureDragEnd}
                  isSelected={selectedId === element.id}
                />
              );
            }
            default:
              return null;
          }
        })}
        
        {/* Drawing preview line with axis snap indicator */}
        {isDrawing && drawingStart && previewEnd && (
          <Group>
            {/* Preview line */}
            <Line
              points={[
                drawingStart.x, 
                drawingStart.y, 
                previewEnd.x, 
                previewEnd.y
              ]}
              stroke={isAxisSnapped ? COLORS.preview.snapIndicator : COLORS.preview.line}
              strokeWidth={10}
              dash={[10, 5]}
              listening={false}
              opacity={0.8}
              shadowBlur={isAxisSnapped ? 12 : 6}
              shadowColor={isAxisSnapped ? COLORS.preview.snapIndicator : COLORS.preview.line}
            />
            
            {/* Distance label on preview line */}
            {previewDistance && (
              <Group
                x={(drawingStart.x + previewEnd.x) / 2}
                y={(drawingStart.y + previewEnd.y) / 2 - 35}
              >
                <Text
                  text={formatDistance(previewDistance)}
                  fontSize={16}
                  fontStyle="bold"
                  fill={isAxisSnapped ? COLORS.preview.snapIndicator : COLORS.preview.line}
                  align="center"
                  offsetX={40}
                  shadowBlur={4}
                  shadowColor="rgba(0, 0, 0, 0.5)"
                  listening={false}
                />
              </Group>
            )}
            
            {/* Snap indicator at endpoints */}
            <Circle
              x={drawingStart.x}
              y={drawingStart.y}
              radius={8}
              fill={COLORS.preview.line}
              opacity={0.7}
              listening={false}
            />
            <Circle
              x={previewEnd.x}
              y={previewEnd.y}
              radius={8}
              fill={isAxisSnapped ? COLORS.preview.snapIndicator : COLORS.preview.line}
              opacity={0.7}
              listening={false}
              shadowBlur={isAxisSnapped ? 8 : 0}
              shadowColor={COLORS.preview.snapIndicator}
            />
            
            {/* Axis alignment indicators */}
            {isAxisSnapped && (
              <>
                {/* Horizontal alignment line */}
                {Math.abs(drawingStart.y - previewEnd.y) < 2 && (
                  <Line
                    points={[0, previewEnd.y, width, previewEnd.y]}
                    stroke={COLORS.preview.snapIndicator}
                    strokeWidth={1}
                    dash={[5, 5]}
                    opacity={0.3}
                    listening={false}
                  />
                )}
                
                {/* Vertical alignment line */}
                {Math.abs(drawingStart.x - previewEnd.x) < 2 && (
                  <Line
                    points={[previewEnd.x, 0, previewEnd.x, height]}
                    stroke={COLORS.preview.snapIndicator}
                    strokeWidth={1}
                    dash={[5, 5]}
                    opacity={0.3}
                    listening={false}
                  />
                )}
              </>
            )}
          </Group>
        )}
      </Layer>
    </Stage>
    
    {/* Zoom controls */}
    <div className="absolute bottom-4 right-4 flex flex-col gap-2 bg-white p-2 rounded-lg shadow-lg border border-gray-200">
      <button
        onClick={() => {
          const newScale = Math.min(MAX_SCALE, stageScale * SCALE_BY);
          setStageScale(newScale);
        }}
        className="w-10 h-10 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-bold text-xl"
        title="Приблизить (Zoom In)"
      >
        +
      </button>
      <div className="text-center text-sm font-semibold text-gray-700">
        {Math.round(stageScale * 100)}%
      </div>
      <button
        onClick={() => {
          const newScale = Math.max(MIN_SCALE, stageScale / SCALE_BY);
          setStageScale(newScale);
        }}
        className="w-10 h-10 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-bold text-xl"
        title="Отдалить (Zoom Out)"
      >
        −
      </button>
      <button
        onClick={() => {
          setStageScale(1);
          setStagePos({ x: 0, y: 0 });
        }}
        className="w-10 h-10 flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-xs"
        title="Сбросить масштаб"
      >
        1:1
      </button>
    </div>
  </div>
  );
};
