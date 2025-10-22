import type { Product } from '../types/editor';

// Mock Door Products
export const mockDoorProducts: Product[] = [
  {
    id: 'door-1',
    name: 'Стандартная дверь',
    category: 'Двери',
    price: 18000,
    dimensions: { width: 900, height: 10 },
    imageUrl: '🚪',
    description: 'Классическая межкомнатная дверь 0.9м'
  },
  {
    id: 'door-2',
    name: 'Широкая дверь',
    category: 'Двери',
    price: 25000,
    dimensions: { width: 1200, height: 10 },
    imageUrl: '🚪',
    description: 'Двустворчатая дверь 1.2м'
  },
  {
    id: 'door-3',
    name: 'Узкая дверь',
    category: 'Двери',
    price: 15000,
    dimensions: { width: 700, height: 10 },
    imageUrl: '🚪',
    description: 'Компактная дверь для санузла 0.7м'
  },
  {
    id: 'door-4',
    name: 'Входная дверь',
    category: 'Двери',
    price: 45000,
    dimensions: { width: 1000, height: 10 },
    imageUrl: '🚪',
    description: 'Металлическая входная дверь 1.0м'
  },
  {
    id: 'door-5',
    name: 'Раздвижная дверь',
    category: 'Двери',
    price: 32000,
    dimensions: { width: 1500, height: 10 },
    imageUrl: '🚪',
    description: 'Раздвижная стеклянная дверь 1.5м'
  }
];

// Mock Window Products
export const mockWindowProducts: Product[] = [
  {
    id: 'window-1',
    name: 'Стандартное окно',
    category: 'Окна',
    price: 15000,
    dimensions: { width: 1200, height: 10 },
    imageUrl: '🪟',
    description: 'Двустворчатое окно 1.2м'
  },
  {
    id: 'window-2',
    name: 'Широкое окно',
    category: 'Окна',
    price: 22000,
    dimensions: { width: 1800, height: 10 },
    imageUrl: '🪟',
    description: 'Трехстворчатое окно 1.8м'
  },
  {
    id: 'window-3',
    name: 'Узкое окно',
    category: 'Окна',
    price: 12000,
    dimensions: { width: 800, height: 10 },
    imageUrl: '🪟',
    description: 'Одностворчатое окно 0.8м'
  },
  {
    id: 'window-4',
    name: 'Панорамное окно',
    category: 'Окна',
    price: 45000,
    dimensions: { width: 3000, height: 10 },
    imageUrl: '🪟',
    description: 'Панорамное окно 3.0м'
  },
  {
    id: 'window-5',
    name: 'Балконный блок',
    category: 'Окна',
    price: 28000,
    dimensions: { width: 900, height: 10 },
    imageUrl: '🪟',
    description: 'Окно с балконной дверью 0.9м'
  }
];

// Mock Products Data - In production, this would come from an API
export const mockProducts: { [key: string]: Product[] } = {
  stool: [
    { 
      id: 's1', 
      name: 'Стул обычный', 
      description: 'Классический стул', 
      price: 5000, 
      dimensions: { width: 450, height: 450 }, 
      imageUrl: '🪑', 
      category: 'stool' 
    },
    { 
      id: 's2', 
      name: 'Стул мягкий', 
      description: 'Мягкий стул с подлокотниками', 
      price: 8500, 
      dimensions: { width: 600, height: 550 }, 
      imageUrl: '🪑', 
      category: 'stool' 
    },
    { 
      id: 's3', 
      name: 'Офисное кресло', 
      description: 'Эргономичное кресло', 
      price: 12000, 
      dimensions: { width: 650, height: 600 }, 
      imageUrl: '🪑', 
      category: 'stool' 
    },
  ],
  table: [
    { 
      id: 't1', 
      name: 'Обеденный стол', 
      description: 'Прямоугольный стол', 
      price: 22000, 
      dimensions: { width: 1600, height: 900 }, 
      imageUrl: '🪑', 
      category: 'table' 
    },
    { 
      id: 't2', 
      name: 'Круглый стол', 
      description: 'Круглый обеденный стол', 
      price: 28000, 
      dimensions: { width: 1200, height: 1200 }, 
      imageUrl: '⭕', 
      category: 'table' 
    },
    { 
      id: 't3', 
      name: 'Журнальный столик', 
      description: 'Низкий столик для гостиной', 
      price: 15000, 
      dimensions: { width: 1000, height: 600 }, 
      imageUrl: '🔲', 
      category: 'table' 
    },
  ],
  sofa: [
    { 
      id: 'sf1', 
      name: 'Диван угловой', 
      description: 'Комфортный угловой диван', 
      price: 90000, 
      dimensions: { width: 2700, height: 1700 }, 
      imageUrl: '🛋️', 
      category: 'sofa' 
    },
    { 
      id: 'sf2', 
      name: 'Диван прямой', 
      description: 'Классический диван', 
      price: 65000, 
      dimensions: { width: 2200, height: 900 }, 
      imageUrl: '🛋️', 
      category: 'sofa' 
    },
  ],
  bed: [
    { 
      id: 'b1', 
      name: 'Кровать двуспальная', 
      description: 'Кровать 160x200', 
      price: 45000, 
      dimensions: { width: 1600, height: 2000 }, 
      imageUrl: '🛏️', 
      category: 'bed' 
    },
    { 
      id: 'b2', 
      name: 'Кровать полуторная', 
      description: 'Кровать 120x200', 
      price: 35000, 
      dimensions: { width: 1200, height: 2000 }, 
      imageUrl: '🛏️', 
      category: 'bed' 
    },
  ],
  sink: [
    { 
      id: 'sn1', 
      name: 'Раковина стандарт', 
      description: 'Керамическая раковина', 
      price: 12000, 
      dimensions: { width: 600, height: 500 }, 
      imageUrl: '🚿', 
      category: 'sink' 
    },
  ],
  shower: [
    { 
      id: 'sh1', 
      name: 'Душевая кабина', 
      description: 'Стеклянная кабина 90x90', 
      price: 55000, 
      dimensions: { width: 900, height: 900 }, 
      imageUrl: '🚿', 
      category: 'shower' 
    },
  ],
  toilet: [
    { 
      id: 'tl1', 
      name: 'Унитаз подвесной', 
      description: 'Современный подвесной унитаз', 
      price: 25000, 
      dimensions: { width: 400, height: 600 }, 
      imageUrl: '🚽', 
      category: 'toilet' 
    },
  ],
  tv: [
    { 
      id: 'tv1', 
      name: 'Телевизор 55"', 
      description: 'Smart TV 55 дюймов', 
      price: 65000, 
      dimensions: { width: 1200, height: 50 }, 
      imageUrl: '📺', 
      category: 'tv' 
    },
  ],
  window: [
    {
      id: 'win1',
      name: 'Окно стандартное',
      description: 'Пластиковое окно 120x140см',
      price: 15000,
      dimensions: { width: 1200, height: 1400 },
      imageUrl: '🪟',
      category: 'window'
    },
    {
      id: 'win2',
      name: 'Окно панорамное',
      description: 'Большое панорамное окно 200x200см',
      price: 35000,
      dimensions: { width: 2000, height: 2000 },
      imageUrl: '🪟',
      category: 'window'
    }
  ],
  door: [
    {
      id: 'door1',
      name: 'Дверь межкомнатная',
      description: 'Стандартная дверь 80x200см',
      price: 12000,
      dimensions: { width: 800, height: 2000 },
      imageUrl: '🚪',
      category: 'door'
    },
    {
      id: 'door2',
      name: 'Дверь входная',
      description: 'Металлическая дверь 90x210см',
      price: 25000,
      dimensions: { width: 900, height: 2100 },
      imageUrl: '🚪',
      category: 'door'
    }
  ]
};
