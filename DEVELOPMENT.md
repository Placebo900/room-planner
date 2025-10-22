# 🛠 Development Guide - Room Planner

Техническая документация для разработчиков.

## 📋 Оглавление

1. [Архитектура](#архитектура)
2. [2D Редактор](#2d-редактор)
3. [3D Визуализация](#3d-визуализация)
4. [Типы и интерфейсы](#типы-и-интерфейсы)
5. [Troubleshooting](#troubleshooting)

---

## Архитектура

### Общая структура

```
App.tsx (главный компонент)
├── State Management (useState)
├── ViewMode: '2D' | '3D'
├── Elements: EditorElement[]
└── Условный рендеринг:
    ├── 2D: EditorCanvas (Konva)
    └── 3D: Viewer3D (Three.js)
```

### Типы элементов

```typescript
type EditorElement = Wall | Window | Door | Furniture;

interface Wall {
  id: string;
  type: 'wall';
  startPoint: Point;
  endPoint: Point;
  thickness: number;
  height?: number;
}

interface Window {
  id: string;
  type: 'window';
  startPoint: Point;
  endPoint: Point;
  wallId?: string;  // Ссылка на родительскую стену
  height?: number;
}

interface Furniture {
  id: string;
  type: 'furniture';
  position: Point;
  dimensions: { width: number; height: number };
  rotation: number;
  price: number;
  name: string;
}
```

---

## 2D Редактор

### Ключевые компоненты

**EditorCanvas.tsx**
- Использует Konva для рендеринга
- Обрабатывает все mouse events
- Рендерит все элементы через специализированные компоненты

**useWallDrawing.ts**
- Custom hook для логики рисования стен
- Реализует snapping (точки, оси)
- Управляет состоянием рисования

**Render компоненты:**
- `WallRender.tsx` - рендеринг стен
- `WindowRender.tsx` - рендеринг окон
- `DoorRender.tsx` - рендеринг дверей
- `FurnitureRender.tsx` - рендеринг мебели

### Система координат 2D

```
Координаты: pixels
SCALE = 0.1 (1 pixel = 10mm)

Конвертация:
- pixels → mm: value / SCALE
- mm → pixels: value * SCALE
```

### Snapping логика

```typescript
// 1. Point snapping (к существующим точкам)
const SNAP_DISTANCE = 20; // pixels

// 2. Axis snapping (горизонталь/вертикаль)
const AXIS_SNAP_THRESHOLD = 10; // pixels

// 3. Visual feedback
- Orange preview = snapped
- Green preview = not snapped
```

---

## 3D Визуализация

### Архитектура 3D

```
Viewer3D.tsx
└── Canvas (React Three Fiber)
    └── Scene3D.tsx
        ├── Освещение (4 источника)
        ├── Sky (небо)
        ├── Grid (сетка-помощник)
        ├── Floor3D (пол)
        ├── Wall3D[] (стены)
        ├── Window3D[] (окна)
        ├── Door3D[] (двери)
        ├── Furniture3D[] (мебель)
        └── OrbitControls (камера)
```

### Система координат 3D

```
2D (pixels) → 3D (meters)

Конвертация:
- Position: pixel * 0.01 = meters
- Dimensions (мебель): mm / 1000 = meters
- Height (стены): cm / 100 = meters

Оси:
- X: горизонталь (лево-право)
- Y: вертикаль (верх-низ)
- Z: глубина (вперед-назад)

Важно: 2D.y → 3D.z (не 3D.y!)
```

### Ориентация элементов

**Стены:**
```typescript
// Угол рассчитывается от startPoint к endPoint
const angle = Math.atan2(
  endPoint.y - startPoint.y,
  endPoint.x - startPoint.x
);

// Rotation в Three.js
rotation={[0, -angle, 0]}
```

**Окна и двери:**
```typescript
// Берут угол от родительской стены!
const parentWall = elements.find(el => el.id === window.wallId);
const angle = Math.atan2(
  parentWall.endPoint.y - parentWall.startPoint.y,
  parentWall.endPoint.x - parentWall.startPoint.x
);

// Геометрия: [вдоль стены, высота, через толщину стены]
<boxGeometry args={[width, height, 0.08]} />
```

### Материалы Three.js

```typescript
// Стены
<meshStandardMaterial
  color="#e5e7eb"
  roughness={0.8}
  metalness={0.1}
  side={THREE.DoubleSide}  // Видно с обеих сторон!
/>

// Окна (стекло)
<meshStandardMaterial
  color="#87CEEB"
  transparent
  opacity={0.5}
  roughness={0.1}
  metalness={0.9}
  side={THREE.DoubleSide}
/>

// Мебель
<meshStandardMaterial
  color="#4A5568"
  roughness={0.6}
  metalness={0.3}
/>
```

### Освещение

```typescript
// 1. Ambient light - общее освещение
<ambientLight intensity={0.8} />

// 2. Directional light - солнце (с тенями)
<directionalLight 
  position={[10, 10, 5]} 
  intensity={0.8} 
  castShadow 
/>

// 3. Дополнительное направленное
<directionalLight position={[-10, 10, -5]} intensity={0.5} />

// 4. Point light - точечный
<pointLight position={[0, 5, 0]} intensity={0.4} />

// 5. Hemisphere light - небо+земля
<hemisphereLight args={['#ffffff', '#60666C', 0.5]} />
```

---

## Типы и интерфейсы

### Ключевые типы

```typescript
// tools
type Tool = 
  | 'select' 
  | 'wall' 
  | 'window' 
  | 'door' 
  | 'stool' 
  | 'table' 
  | 'sofa' 
  | 'bed'
  // ... и т.д.

// viewMode
type ViewMode = '2D' | '3D';

// point
interface Point {
  x: number;
  y: number;
}
```

### Важные константы

```typescript
// src/constants/editor.ts

export const SCALE = 0.1;              // 1px = 10mm
export const WALL_THICKNESS = 20;      // mm
export const SNAP_DISTANCE = 20;       // px
export const AXIS_SNAP_THRESHOLD = 10; // px
export const DOUBLE_CLICK_THRESHOLD = 300; // ms
```

---

## Troubleshooting

### Проблема: Черные стены в 3D

**Причина:** Недостаточное освещение или односторонний рендеринг

**Решение:**
```typescript
<meshStandardMaterial side={THREE.DoubleSide} />
```

### Проблема: Окна/двери перпендикулярно стенам

**Причина:** Используется угол окна/двери вместо угла стены

**Решение:**
```typescript
const parentWall = elements.find(el => el.id === window.wallId);
const angle = Math.atan2(
  parentWall.endPoint.y - parentWall.startPoint.y,
  parentWall.endPoint.x - parentWall.startPoint.x
);
```

### Проблема: Мебель не видна в 3D

**Причина:** Неправильная конвертация размеров

**Решение:**
```typescript
// Размеры мебели в MM, нужны метры
const width = furniture.dimensions.width / 1000;
const depth = furniture.dimensions.height / 1000;
```

### Проблема: Дублирующиеся ключи React

**Причина:** Одинаковые ID у элементов

**Решение:**
```typescript
{windows.map((window, idx) => (
  <Window3D key={`window-${window.id}-${idx}`} {...} />
))}
```

### Проблема: TypeScript ошибки в 3D компонентах

**Решение:**
1. Добавить `"@react-three/fiber"` в `tsconfig.app.json` → `types`
2. Использовать `THREE.DoubleSide` вместо числа `2`
3. Импортировать `import * as THREE from 'three'`

---

## Полезные команды

```bash
# Отладка
npm run dev          # С hot reload
npm run build        # Проверить на ошибки сборки

# Линтинг
npm run lint         # Проверить код

# Очистка
rm -rf node_modules/.vite   # Очистить кэш Vite
rm -rf node_modules/.tmp    # Очистить кэш TypeScript
```

---

## Архитектурные решения

### Почему React Three Fiber?

✅ Декларативный подход (как JSX)  
✅ Автоматическое управление памятью  
✅ Hooks интеграция  
✅ Отличная документация  
✅ Большое комьюнити  

### Почему НЕ react-planner?

❌ Устаревший (React 16)  
❌ Слабая поддержка  
❌ Сложная архитектура  
❌ Плохая документация  
✅ Наш проект проще и современнее!  

### Почему Konva для 2D?

✅ Высокая производительность  
✅ Canvas API  
✅ React интеграция  
✅ События мыши из коробки  
✅ Легкий (50KB)  

---

## Performance Tips

### 2D оптимизации:
1. Используйте `React.memo` для render компонентов
2. Избегайте лишних re-renders через `useCallback`
3. Группируйте Konva элементы

### 3D оптимизации:
1. `side={THREE.DoubleSide}` только где нужно
2. LOD (Level of Detail) для сложных моделей
3. Instanced meshes для повторяющихся объектов
4. Оптимизируйте shadow maps (2048 → 1024)

---

## Дополнительные ресурсы

- [Three.js Docs](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Drei Helpers](https://github.com/pmndrs/drei)
- [Konva Docs](https://konvajs.org/docs/)

---

**Удачи в разработке!** 🚀

