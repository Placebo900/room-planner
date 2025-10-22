# Room Planner - Refactored Architecture

## 🎯 Что изменилось

### Структура проекта

```
src/
├── components/
│   ├── Editor/
│   │   ├── Toolbar.tsx          # Панель инструментов
│   │   └── EditorCanvas.tsx     # Главный canvas с Konva
│   ├── Elements/
│   │   ├── WallRender.tsx       # Рендер стен
│   │   ├── WindowRender.tsx     # Рендер окон
│   │   ├── DoorRender.tsx       # Рендер дверей
│   │   ├── FurnitureRender.tsx  # Рендер мебели
│   │   └── index.ts             # Экспорты
│   └── Panels/
│       ├── ProductPanel.tsx     # Панель выбора товаров
│       └── AIChat.tsx           # AI чат помощник
├── types/
│   └── editor.ts                # TypeScript типы
├── utils/
│   └── geometry.ts              # Геометрические утилиты
├── hooks/
│   └── useWallDrawing.ts        # Хук для рисования стен
├── constants/
│   ├── editor.ts                # Константы редактора
│   └── mockProducts.ts          # Мок данные товаров
├── App.tsx                      # Главный компонент (чистый!)
└── main.tsx
```

## ✨ Новые возможности

### 1. **Динамическая линия при рисовании**
- При рисовании стены линия отображается в реальном времени
- Показывается предварительный размер стены
- Зеленая пунктирная линия для превью

### 2. **Прилипание (Snapping)**
- Стены автоматически "прилипают" к концам других стен
- Расстояние прилипания: 20px (константа `SNAP_DISTANCE`)
- Визуальные маркеры точек привязки

### 3. **Автоматическое продолжение стен**
- После завершения стены, следующая начинается с той же точки
- Создание комнат одной последовательностью кликов
- Не нужно вручную находить конец предыдущей стены

### 4. **Завершение рисования**
- **Двойной клик** - завершает рисование и возвращает в режим select
- **Замкнутое пространство** - автоматически замыкает контур при клике рядом с первой точкой
- **ESC** - отменяет текущее рисование

### 5. **Размеры стен**
- Автоматически отображаются на всех стенах
- Отображаются в миллиметрах
- Синий текст с белым фоном для читаемости

## 🛠 Best Practices

### Separation of Concerns
- **Components**: Только UI логика
- **Hooks**: Бизнес-логика и состояние
- **Utils**: Чистые функции без side effects
- **Types**: Централизованные TypeScript типы
- **Constants**: Конфигурация в одном месте

### Component Design
- **Single Responsibility**: Каждый компонент решает одну задачу
- **Props Interface**: Явные типы для всех props
- **Callbacks**: useCallback для оптимизации
- **Memo**: React.memo где необходимо (можно добавить)

### Code Quality
- ✅ Строгая типизация TypeScript
- ✅ JSDoc комментарии для функций
- ✅ Осмысленные имена переменных
- ✅ Обработка edge cases
- ✅ Accessibility (aria-labels)

## 🚀 Как использовать

### Рисование стен

1. Выберите инструмент "Стена"
2. Кликните для установки первой точки
3. Перемещайте мышь - видите preview линии
4. Кликните для установки второй точки
5. Стена создана! Следующая начнется автоматически
6. Продолжайте кликать для создания комнаты
7. Двойной клик или замыкание - завершение

### Snapping (прилипание)

- При приближении к существующим точкам (< 20px)
- Курсор автоматически "прилипнет" к точке
- Визуальный индикатор - точка станет синей

### Замыкание контура

- Кликните рядом с первой точкой первой стены
- Контур автоматически замкнется
- Рисование завершится

## 📝 Важные константы

```typescript
SCALE = 0.1              // 1px = 10mm
GRID_SIZE = 50           // Сетка 500mm
WALL_THICKNESS = 10      // Толщина стены
SNAP_DISTANCE = 20       // Расстояние прилипания
DOUBLE_CLICK_THRESHOLD = 300  // мс для двойного клика
```

## 🔧 Технические детали

### useWallDrawing Hook

Управляет состоянием рисования стен:

```typescript
const {
  isDrawing,           // Активно ли рисование
  drawingStart,        // Начальная точка
  previewEnd,          // Превью конечной точки
  handleClick,         // Обработчик клика
  handleMouseMove,     // Обработчик движения мыши
  cancelDrawing,       // Отмена рисования
  finishDrawing        // Завершение рисования
} = useWallDrawing({ ... });
```

### Geometry Utils

```typescript
calculateDistance(p1, p2)         // Расстояние между точками
findSnapPoint(point, elements)    // Найти точку для прилипания
isClosingShape(point, elements)   // Проверка замыкания
getLastWallEndpoint(elements)     // Последняя точка стены
pixelsToMm(pixels)                // Конвертация px -> mm
```

## 🐛 Corner Cases

### Обработанные случаи:

1. **Быстрые клики**: Защита от случайных двойных кликов
2. **Закрытие формы**: Автоматическое определение замыкания
3. **Прилипание**: Работает с несколькими стенами
4. **ESC во время рисования**: Корректная отмена
5. **Смена инструмента**: Автоматическая отмена активного рисования
6. **Пустой массив стен**: Безопасная работа с первой стеной
7. **Переключение режимов**: Сохранение состояния

## 📊 Производительность

### Оптимизации:

- ✅ useCallback для всех обработчиков
- ✅ Refs для non-reactive значений
- ✅ Минимальные re-renders
- ✅ Efficient array operations
- ✅ Konva listening={false} для статичных элементов

### Возможные улучшения:

- [ ] React.memo для компонентов
- [ ] useMemo для вычислений
- [ ] Virtualization для большого количества элементов
- [ ] Web Workers для сложных вычислений

## 🔜 Следующие шаги

### Краткосрочные:
1. Добавить Zustand для state management
2. localStorage для автосохранения
3. Undo/Redo функциональность
4. Keyboard shortcuts (Ctrl+Z, Del, etc.)

### Среднесрочные:
1. Go Backend API
2. PostgreSQL интеграция
3. Реальные товары вместо моков
4. Экспорт в PNG/PDF

### Долгосрочные:
1. 3D режим с Three.js
2. ChatGPT интеграция для AI-агента
3. Шаблоны квартир
4. Монетизация

## 💻 Команды для запуска

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка для продакшена
npm run build

# Lint
npm run lint
```

## 📚 Документация функций

Все ключевые функции имеют JSDoc комментарии:

```typescript
/**
 * Find the nearest snap point from existing walls
 * Returns the snap point if found within SNAP_DISTANCE, 
 * otherwise returns the original point
 */
export const findSnapPoint = (point: Point, elements: EditorElement[]): Point => {
  // ...
}
```

## 🎓 Для Backend разработчиков

### Что важно знать:

1. **Все типы в types/editor.ts** - используйте их для API контрактов
2. **SCALE константа** - для конвертации между px и mm
3. **EditorElement union type** - discriminated union с полем `type`
4. **Point interface** - базовая структура координат
5. **Product interface** - структура товара для API

### API endpoints (будущие):

```typescript
GET  /api/products?category=stool
GET  /api/products/:id
POST /api/projects              // Сохранить проект
GET  /api/projects/:id          // Загрузить проект
PUT  /api/projects/:id          // Обновить проект
```

## 🤝 Contributing Guidelines

1. Используйте TypeScript строго
2. Добавляйте JSDoc к функциям
3. Следуйте существующей структуре
4. Пишите чистый, читаемый код
5. Обрабатывайте edge cases

---

**Автор рефакторинга**: Senior Frontend Developer  
**Дата**: 2025-10-08  
**Версия**: 2.0.0
