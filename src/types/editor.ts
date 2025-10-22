// Core types for the room planner editor

export interface Point {
  x: number;
  y: number;
}

export interface Wall {
  id: string;
  type: 'wall';
  startPoint: Point;
  endPoint: Point;
  thickness: number;
  height?: number; // Room height in cm
  material?: string; // For future use
}

export interface Window {
  id: string;
  type: 'window';
  startPoint: Point;
  endPoint: Point;
  width: number;
  wallId?: string; // Reference to parent wall
  height?: number; // Window height
  productId?: string;
  price?: number;
  name?: string;
}

export interface Door {
  id: string;
  type: 'door';
  startPoint: Point;
  endPoint: Point;
  width: number;
  wallId?: string; // Reference to parent wall
  height?: number; // Door height
  openDirection?: 'left' | 'right' | 'inward' | 'outward';
  productId?: string;
  price?: number;
  name?: string;
}

export interface Furniture {
  id: string;
  type: 'furniture';
  category: string;
  productId?: string;
  position: Point;
  dimensions: { width: number; height: number };
  rotation: number;
  price: number;
  name: string;
  color?: string; // For future customization
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  dimensions: { width: number; height: number; depth?: number };
  imageUrl: string;
  category: string;
  manufacturer?: string;
  rating?: number;
  reviews?: number;
}

export type EditorElement = Wall | Window | Door | Furniture;

export type Tool = 
  | 'select' 
  | 'wall' 
  | 'window' 
  | 'door' 
  | 'stool' 
  | 'table' 
  | 'sofa' 
  | 'bed' 
  | 'sink' 
  | 'shower' 
  | 'toilet' 
  | 'tv';

export type ViewMode = '2D' | '3D';

export interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp?: Date;
}

export interface ProjectMetadata {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  thumbnail?: string;
}

export interface EditorState {
  elements: EditorElement[];
  selectedId: string | null;
  history: EditorElement[][];
  historyIndex: number;
  zoom: number;
  pan: Point;
}
