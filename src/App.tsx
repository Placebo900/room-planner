import { useState, useCallback, useEffect } from 'react';
import type { EditorElement, Tool, ViewMode, Furniture, ChatMessage, Product, Point, Window, Door, Wall } from './types/editor';
import { Toolbar } from './components/Editor/Toolbar';
import { EditorCanvas } from './components/Editor/EditorCanvas';
import { Viewer3D } from './components/Editor/Viewer3D';
import { WallPropertiesPanel } from './components/Editor/WallPropertiesPanel';
import { ProductPanel } from './components/Panels/ProductPanel';
import { AIChat } from './components/Panels/AIChat';
import { Toast } from './components/UI/Toast';
import { useWallDrawing } from './hooks/useWallDrawing';
import { useToast } from './hooks/useToast';
import { mockProducts } from './constants/mockProducts';
import { isPointOnWall, getClosestPointOnWall, mmToPixels } from './utils/geometry';

export default function RoomPlannerApp() {
  // State management
  const [tool, setTool] = useState<Tool>('select');
  const [elements, setElements] = useState<EditorElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedFurniture, setSelectedFurniture] = useState<Furniture | null>(null);
  const [selectedWindow, setSelectedWindow] = useState<Window | null>(null);
  const [selectedDoor, setSelectedDoor] = useState<Door | null>(null);
  const [selectedWall, setSelectedWall] = useState<Wall | null>(null);
  const [showProductPanel, setShowProductPanel] = useState(false);
  const [showWallPanel, setShowWallPanel] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('2D');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { text: "Привет! Я ваш AI-помощник по планированию интерьера. Могу помочь с планировкой, подбором мебели и дать советы по дизайну. Просто спросите!", isUser: false },
  ]);

  // Toast notifications
  const { toasts, removeToast, success, error, warning, info } = useToast();

  // Wall drawing hook with improved logic
  const {
    isDrawing,
    drawingStart,
    previewEnd,
    isAxisSnapped,
    handleClick: handleWallClick,
    handleMouseMove: handleWallMouseMove,
    cancelDrawing
  } = useWallDrawing({
    tool,
    elements,
    onAddElement: (element) => {
      setElements(prev => [...prev, element]);
      success('Стена добавлена');
    },
    onFinishDrawing: () => {
      setTool('select');
      info('Рисование завершено');
    }
  });

  // Calculate total price
  const totalPrice = elements
    .filter(el => el.type === 'furniture' || el.type === 'window' || el.type === 'door')
    .reduce((sum, el) => {
      if (el.type === 'furniture') {
        return sum + (el as Furniture).price;
      } else if (el.type === 'window') {
        return sum + ((el as Window).price || 0);
      } else if (el.type === 'door') {
        return sum + ((el as Door).price || 0);
      }
      return sum;
    }, 0);

  // Canvas dimensions
  const canvasWidth = window.innerWidth - 640;
  const canvasHeight = window.innerHeight - 100;

  // ESC key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isDrawing) {
          cancelDrawing();
          warning('Рисование отменено');
        }
        if (showWallPanel) {
          setShowWallPanel(false);
          setSelectedWall(null);
          setSelectedId(null);
        }
        if (showProductPanel) {
          setShowProductPanel(false);
          setSelectedFurniture(null);
          setSelectedWindow(null);
          setSelectedDoor(null);
          setSelectedId(null);
        }
      }
      if (e.key === 'Delete' && selectedId) {
        handleDeleteElement(selectedId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawing, showWallPanel, showProductPanel, selectedId, cancelDrawing]);

  const handleStageClick = useCallback((point: Point) => {
    if (tool === 'wall') {
      handleWallClick(point);
      return;
    }

    if (tool === 'window' || tool === 'door') {
      const walls = elements.filter(el => el.type === 'wall') as Wall[];
      let placedOnWall = false;

      for (const wall of walls) {
        if (isPointOnWall(point, wall, 30)) {
          const closestPoint = getClosestPointOnWall(point, wall);
          const id = Date.now().toString();
          
          const newElement: Window | Door = tool === 'window' ? {
            id,
            type: 'window',
            startPoint: { x: closestPoint.x - 50, y: closestPoint.y },
            endPoint: { x: closestPoint.x + 50, y: closestPoint.y },
            width: 100,
            wallId: wall.id
          } : {
            id,
            type: 'door',
            startPoint: { x: closestPoint.x - 45, y: closestPoint.y },
            endPoint: { x: closestPoint.x + 45, y: closestPoint.y },
            width: 90,
            wallId: wall.id
          };
          
          setElements(prev => [...prev, newElement]);
          setTool('select');
          success(tool === 'window' ? 'Окно добавлено' : 'Дверь добавлена');
          placedOnWall = true;
          break;
        }
      }

      if (!placedOnWall) {
        error('Окна и двери можно размещать только на стенах!');
      }
      return;
    }

    if (['stool', 'table', 'sofa', 'bed', 'sink', 'shower', 'toilet', 'tv'].includes(tool)) {
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
        setElements(prev => [...prev, newFurniture]);
        setTool('select');
        success(`${defaultProduct.name} добавлен`);
      }
    }
  }, [tool, handleWallClick, elements, success, error]);

  const handleStageMouseMove = useCallback((point: Point) => {
    if (tool === 'wall') {
      handleWallMouseMove(point);
    }
  }, [tool, handleWallMouseMove]);

  const handleElementClick = useCallback((id: string) => {
    if (tool === 'select') {
      setSelectedId(id);
      const element = elements.find(el => el.id === id);
      
      if (element) {
        if (element.type === 'furniture') {
          setSelectedFurniture(element as Furniture);
          setSelectedWindow(null);
          setSelectedDoor(null);
          setShowProductPanel(true);
          setShowWallPanel(false);
          setSelectedWall(null);
        } else if (element.type === 'window') {
          setSelectedWindow(element as Window);
          setSelectedFurniture(null);
          setSelectedDoor(null);
          setShowProductPanel(true);
          setShowWallPanel(false);
          setSelectedWall(null);
        } else if (element.type === 'door') {
          setSelectedDoor(element as Door);
          setSelectedFurniture(null);
          setSelectedWindow(null);
          setShowProductPanel(true);
          setShowWallPanel(false);
          setSelectedWall(null);
        } else if (element.type === 'wall') {
          setSelectedWall(element as Wall);
          setSelectedWindow(null);
          setSelectedDoor(null);
          setShowWallPanel(true);
          setShowProductPanel(false);
          setSelectedFurniture(null);
        } else {
          setShowProductPanel(false);
          setShowWallPanel(false);
          setSelectedFurniture(null);
          setSelectedWindow(null);
          setSelectedDoor(null);
          setSelectedWall(null);
        }
      }
    }
  }, [tool, elements]);

  const handleProductSelect = useCallback((product: Product) => {
    if (selectedFurniture) {
      setElements(prev => prev.map(el => {
        if (el.id === selectedFurniture.id && el.type === 'furniture') {
          return {
            ...el,
            productId: product.id,
            name: product.name,
            price: product.price,
            dimensions: { ...product.dimensions }
          } as Furniture;
        }
        return el;
      }));
      setShowProductPanel(false);
      setSelectedFurniture(null);
      success('Товар обновлён');
    } else if (selectedWindow) {
      // Handle window product selection
      const wall = elements.find(el => el.id === selectedWindow.wallId && el.type === 'wall') as Wall | undefined;
      
      if (wall) {
        const wallDx = wall.endPoint.x - wall.startPoint.x;
        const wallDy = wall.endPoint.y - wall.startPoint.y;
        const wallLength = Math.sqrt(wallDx * wallDx + wallDy * wallDy);
        
        if (wallLength > 0) {
          // Get current window center
          const currentMidX = (selectedWindow.startPoint.x + selectedWindow.endPoint.x) / 2;
          const currentMidY = (selectedWindow.startPoint.y + selectedWindow.endPoint.y) / 2;
          
          // Calculate new window dimensions based on product width (in mm)
          // Convert from mm to pixels (1px = 10mm, so divide by 10)
          const newWindowLength = mmToPixels(product.dimensions.width || 1200); // Default 1.2m
          const halfLength = newWindowLength / 2;
          
          // Unit vector along wall
          const unitDx = wallDx / wallLength;
          const unitDy = wallDy / wallLength;
          
          setElements(prev => prev.map(el => {
            if (el.id === selectedWindow.id && el.type === 'window') {
              return {
                ...el,
                productId: product.id,
                name: product.name,
                price: product.price,
                startPoint: {
                  x: currentMidX - halfLength * unitDx,
                  y: currentMidY - halfLength * unitDy
                },
                endPoint: {
                  x: currentMidX + halfLength * unitDx,
                  y: currentMidY + halfLength * unitDy
                }
              } as Window;
            }
            return el;
          }));
          
          setShowProductPanel(false);
          setSelectedWindow(null);
          success(`Окно заменено на ${product.name}`);
        }
      }
    } else if (selectedDoor) {
      // Handle door product selection
      const wall = elements.find(el => el.id === selectedDoor.wallId && el.type === 'wall') as Wall | undefined;
      
      if (wall) {
        const wallDx = wall.endPoint.x - wall.startPoint.x;
        const wallDy = wall.endPoint.y - wall.startPoint.y;
        const wallLength = Math.sqrt(wallDx * wallDx + wallDy * wallDy);
        
        if (wallLength > 0) {
          // Get current door center
          const currentMidX = (selectedDoor.startPoint.x + selectedDoor.endPoint.x) / 2;
          const currentMidY = (selectedDoor.startPoint.y + selectedDoor.endPoint.y) / 2;
          
          // Calculate new door dimensions based on product width (in mm)
          // Convert from mm to pixels (1px = 10mm, so divide by 10)
          const newDoorLength = mmToPixels(product.dimensions.width || 900); // Default 0.9m
          const halfLength = newDoorLength / 2;
          
          // Unit vector along wall
          const unitDx = wallDx / wallLength;
          const unitDy = wallDy / wallLength;
          
          setElements(prev => prev.map(el => {
            if (el.id === selectedDoor.id && el.type === 'door') {
              return {
                ...el,
                productId: product.id,
                name: product.name,
                price: product.price,
                startPoint: {
                  x: currentMidX - halfLength * unitDx,
                  y: currentMidY - halfLength * unitDy
                },
                endPoint: {
                  x: currentMidX + halfLength * unitDx,
                  y: currentMidY + halfLength * unitDy
                }
              } as Door;
            }
            return el;
          }));
          
          setShowProductPanel(false);
          setSelectedDoor(null);
          success(`Дверь заменена на ${product.name}`);
        }
      }
    }
  }, [selectedFurniture, selectedWindow, selectedDoor, elements, success]);

  const handleDoorDrag = useCallback((doorId: string, startPoint: Point, endPoint: Point) => {
    setElements(prev => prev.map(el => {
      if (el.id === doorId && el.type === 'door') {
        const door = el as Door;
        const wall = prev.find(w => w.id === door.wallId && w.type === 'wall') as Wall | undefined;
        
        if (wall) {
          const wallDx = wall.endPoint.x - wall.startPoint.x;
          const wallDy = wall.endPoint.y - wall.startPoint.y;
          const wallLength = Math.sqrt(wallDx * wallDx + wallDy * wallDy);
          
          if (wallLength > 0) {
            // Calculate current door length
            const doorDx = door.endPoint.x - door.startPoint.x;
            const doorDy = door.endPoint.y - door.startPoint.y;
            const doorLength = Math.sqrt(doorDx * doorDx + doorDy * doorDy);
            
            // Calculate midpoint of dragged door
            const midPoint = {
              x: (startPoint.x + endPoint.x) / 2,
              y: (startPoint.y + endPoint.y) / 2
            };
            
            // Project midpoint onto wall
            const t = Math.max(0, Math.min(1, 
              ((midPoint.x - wall.startPoint.x) * wallDx + (midPoint.y - wall.startPoint.y) * wallDy) / (wallLength * wallLength)
            ));
            
            const projectedMid = {
              x: wall.startPoint.x + t * wallDx,
              y: wall.startPoint.y + t * wallDy
            };
            
            // Calculate unit vector along wall
            const unitDx = wallDx / wallLength;
            const unitDy = wallDy / wallLength;
            const halfLength = doorLength / 2;
            
            return {
              ...door,
              startPoint: {
                x: projectedMid.x - halfLength * unitDx,
                y: projectedMid.y - halfLength * unitDy
              },
              endPoint: {
                x: projectedMid.x + halfLength * unitDx,
                y: projectedMid.y + halfLength * unitDy
              }
            } as Door;
          }
        }
      }
      return el;
    }));
  }, []);

  const handleDoorEndpointDrag = useCallback((doorId: string, isStart: boolean, newPoint: Point) => {
    setElements(prev => prev.map(el => {
      if (el.id === doorId && el.type === 'door') {
        const door = el as Door;
        const wall = prev.find(w => w.id === door.wallId && w.type === 'wall') as Wall | undefined;
        
        if (wall) {
          const wallDx = wall.endPoint.x - wall.startPoint.x;
          const wallDy = wall.endPoint.y - wall.startPoint.y;
          const wallLength = Math.sqrt(wallDx * wallDx + wallDy * wallDy);
          
          if (wallLength > 0) {
            // Project new point onto wall
            const t = Math.max(0, Math.min(1,
              ((newPoint.x - wall.startPoint.x) * wallDx + (newPoint.y - wall.startPoint.y) * wallDy) / (wallLength * wallLength)
            ));
            
            const projectedPoint = {
              x: wall.startPoint.x + t * wallDx,
              y: wall.startPoint.y + t * wallDy
            };
            
            // Keep the other endpoint fixed
            const fixedPoint = isStart ? door.endPoint : door.startPoint;
            
            // Make sure door has minimum size (20px)
            const newDx = isStart ? fixedPoint.x - projectedPoint.x : projectedPoint.x - fixedPoint.x;
            const newDy = isStart ? fixedPoint.y - projectedPoint.y : projectedPoint.y - fixedPoint.y;
            const newLength = Math.sqrt(newDx * newDx + newDy * newDy);
            
            if (newLength < 20) {
              return el; // Don't update if too small
            }
            
            return {
              ...door,
              startPoint: isStart ? projectedPoint : fixedPoint,
              endPoint: isStart ? fixedPoint : projectedPoint
            } as Door;
          }
        }
      }
      return el;
    }));
  }, []);

  const handleWallUpdate = useCallback((wallId: string, updates: Partial<Wall>) => {
    setElements(prev => prev.map(el => 
      el.id === wallId && el.type === 'wall'
        ? { ...el, ...updates } as Wall
        : el
    ));
    info('Стена обновлена');
  }, [info]);

  const handleDeleteElement = useCallback((id: string) => {
    const element = elements.find(el => el.id === id);
    setElements(prev => prev.filter(el => el.id !== id));
    setSelectedId(null);
    setShowWallPanel(false);
    setShowProductPanel(false);
    setSelectedWall(null);
    setSelectedFurniture(null);
    
    if (element) {
      const typeName = element.type === 'wall' ? 'Стена' : 
                       element.type === 'window' ? 'Окно' :
                       element.type === 'door' ? 'Дверь' : 'Элемент';
      success(`${typeName} удалён`);
    }
  }, [elements, success]);

  const handleFurnitureDragEnd = useCallback((id: string, position: Point) => {
    setElements(prev => {
      const walls = prev.filter(el => el.type === 'wall') as Wall[];
      const furniture = prev.find(el => el.id === id && el.type === 'furniture') as Furniture | undefined;
      
      if (!furniture) return prev;
      
      let snappedPosition = { ...position };
      const SNAP_THRESHOLD = 50; // pixels - increased for better UX
      
      // Get furniture dimensions
      const furnitureWidth = furniture.dimensions.width * 0.1; // SCALE = 0.1
      const furnitureHeight = furniture.dimensions.height * 0.1;
      
      // Find closest walls and snap to them
      let closestHorizontalWall: { wallY: number; above: boolean } | undefined = undefined;
      let closestVerticalWall: { wallX: number; left: boolean } | undefined = undefined;
      let minHorizontalDist = Infinity;
      let minVerticalDist = Infinity;
      
      walls.forEach(wall => {
        const dx = wall.endPoint.x - wall.startPoint.x;
        const dy = wall.endPoint.y - wall.startPoint.y;
        const isHorizontal = Math.abs(dx) > Math.abs(dy);
        
        if (isHorizontal) {
          const wallY = (wall.startPoint.y + wall.endPoint.y) / 2;
          
          // Calculate distance from furniture edge to wall
          let dist: number;
          let above: boolean;
          
          if (wallY < position.y) {
            // Wall is above furniture
            above = true;
            dist = position.y - furnitureHeight / 2 - wallY;
          } else {
            // Wall is below furniture
            above = false;
            dist = wallY - (position.y + furnitureHeight / 2);
          }
          
          if (dist >= 0 && dist < SNAP_THRESHOLD && dist < minHorizontalDist) {
            minHorizontalDist = dist;
            closestHorizontalWall = { wallY, above };
          }
        } else {
          const wallX = (wall.startPoint.x + wall.endPoint.x) / 2;
          
          // Calculate distance from furniture edge to wall
          let dist: number;
          let left: boolean;
          
          if (wallX < position.x) {
            // Wall is to the left of furniture
            left = true;
            dist = position.x - furnitureWidth / 2 - wallX;
          } else {
            // Wall is to the right of furniture
            left = false;
            dist = wallX - (position.x + furnitureWidth / 2);
          }
          
          if (dist >= 0 && dist < SNAP_THRESHOLD && dist < minVerticalDist) {
            minVerticalDist = dist;
            closestVerticalWall = { wallX, left };
          }
        }
      });
      
      // Snap to walls with small gap
      const GAP = 10; // pixels gap between furniture and wall
      
      if (closestHorizontalWall) {
        const { wallY, above } = closestHorizontalWall;
        if (above) {
          // Wall is above furniture - snap furniture below the wall
          snappedPosition.y = wallY + furnitureHeight / 2 + GAP;
        } else {
          // Wall is below furniture - snap furniture above the wall
          snappedPosition.y = wallY - furnitureHeight / 2 - GAP;
        }
      }
      
      if (closestVerticalWall) {
        const { wallX, left } = closestVerticalWall;
        if (left) {
          // Wall is to the left - snap furniture to the right of the wall
          snappedPosition.x = wallX + furnitureWidth / 2 + GAP;
        } else {
          // Wall is to the right - snap furniture to the left of the wall
          snappedPosition.x = wallX - furnitureWidth / 2 - GAP;
        }
      }
      
      return prev.map(el => 
      el.id === id && el.type === 'furniture' 
          ? { ...el, position: snappedPosition } as Furniture
          : el
      );
    });
  }, []);

  const handleWallEndpointDrag = useCallback((wallId: string, isStart: boolean, newPoint: Point) => {
    setElements(prev => {
      const draggedWall = prev.find(el => el.id === wallId && el.type === 'wall') as Wall | undefined;
      if (!draggedWall) return prev;

      const oldPoint = isStart ? draggedWall.startPoint : draggedWall.endPoint;
      const tolerance = 5;

      return prev.map(el => {
        if (el.type !== 'wall') return el;
        const wall = el as Wall;
        
        const shouldUpdateStart = Math.abs(wall.startPoint.x - oldPoint.x) < tolerance && 
                                 Math.abs(wall.startPoint.y - oldPoint.y) < tolerance;
        const shouldUpdateEnd = Math.abs(wall.endPoint.x - oldPoint.x) < tolerance && 
                               Math.abs(wall.endPoint.y - oldPoint.y) < tolerance;

        if (shouldUpdateStart || shouldUpdateEnd) {
          return {
            ...wall,
            startPoint: shouldUpdateStart ? newPoint : wall.startPoint,
            endPoint: shouldUpdateEnd ? newPoint : wall.endPoint,
          } as Wall;
        }
        
        return el;
      });
    });
  }, []);

  const handleWindowDrag = useCallback((windowId: string, startPoint: Point, endPoint: Point) => {
    setElements(prev => prev.map(el => {
      if (el.id === windowId && el.type === 'window') {
        const window = el as Window;
        const wall = prev.find(w => w.id === window.wallId && w.type === 'wall') as Wall | undefined;
        
        if (wall) {
          const wallDx = wall.endPoint.x - wall.startPoint.x;
          const wallDy = wall.endPoint.y - wall.startPoint.y;
          const wallLength = Math.sqrt(wallDx * wallDx + wallDy * wallDy);
          
          if (wallLength > 0) {
            // Calculate current window length
            const windowDx = window.endPoint.x - window.startPoint.x;
            const windowDy = window.endPoint.y - window.startPoint.y;
            const windowLength = Math.sqrt(windowDx * windowDx + windowDy * windowDy);
            
            // Calculate midpoint of dragged window
            const midPoint = {
              x: (startPoint.x + endPoint.x) / 2,
              y: (startPoint.y + endPoint.y) / 2
            };
            
            // Project midpoint onto wall
            const t = Math.max(0, Math.min(1, 
              ((midPoint.x - wall.startPoint.x) * wallDx + (midPoint.y - wall.startPoint.y) * wallDy) / (wallLength * wallLength)
            ));
            
            const projectedMid = {
              x: wall.startPoint.x + t * wallDx,
              y: wall.startPoint.y + t * wallDy
            };
            
            // Calculate unit vector along wall
            const unitDx = wallDx / wallLength;
            const unitDy = wallDy / wallLength;
            const halfLength = windowLength / 2;
            
            return {
              ...window,
              startPoint: {
                x: projectedMid.x - halfLength * unitDx,
                y: projectedMid.y - halfLength * unitDy
              },
              endPoint: {
                x: projectedMid.x + halfLength * unitDx,
                y: projectedMid.y + halfLength * unitDy
              }
            } as Window;
          }
        }
      }
      return el;
    }));
  }, []);

  const handleWindowEndpointDrag = useCallback((windowId: string, isStart: boolean, newPoint: Point) => {
    setElements(prev => prev.map(el => {
      if (el.id === windowId && el.type === 'window') {
        const window = el as Window;
        const wall = prev.find(w => w.id === window.wallId && w.type === 'wall') as Wall | undefined;
        
        if (wall) {
          const wallDx = wall.endPoint.x - wall.startPoint.x;
          const wallDy = wall.endPoint.y - wall.startPoint.y;
          const wallLength = Math.sqrt(wallDx * wallDx + wallDy * wallDy);
          
          if (wallLength > 0) {
            // Project new point onto wall
            const t = Math.max(0, Math.min(1,
              ((newPoint.x - wall.startPoint.x) * wallDx + (newPoint.y - wall.startPoint.y) * wallDy) / (wallLength * wallLength)
            ));
            
            const projectedPoint = {
              x: wall.startPoint.x + t * wallDx,
              y: wall.startPoint.y + t * wallDy
            };
            
            // Keep the other endpoint fixed
            const fixedPoint = isStart ? window.endPoint : window.startPoint;
            
            // Make sure window has minimum size (20px)
            const newDx = isStart ? fixedPoint.x - projectedPoint.x : projectedPoint.x - fixedPoint.x;
            const newDy = isStart ? fixedPoint.y - projectedPoint.y : projectedPoint.y - fixedPoint.y;
            const newLength = Math.sqrt(newDx * newDx + newDy * newDy);
            
            if (newLength < 20) {
              return el; // Don't update if too small
            }
            
            return {
              ...window,
              startPoint: isStart ? projectedPoint : fixedPoint,
              endPoint: isStart ? fixedPoint : projectedPoint
            } as Window;
          }
        }
      }
      return el;
    }));
  }, []);

  const handleSendMessage = useCallback((message: string) => {
    setChatMessages(prev => [...prev, { text: message, isUser: true }]);
    
    setTimeout(() => {
      const responses = [
        "Отличная планировка! Рекомендую обратить внимание на рабочий треугольник на кухне - расстояние между холодильником, плитой и мойкой должно быть 1.2-2.7 метра.",
        "Для гостиной вашего размера я подберу несколько вариантов мебели в оптимальном соотношении цена/качество.",
        "Вижу, что вы планируете спальню. Рекомендую расположить кровать изголовьем к стене, подальше от двери и окна.",
        "Анализирую вашу планировку... Могу предложить более эргономичное расположение мебели."
      ];
      
      const response = responses[Math.floor(Math.random() * responses.length)];
      
      setChatMessages(prev => [...prev, { 
        text: response, 
        isUser: false 
      }]);
    }, 1000);
  }, []);

  const handleToolChange = useCallback((newTool: Tool) => {
    if (isDrawing) {
      cancelDrawing();
    }
    setTool(newTool);
    setSelectedId(null);
    setShowProductPanel(false);
    setShowWallPanel(false);
    setSelectedWall(null);
    setSelectedFurniture(null);
    setSelectedWindow(null);
    setSelectedDoor(null);
  }, [isDrawing, cancelDrawing]);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Toolbar 
        tool={tool}
        viewMode={viewMode}
        onToolChange={handleToolChange}
        onViewModeChange={setViewMode}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <AIChat 
          messages={chatMessages}
          onSendMessage={handleSendMessage}
        />
        
        <div className="flex-1 relative bg-white">
          {viewMode === '2D' ? (
            <EditorCanvas
              width={canvasWidth}
              height={canvasHeight}
              elements={elements}
              selectedId={selectedId}
              tool={tool}
              isDrawing={isDrawing}
              drawingStart={drawingStart}
              previewEnd={previewEnd}
              isAxisSnapped={isAxisSnapped}
              onStageClick={handleStageClick}
              onStageMouseMove={handleStageMouseMove}
              onElementClick={handleElementClick}
              onFurnitureDragEnd={handleFurnitureDragEnd}
              onWallEndpointDrag={handleWallEndpointDrag}
              onWindowDrag={handleWindowDrag}
              onWindowEndpointDrag={handleWindowEndpointDrag}
              onDoorDrag={handleDoorDrag}
              onDoorEndpointDrag={handleDoorEndpointDrag}
            />
          ) : (
            <Viewer3D
              width={canvasWidth}
              height={canvasHeight}
              elements={elements}
              selectedId={selectedId}
            />
          )}
          
          {totalPrice > 0 && (
            <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 animate-fade-in">
              <h3 className="text-xl font-bold text-gray-900">
                Итоговая сумма: <span className="text-green-600">{totalPrice.toLocaleString()} ₽</span>
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {elements.filter(el => el.type === 'furniture' || el.type === 'window' || el.type === 'door').length} предметов
              </p>
            </div>
          )}

          {tool === 'wall' && !isDrawing && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse">
              💡 Кликните для начала рисования стены
            </div>
          )}
          
          {tool === 'wall' && isDrawing && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
              ✏️ Кликните для продолжения, двойной клик для завершения (ESC для отмены)
            </div>
          )}

          {(tool === 'window' || tool === 'door') && viewMode === '2D' && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-6 py-3 rounded-lg shadow-lg">
              🎯 Кликните на стену для размещения
            </div>
          )}
          
          {viewMode === '3D' && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-6 py-3 rounded-lg shadow-lg">
              🎮 Левая кнопка - поворот | Правая - панорама | Колесо - зум
            </div>
          )}
        </div>
        
        {showProductPanel && (selectedFurniture || selectedWindow || selectedDoor) && (
          <ProductPanel
            selectedFurniture={selectedFurniture}
            selectedWindow={selectedWindow}
            selectedDoor={selectedDoor}
            onClose={() => {
              setShowProductPanel(false);
              setSelectedFurniture(null);
              setSelectedWindow(null);
              setSelectedDoor(null);
              setSelectedId(null);
            }}
            onProductSelect={handleProductSelect}
          />
        )}
      </div>

      {showWallPanel && selectedWall && (
        <WallPropertiesPanel
          wall={selectedWall}
          onUpdate={handleWallUpdate}
          onClose={() => {
            setShowWallPanel(false);
            setSelectedWall(null);
            setSelectedId(null);
          }}
          onDelete={handleDeleteElement}
        />
      )}

      {/* Toast notifications */}
      <div className="fixed top-20 right-4 z-50 space-y-2">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}
