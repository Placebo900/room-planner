import React, { useState, useRef } from 'react';
import { Stage, Layer, Line, Circle, Text, Rect, Group } from 'react-konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import Konva from 'konva';

// Types
interface Point {
  x: number;
  y: number;
}

interface Wall {
  id: string;
  type: 'wall';
  startPoint: Point;
  endPoint: Point;
  thickness: number;
}

interface Window {
  id: string;
  type: 'window';
  startPoint: Point;
  endPoint: Point;
  width: number;
}

interface Door {
  id: string;
  type: 'door';
  startPoint: Point;
  endPoint: Point;
  width: number;
}

interface Furniture {
  id: string;
  type: 'furniture';
  category: string;
  productId?: string;
  position: Point;
  dimensions: { width: number; height: number };
  rotation: number;
  price: number;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  dimensions: { width: number; height: number; depth?: number };
  imageUrl: string;
  category: string;
}

type EditorElement = Wall | Window | Door | Furniture;
type Tool = 'select' | 'wall' | 'window' | 'door' | 'stool' | 'table' | 'sofa' | 'bed' | 'sink' | 'shower' | 'toilet' | 'tv';

// Constants
const SCALE = 0.1; // 1px = 10mm
const GRID_SIZE = 50; // 500mm
const WALL_THICKNESS = 10;

// Mock Products Data
const mockProducts: { [key: string]: Product[] } = {
  stool: [
    { id: 's1', name: 'Стол базовый', description: 'Простой обеденный стол', price: 22000, dimensions: { width: 1200, height: 800 }, imageUrl: '🪑', category: 'stool' },
    { id: 's2', name: 'Стол с крестиками', description: 'Дизайнерский стол', price: 33333, dimensions: { width: 1400, height: 900 }, imageUrl: '🪑', category: 'stool' },
    { id: 's3', name: 'Стол с одной ножкой', description: 'Современный стол', price: 27000, dimensions: { width: 1000, height: 1000 }, imageUrl: '🪑', category: 'stool' },
  ],
  table: [
    { id: 't1', name: 'Столик', description: 'Журнальный столик', price: 16000, dimensions: { width: 800, height: 600 }, imageUrl: '🔲', category: 'table' },
    { id: 't2', name: 'Столбешник', description: 'Барный стол', price: 34557, dimensions: { width: 600, height: 1200 }, imageUrl: '🔲', category: 'table' },
  ],
  sofa: [
    { id: 'sf1', name: 'Диван угловой', description: 'Комфортный угловой диван', price: 90000, dimensions: { width: 2700, height: 1700 }, imageUrl: '🛋️', category: 'sofa' },
    { id: 'sf2', name: 'Диван прямой', description: 'Классический диван', price: 65000, dimensions: { width: 2200, height: 900 }, imageUrl: '🛋️', category: 'sofa' },
  ],
  bed: [
    { id: 'b1', name: 'Кровать двуспальная', description: 'Кровать 160x200', price: 45000, dimensions: { width: 1600, height: 2000 }, imageUrl: '🛏️', category: 'bed' },
    { id: 'b2', name: 'Кровать полуторная', description: 'Кровать 120x200', price: 35000, dimensions: { width: 1200, height: 2000 }, imageUrl: '🛏️', category: 'bed' },
  ],
  sink: [
    { id: 'sn1', name: 'Раковина стандарт', description: 'Керамическая раковина', price: 12000, dimensions: { width: 600, height: 500 }, imageUrl: '🚿', category: 'sink' },
  ],
  shower: [
    { id: 'sh1', name: 'Душевая кабина', description: 'Стеклянная кабина 90x90', price: 55000, dimensions: { width: 900, height: 900 }, imageUrl: '🚿', category: 'shower' },
  ],
  toilet: [
    { id: 'tl1', name: 'Унитаз подвесной', description: 'Современный подвесной унитаз', price: 25000, dimensions: { width: 400, height: 600 }, imageUrl: '🚽', category: 'toilet' },
  ],
  tv: [
    { id: 'tv1', name: 'Телевизор 55"', description: 'Smart TV 55 дюймов', price: 65000, dimensions: { width: 1200, height: 50 }, imageUrl: '📺', category: 'tv' },
  ]
};

// Utility Functions
const calculateDistance = (p1: Point, p2: Point): number => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

const calculateAngle = (p1: Point, p2: Point, p3: Point): number => {
  const angle1 = Math.atan2(p1.y - p2.y, p1.x - p2.x);
  const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
  let angle = (angle2 - angle1) * (180 / Math.PI);
  if (angle < 0) angle += 360;
  if (angle > 180) angle = 360 - angle;
  return Math.round(angle);
};

const getMidpoint = (p1: Point, p2: Point): Point => {
  return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
};

// Main App Component
export default function RoomPlannerApp() {
  const [tool, setTool] = useState<Tool>('select');
  const [elements, setElements] = useState<EditorElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingStart, setDrawingStart] = useState<Point | null>(null);
  const [showProductPanel, setShowProductPanel] = useState(false);
  const [selectedFurniture, setSelectedFurniture] = useState<Furniture | null>(null);
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('2D');
  const [chatMessages, setChatMessages] = useState<Array<{text: string, isUser: boolean}>>([
    { text: "Смотрю схему дома...", isUser: false },
    { text: "Изучаю цветовую гамму...", isUser: false },
  ]);
  const [chatInput, setChatInput] = useState('');
  const stageRef = useRef<Konva.Stage>(null);

  const totalPrice = elements
    .filter(el => el.type === 'furniture')
    .reduce((sum, el) => sum + (el as Furniture).price, 0);

  const handleStageClick = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;
    
    const point = stage.getPointerPosition();
    if (!point) return;

    if (tool === 'wall' || tool === 'window' || tool === 'door') {
      if (!isDrawing) {
        setDrawingStart(point);
        setIsDrawing(true);
      } else {
        if (drawingStart) {
          const id = Date.now().toString();
          let newElement: EditorElement;
          
          if (tool === 'wall') {
            newElement = {
              id,
              type: 'wall',
              startPoint: drawingStart,
              endPoint: point,
              thickness: WALL_THICKNESS
            };
          } else if (tool === 'window') {
            newElement = {
              id,
              type: 'window',
              startPoint: drawingStart,
              endPoint: point,
              width: 100
            };
          } else {
            newElement = {
              id,
              type: 'door',
              startPoint: drawingStart,
              endPoint: point,
              width: 90
            };
          }
          
          setElements([...elements, newElement]);
          setIsDrawing(false);
          setDrawingStart(null);
        }
      }
    } else if (['stool', 'table', 'sofa', 'bed', 'sink', 'shower', 'toilet', 'tv'].includes(tool)) {
      const category = tool;
      const defaultProduct = mockProducts[category]?.[0];
      if (defaultProduct) {
        const id = Date.now().toString();
        const newFurniture: Furniture = {
          id,
          type: 'furniture',
          category,
          position: point,
          dimensions: { ...defaultProduct.dimensions },
          rotation: 0,
          price: defaultProduct.price,
          name: defaultProduct.name,
          productId: defaultProduct.id
        };
        setElements([...elements, newFurniture]);
        setTool('select');
      }
    }
  };

  const handleElementClick = (id: string) => {
    if (tool === 'select') {
      setSelectedId(id);
      const element = elements.find(el => el.id === id);
      if (element && element.type === 'furniture') {
        setSelectedFurniture(element as Furniture);
        setShowProductPanel(true);
      }
    }
  };

  const handleProductSelect = (product: Product) => {
    if (selectedFurniture) {
      const updatedElements = elements.map(el => {
        if (el.id === selectedFurniture.id) {
          return {
            ...el,
            productId: product.id,
            name: product.name,
            price: product.price,
            dimensions: { ...product.dimensions }
          } as Furniture;
        }
        return el;
      });
      setElements(updatedElements);
      setShowProductPanel(false);
    }
  };

  const handleFurnitureUpdate = (id: string, updates: Partial<Furniture>) => {
    setElements(elements.map(el => 
      el.id === id && el.type === 'furniture' ? { ...el, ...updates } : el
    ));
  };

  // Toolbar Component
  const Toolbar = () => (
    <div className="bg-white border-b border-gray-200 p-2">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {[
            { tool: 'select' as Tool, icon: '👆', label: 'Select' },
            { tool: 'wall' as Tool, icon: '🧱', label: 'Стена' },
            { tool: 'window' as Tool, icon: '🪟', label: 'Окно' },
            { tool: 'door' as Tool, icon: '🚪', label: 'Дверь' },
            { tool: 'stool' as Tool, icon: '🪑', label: 'Стул' },
            { tool: 'table' as Tool, icon: '🔲', label: 'Стол' },
            { tool: 'sofa' as Tool, icon: '🛋️', label: 'Диван/Кресло' },
            { tool: 'bed' as Tool, icon: '🛏️', label: 'Кровать' },
            { tool: 'sink' as Tool, icon: '🚰', label: 'Раковина' },
            { tool: 'shower' as Tool, icon: '🚿', label: 'Душ/Ванна' },
            { tool: 'toilet' as Tool, icon: '🚽', label: 'Туалет' },
            { tool: 'tv' as Tool, icon: '📺', label: 'Телевизор' },
          ].map(({ tool: t, icon, label }) => (
            <button
              key={t}
              onClick={() => setTool(t)}
              className={`px-3 py-2 rounded flex flex-col items-center gap-1 transition-all ${
                tool === t 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <span className="text-xl">{icon}</span>
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('2D')}
            className={`px-4 py-2 rounded ${viewMode === '2D' ? 'bg-green-500 text-white' : 'bg-green-100'}`}
          >
            2D
          </button>
          <button
            onClick={() => setViewMode('3D')}
            className={`px-4 py-2 rounded ${viewMode === '3D' ? 'bg-green-100' : 'bg-gray-100'}`}
            disabled
          >
            3D
          </button>
          <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded">
            Click to generate video of home!
          </button>
        </div>
      </div>
    </div>
  );

  // Wall Render Component
  const WallRender = ({ wall }: { wall: Wall }) => {
    const distance = calculateDistance(wall.startPoint, wall.endPoint) / SCALE;
    const midpoint = getMidpoint(wall.startPoint, wall.endPoint);
    const angle = Math.atan2(
      wall.endPoint.y - wall.startPoint.y,
      wall.endPoint.x - wall.startPoint.x
    ) * (180 / Math.PI);

    return (
      <Group>
        <Line
          points={[wall.startPoint.x, wall.startPoint.y, wall.endPoint.x, wall.endPoint.y]}
          stroke="black"
          strokeWidth={wall.thickness}
          onClick={() => handleElementClick(wall.id)}
        />
        <Text
          x={midpoint.x}
          y={midpoint.y - 20}
          text={`${Math.round(distance)}mm`}
          fontSize={12}
          fill="blue"
          align="center"
          rotation={angle}
        />
      </Group>
    );
  };

  // Window Render Component
  const WindowRender = ({ window }: { window: Window }) => {
    return (
      <Group>
        <Line
          points={[window.startPoint.x, window.startPoint.y, window.endPoint.x, window.endPoint.y]}
          stroke="cyan"
          strokeWidth={8}
          onClick={() => handleElementClick(window.id)}
        />
      </Group>
    );
  };

  // Door Render Component
  const DoorRender = ({ door }: { door: Door }) => {
    return (
      <Group>
        <Line
          points={[door.startPoint.x, door.startPoint.y, door.endPoint.x, door.endPoint.y]}
          stroke="brown"
          strokeWidth={8}
          onClick={() => handleElementClick(door.id)}
        />
        <Circle
          x={door.startPoint.x}
          y={door.startPoint.y}
          radius={40}
          stroke="brown"
          strokeWidth={2}
          dash={[5, 5]}
        />
      </Group>
    );
  };

  // Furniture Render Component
  const FurnitureRender = ({ furniture }: { furniture: Furniture }) => {
    const isSelected = selectedId === furniture.id;
    
    return (
      <Group
        x={furniture.position.x}
        y={furniture.position.y}
        draggable
        onDragEnd={(e) => {
          handleFurnitureUpdate(furniture.id, {
            position: { x: e.target.x(), y: e.target.y() }
          });
        }}
        onClick={() => handleElementClick(furniture.id)}
      >
        <Rect
          x={-furniture.dimensions.width * SCALE / 2}
          y={-furniture.dimensions.height * SCALE / 2}
          width={furniture.dimensions.width * SCALE}
          height={furniture.dimensions.height * SCALE}
          fill="lightgray"
          stroke={isSelected ? "blue" : "gray"}
          strokeWidth={isSelected ? 2 : 1}
        />
        <Text
          x={-furniture.dimensions.width * SCALE / 2}
          y={-furniture.dimensions.height * SCALE / 2 - 20}
          text={furniture.name}
          fontSize={10}
          fill="black"
        />
      </Group>
    );
  };

  // Product Panel Component
  const ProductPanel = () => {
    if (!showProductPanel || !selectedFurniture) return null;
    
    const category = selectedFurniture.category;
    const products = mockProducts[category] || [];
    
    // Sort products by how close they are to current dimensions
    const sortedProducts = [...products].sort((a, b) => {
      const aDiff = Math.abs(a.dimensions.width - selectedFurniture.dimensions.width) + 
                    Math.abs(a.dimensions.height - selectedFurniture.dimensions.height);
      const bDiff = Math.abs(b.dimensions.width - selectedFurniture.dimensions.width) + 
                    Math.abs(b.dimensions.height - selectedFurniture.dimensions.height);
      return aDiff - bDiff;
    });

    return (
      <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-4 border-b">
          <h3 className="font-bold">Выберите товар</h3>
          <button 
            onClick={() => setShowProductPanel(false)}
            className="float-right text-gray-500"
          >
            ✕
          </button>
        </div>
        <div className="p-4 space-y-4">
          {sortedProducts.map(product => (
            <div
              key={product.id}
              className="border rounded p-3 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => handleProductSelect(product)}
            >
              <div className="flex items-center gap-3">
                <div className="text-4xl">{product.imageUrl}</div>
                <div className="flex-1">
                  <h4 className="font-semibold">{product.name}</h4>
                  <p className="text-sm text-gray-600">{product.description}</p>
                  <p className="text-xs text-gray-500">
                    {product.dimensions.width} x {product.dimensions.height} мм
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    {product.price.toLocaleString()} руб
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // AI Chat Component
  const AIChat = () => {
    const handleSendMessage = () => {
      if (chatInput.trim()) {
        setChatMessages([...chatMessages, { text: chatInput, isUser: true }]);
        setChatInput('');
        // Mock AI response
        setTimeout(() => {
          setChatMessages(prev => [...prev, { 
            text: "Я изучаю планировку и скоро предложу оптимальное расположение мебели.", 
            isUser: false 
          }]);
        }, 1000);
      }
    };

    return (
      <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-4 bg-white border-b">
          <h3 className="font-bold">Designer Agent</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="bg-white p-3 rounded">
            <p className="text-sm">Распредели двери по квартире оптимальным способом и подбери лучшие по цветовой гамме</p>
          </div>
          <div className="bg-white p-3 rounded">
            <p className="text-sm text-gray-600">Изучу ваш план дома и подберу идеальное расположение дверей</p>
          </div>
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`p-3 rounded ${msg.isUser ? 'bg-blue-100 ml-auto' : 'bg-white'}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
          ))}
        </div>
        <div className="p-4 bg-white border-t">
          <div className="bg-orange-100 p-3 rounded mb-3">
            <p className="text-sm">Лютая дверка дерево + золото<br/>90 000 руб</p>
            <button className="text-xs text-gray-500 mt-2">&gt;&gt;</button>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="..."
              className="flex-1 px-3 py-2 border rounded text-sm"
            />
            <button
              onClick={handleSendMessage}
              className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              ↑
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Main Render
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Toolbar />
      
      <div className="flex-1 flex overflow-hidden">
        <AIChat />
        
        <div className="flex-1 relative bg-white">
          <Stage
            ref={stageRef}
            width={window.innerWidth - 640}
            height={window.innerHeight - 100}
            onClick={handleStageClick}
            className="cursor-crosshair"
          >
            <Layer>
              {/* Grid */}
              {Array.from({ length: 30 }, (_, i) => (
                <React.Fragment key={`grid-${i}`}>
                  <Line
                    points={[i * GRID_SIZE, 0, i * GRID_SIZE, 1500]}
                    stroke="#f0f0f0"
                    strokeWidth={1}
                  />
                  <Line
                    points={[0, i * GRID_SIZE, 1500, i * GRID_SIZE]}
                    stroke="#f0f0f0"
                    strokeWidth={1}
                  />
                </React.Fragment>
              ))}
              
              {/* Render elements */}
              {elements.map(element => {
                switch (element.type) {
                  case 'wall':
                    return <WallRender key={element.id} wall={element as Wall} />;
                  case 'window':
                    return <WindowRender key={element.id} window={element as Window} />;
                  case 'door':
                    return <DoorRender key={element.id} door={element as Door} />;
                  case 'furniture':
                    return <FurnitureRender key={element.id} furniture={element as Furniture} />;
                  default:
                    return null;
                }
              })}
              
              {/* Drawing preview */}
              {isDrawing && drawingStart && (
                <Line
                  points={[drawingStart.x, drawingStart.y, drawingStart.x, drawingStart.y]}
                  stroke="gray"
                  strokeWidth={tool === 'wall' ? WALL_THICKNESS : 8}
                  dash={[5, 5]}
                />
              )}
              
              {/* Angle indicators between walls */}
              {elements
                .filter(el => el.type === 'wall')
                .map((wall1, i) => {
                  const w1 = wall1 as Wall;
                  return elements
                    .filter(el => el.type === 'wall')
                    .slice(i + 1)
                    .map(wall2 => {
                      const w2 = wall2 as Wall;
                      // Check if walls connect
                      if (
                        (calculateDistance(w1.endPoint, w2.startPoint) < 20) ||
                        (calculateDistance(w1.endPoint, w2.endPoint) < 20)
                      ) {
                        const angle = calculateAngle(
                          w1.startPoint,
                          w1.endPoint,
                          calculateDistance(w1.endPoint, w2.startPoint) < 20 
                            ? w2.endPoint 
                            : w2.startPoint
                        );
                        
                        if (angle !== 0 && angle !== 180) {
                          return (
                            <Group key={`angle-${w1.id}-${w2.id}`}>
                              <Circle
                                x={w1.endPoint.x}
                                y={w1.endPoint.y}
                                radius={25}
                                stroke="green"
                                strokeWidth={1}
                                fill="transparent"
                              />
                              <Text
                                x={w1.endPoint.x - 15}
                                y={w1.endPoint.y - 8}
                                text={`${angle}°`}
                                fontSize={11}
                                fill="green"
                              />
                            </Group>
                          );
                        }
                      }
                      return null;
                    });
                })}
            </Layer>
          </Stage>
          
          {/* Total Price Display */}
          <div className="absolute bottom-4 left-4 bg-white p-4 rounded shadow-lg">
            <h3 className="text-xl font-bold">
              Итоговая сумма: {totalPrice.toLocaleString()} руб
            </h3>
          </div>
        </div>
        
        <ProductPanel />
      </div>
    </div>
  );
}