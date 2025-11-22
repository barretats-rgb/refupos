export enum Category {
  STARTERS = 'Para Empezar',
  BURGERS = 'Hamburguesas',
  SANDWICHES = 'Sandwiches',
  SALADS = 'Ensaladas',
  HOT_DOGS = 'Hot Dogs',
  CASADOS = 'Casados',
  BRUNCH = 'Brunch',
  COCKTAILS = 'Cócteles',
  WINES_BEERS = 'Birras y Vinos',
  SHOTS = 'Shots',
  NON_ALCOHOLIC = 'Refrescos',
  COFFEE = 'Café',
  DESSERTS = 'Postres',
  EXTRAS = 'Extras'
}

export enum TableStatus {
  AVAILABLE = 'Disponible',
  OCCUPIED = 'Ocupada',
  PAYING = 'Pagando'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  image: string;
  description?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  category?: Category; // Added optional category for routing
}

export type TableShape = 'round' | 'rectangle' | 'square';

export interface Table {
  id: number;
  name: string;
  status: TableStatus;
  items: OrderItem[];
  guests: number;
  startTime?: Date;
  // Layout properties
  x: number; // percentage from left (0-100)
  y: number; // percentage from top (0-100)
  width: number; // relative unit size
  height: number; // relative unit size
  shape: TableShape;
  rotation: number; // degrees
}

export type MapElementType = 'entrance' | 'bar' | 'wall' | 'kitchen' | 'wc';

export interface MapElement {
  id: string;
  type: MapElementType;
  x: number;
  y: number;
  width: number; // percentage for walls/entrance usually, or px relative
  height: number;
  rotation: number; // degrees
  label?: string;
}

export interface AISuggestion {
  text: string;
  items?: string[];
}

// --- Printer Types ---

export type PrinterStatus = 'online' | 'offline' | 'error';
export type PrinterType = 'thermal' | 'dot_matrix';

export interface Printer {
  id: string;
  name: string;
  ip: string;
  model: string; // e.g., 'Epson TM-T20III'
  status: PrinterStatus;
  isDefault?: boolean;
}

export interface PrinterRoute {
  categoryId: Category;
  printerId: string; // ID of the printer
}

export interface PrintResult {
  success: boolean;
  message: string;
}