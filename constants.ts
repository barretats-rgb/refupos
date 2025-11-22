import { Category, Product, Table, TableStatus, MapElement } from './types';

export const MENU_ITEMS: Product[] = [
  // --- PARA EMPEZAR ---
  { id: 'pe1', name: 'Papas Refugio', price: 5500, category: Category.STARTERS, image: 'https://images.unsplash.com/photo-1573080496987-aeb7d53385c7?auto=format&fit=crop&w=300&q=80', description: 'Alioli de trufa, tocineta o huevo frito y cebollita de verdeo.' },
  { id: 'pe2', name: 'Croquetas (Pollo)', price: 3000, category: Category.STARTERS, image: 'https://images.unsplash.com/photo-1563861826300-9f71c62052ca?auto=format&fit=crop&w=300&q=80', description: 'De pollo y verdeo.' },
  { id: 'pe3', name: 'Croquetas (Hongos)', price: 3000, category: Category.STARTERS, image: 'https://images.unsplash.com/photo-1563861826300-9f71c62052ca?auto=format&fit=crop&w=300&q=80', description: 'De hongos y espinaca.' },
  { id: 'pe4', name: 'Cubitos de Queso', price: 2100, category: Category.STARTERS, image: 'https://images.unsplash.com/photo-1563188057-0797302488d5?auto=format&fit=crop&w=300&q=80', description: 'Marinados en aceite de ajo y orégano | Fritos.' },
  { id: 'pe5', name: 'Papas Fritas con Queso', price: 5500, category: Category.STARTERS, image: 'https://images.unsplash.com/photo-1585109649139-3668018951a7?auto=format&fit=crop&w=300&q=80' },
  { id: 'pe6', name: 'Aceitunas Marinadas', price: 1400, category: Category.STARTERS, image: 'https://images.unsplash.com/photo-1589366861266-932b1239634e?auto=format&fit=crop&w=300&q=80', description: 'Paprika, orégano, tomillo fresco, ajo.' },
  { id: 'pe7', name: 'Guacamole Dip', price: 3000, category: Category.STARTERS, image: 'https://images.unsplash.com/photo-1620589125156-fd5028c5e05b?auto=format&fit=crop&w=300&q=80', description: 'Acompañado con tostadas.' },
  { id: 'pe8', name: 'Papas Fritas', price: 2500, category: Category.STARTERS, image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=300&q=80' },
  { id: 'pe9', name: 'Maní Salado', price: 800, category: Category.STARTERS, image: 'https://images.unsplash.com/photo-1526685061642-17983b632944?auto=format&fit=crop&w=300&q=80' },
  { id: 'pe10', name: 'Maní Picante', price: 900, category: Category.STARTERS, image: 'https://images.unsplash.com/photo-1526685061642-17983b632944?auto=format&fit=crop&w=300&q=80' },

  // --- HAMBURGUESAS ---
  { id: 'h1s', name: 'Ocean Blue (Simple)', price: 8000, category: Category.BURGERS, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80', description: 'Queso azul, mozzarella, hongos, rúcula y alioli.' },
  { id: 'h1d', name: 'Ocean Blue (Doble)', price: 9800, category: Category.BURGERS, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80' },
  { id: 'h2s', name: 'Smoky Sweet (Simple)', price: 7700, category: Category.BURGERS, image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=300&q=80', description: 'Mozzarella, cebolla caramelizada, chile dulce asado.' },
  { id: 'h2d', name: 'Smoky Sweet (Doble)', price: 9500, category: Category.BURGERS, image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=300&q=80' },
  { id: 'h3s', name: 'Real BBQ (Simple)', price: 7700, category: Category.BURGERS, image: 'https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?auto=format&fit=crop&w=300&q=80', description: 'Cheddar, tocineta, cebolla caramelizada, BBQ.' },
  { id: 'h3d', name: 'Real BBQ (Doble)', price: 9500, category: Category.BURGERS, image: 'https://images.unsplash.com/photo-1596662951482-0c4ba74a6df6?auto=format&fit=crop&w=300&q=80' },
  { id: 'h4s', name: 'Golden Burst (Simple)', price: 7300, category: Category.BURGERS, image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=300&q=80', description: 'Mozzarella, huevo frito, lechuga y tomate.' },
  { id: 'h4d', name: 'Golden Burst (Doble)', price: 9100, category: Category.BURGERS, image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=300&q=80' },
  { id: 'h5s', name: 'Cheese Burger (Simple)', price: 5500, category: Category.BURGERS, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=300&q=80', description: 'Queso cheddar.' },
  { id: 'h5d', name: 'Cheese Burger (Doble)', price: 7300, category: Category.BURGERS, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=300&q=80' },
  { id: 'h6s', name: 'Spicy Cheese (Simple)', price: 6200, category: Category.BURGERS, image: 'https://images.unsplash.com/photo-1605789538467-f715d58e03f9?auto=format&fit=crop&w=300&q=80', description: 'Queso cheddar, jalapeños asados.' },
  { id: 'h6d', name: 'Spicy Cheese (Doble)', price: 8000, category: Category.BURGERS, image: 'https://images.unsplash.com/photo-1605789538467-f715d58e03f9?auto=format&fit=crop&w=300&q=80' },

  // --- SANDWICHES ---
  { id: 's1', name: 'Sweet Pollo', price: 6800, category: Category.SANDWICHES, image: 'https://images.unsplash.com/photo-1521390188846-e2a3a97453a0?auto=format&fit=crop&w=300&q=80', description: 'Pollo crunchy, mozzarella, chile dulce asado.' },
  { id: 's2', name: 'Tama Cheesesteak', price: 7300, category: Category.SANDWICHES, image: 'https://images.unsplash.com/photo-1603903631889-b5f3ba4d5b9b?auto=format&fit=crop&w=300&q=80', description: 'Carne, mozzarella, huevo frito, cebolla caramelizada.' },
  { id: 's3', name: 'Vegetariano', price: 6500, category: Category.SANDWICHES, image: 'https://images.unsplash.com/photo-1540914124281-342587941389?auto=format&fit=crop&w=300&q=80', description: 'Milanesa de zucchini, mozzarella, rúcula, pepino.' },

  // --- ENSALADAS ---
  { id: 'en1', name: 'Tropical', price: 7300, category: Category.SALADS, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80', description: 'Piña asada, mango, aguacate, pepino, maní, coco.' },
  { id: 'en2', name: 'César', price: 6500, category: Category.SALADS, image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=300&q=80' },
  { id: 'en3', name: 'Pura Mediterránea', price: 7400, category: Category.SALADS, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80', description: 'Tomates cherry, aceitunas, queso semiduro, garbanzos.' },

  // --- HOT DOGS ---
  { id: 'hd1', name: 'Clásico', price: 3900, category: Category.HOT_DOGS, image: 'https://images.unsplash.com/photo-1612392062631-94dd858cba88?auto=format&fit=crop&w=300&q=80' },
  { id: 'hd2', name: 'A la Mexicana', price: 5500, category: Category.HOT_DOGS, image: 'https://images.unsplash.com/photo-1595260195591-10940954b097?auto=format&fit=crop&w=300&q=80', description: 'Guacamole, pico de gallo, alioli chipotle.' },
  { id: 'hd3', name: 'El Bueno', price: 6400, category: Category.HOT_DOGS, image: 'https://images.unsplash.com/photo-1627054249765-b74681347063?auto=format&fit=crop&w=300&q=80', description: 'Cebolla caramelizada, queso, tocino, alioli de pesto.' },

  // --- CASADOS ---
  { id: 'ca1', name: 'Casado Pollo Crunchy', price: 4900, category: Category.CASADOS, image: 'https://images.unsplash.com/photo-1626804475297-411d8c6b71f5?auto=format&fit=crop&w=300&q=80' },
  { id: 'ca2', name: 'Casado Carne de Res', price: 5200, category: Category.CASADOS, image: 'https://images.unsplash.com/photo-1596708709087-c81665a507f1?auto=format&fit=crop&w=300&q=80' },
  { id: 'ca3', name: 'Casado Vegetariano', price: 4800, category: Category.CASADOS, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=300&q=80' },

  // --- BRUNCH ---
  { id: 'br1', name: 'Omelet', price: 5900, category: Category.BRUNCH, image: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=300&q=80' },
  { id: 'br2', name: 'Desayuno Americano', price: 5000, category: Category.BRUNCH, image: 'https://images.unsplash.com/photo-1533089862017-ec76e35d038c?auto=format&fit=crop&w=300&q=80' },
  { id: 'br3', name: 'Avocado Toast', price: 4900, category: Category.BRUNCH, image: 'https://images.unsplash.com/photo-1588137372308-15f75323ca8d?auto=format&fit=crop&w=300&q=80' },
  { id: 'br4', name: 'Panini', price: 5300, category: Category.BRUNCH, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=300&q=80' },
  { id: 'br5', name: 'Gallo Pinto', price: 4500, category: Category.BRUNCH, image: 'https://images.unsplash.com/photo-1587394541743-4ac899d42404?auto=format&fit=crop&w=300&q=80' },
  { id: 'br6', name: 'Burrito Pinto', price: 4800, category: Category.BRUNCH, image: 'https://images.unsplash.com/photo-1566740933430-b5e70b06d2d5?auto=format&fit=crop&w=300&q=80' },
  { id: 'br7', name: 'Yogurt Refugio', price: 3800, category: Category.BRUNCH, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=300&q=80' },
  { id: 'br8', name: 'Pancake Salado', price: 4300, category: Category.BRUNCH, image: 'https://images.unsplash.com/photo-1554520735-0a6b8b6ce8b7?auto=format&fit=crop&w=300&q=80' },
  { id: 'br9', name: 'Pancake de Banano', price: 3900, category: Category.BRUNCH, image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=300&q=80' },

  // --- COCKTAILS ---
  { id: 'ck1', name: 'Endless Summer', price: 6000, category: Category.COCKTAILS, image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=300&q=80' },
  { id: 'ck2', name: 'Tico Mule', price: 6000, category: Category.COCKTAILS, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=300&q=80' },
  { id: 'ck3', name: 'Pacific Breeze', price: 6000, category: Category.COCKTAILS, image: 'https://images.unsplash.com/photo-1536935338788-843bb52b3646?auto=format&fit=crop&w=300&q=80' },
  { id: 'ck4', name: 'Satisfaction', price: 6000, category: Category.COCKTAILS, image: 'https://images.unsplash.com/photo-1597075687490-8f673c6c17f6?auto=format&fit=crop&w=300&q=80' },
  { id: 'ck5', name: 'Cinnamon Brew Bliss', price: 6000, category: Category.COCKTAILS, image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=300&q=80' },
  { id: 'ck6', name: 'Guana Sour', price: 6000, category: Category.COCKTAILS, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=300&q=80' },
  { id: 'ck7', name: 'Outlaw Sangría', price: 6000, category: Category.COCKTAILS, image: 'https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&w=300&q=80' },
  // Clasicos
  { id: 'cl1', name: 'Cuba Libre', price: 3700, category: Category.COCKTAILS, image: 'https://images.unsplash.com/photo-1605248152564-972049d10e0f?auto=format&fit=crop&w=300&q=80' },
  { id: 'cl2', name: 'Vodka Soda', price: 3700, category: Category.COCKTAILS, image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=300&q=80' },
  { id: 'cl3', name: 'Gin Tonic', price: 3700, category: Category.COCKTAILS, image: 'https://images.unsplash.com/photo-1598679253544-2c97992403ea?auto=format&fit=crop&w=300&q=80' },
  { id: 'cl4', name: 'Negroni', price: 5500, category: Category.COCKTAILS, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=300&q=80' },
  { id: 'cl5', name: 'Caipirinha', price: 4000, category: Category.COCKTAILS, image: 'https://images.unsplash.com/photo-1582294101185-502847a969f5?auto=format&fit=crop&w=300&q=80' },
  { id: 'cl6', name: 'Aperol Spritz', price: 4500, category: Category.COCKTAILS, image: 'https://images.unsplash.com/photo-1560512823-8db03e120d48?auto=format&fit=crop&w=300&q=80' },
  { id: 'cl7', name: 'Old Fashioned', price: 5000, category: Category.COCKTAILS, image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=300&q=80' },
  { id: 'cl8', name: 'Moscow Mule', price: 5000, category: Category.COCKTAILS, image: 'https://images.unsplash.com/photo-1530991037531-51f906903829?auto=format&fit=crop&w=300&q=80' },

  // --- BEBIDAS / CERVEZAS / VINOS ---
  { id: 'bv1', name: 'Birra Nacional', price: 1800, category: Category.WINES_BEERS, image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?auto=format&fit=crop&w=300&q=80' },
  { id: 'bv2', name: 'Birra Importada', price: 2600, category: Category.WINES_BEERS, image: 'https://images.unsplash.com/photo-1585553616435-2dc0a54e271d?auto=format&fit=crop&w=300&q=80' },
  { id: 'bv3', name: 'Boa Craft', price: 3000, category: Category.WINES_BEERS, image: 'https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=300&q=80' },
  { id: 'bv4', name: 'Copa de Vino', price: 3700, category: Category.WINES_BEERS, image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=300&q=80' },

  // --- COFFEE ---
  { id: 'cf1', name: 'Espresso', price: 1000, category: Category.COFFEE, image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?auto=format&fit=crop&w=300&q=80' },
  { id: 'cf2', name: 'Americano', price: 1500, category: Category.COFFEE, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80' },
  { id: 'cf3', name: 'Cappuccino', price: 2000, category: Category.COFFEE, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=300&q=80' },
  { id: 'cf4', name: 'Latte', price: 2000, category: Category.COFFEE, image: 'https://images.unsplash.com/photo-1570968992193-d6ea045653b8?auto=format&fit=crop&w=300&q=80' },
  { id: 'cf5', name: 'Cold Brew', price: 1500, category: Category.COFFEE, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=300&q=80' },
  { id: 'cf6', name: 'Iced Latte', price: 2000, category: Category.COFFEE, image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=300&q=80' },

  // --- POSTRES ---
  { id: 'de1', name: 'Affogato', price: 2500, category: Category.DESSERTS, image: 'https://images.unsplash.com/photo-1598214886806-c87b84b7078b?auto=format&fit=crop&w=300&q=80' },
  { id: 'de2', name: 'Alfajor Chocolate', price: 2000, category: Category.DESSERTS, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=300&q=80' },
  { id: 'de3', name: 'Alfajor Maicena', price: 1300, category: Category.DESSERTS, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=300&q=80' },
  { id: 'de4', name: 'Budin del Dia', price: 1000, category: Category.DESSERTS, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=300&q=80' },

  // --- EXTRAS ---
  { id: 'ex1', name: 'Extra Aguacate', price: 1000, category: Category.EXTRAS, image: '' },
  { id: 'ex2', name: 'Extra Tocineta', price: 1200, category: Category.EXTRAS, image: '' },
  { id: 'ex3', name: 'Extra Queso', price: 700, category: Category.EXTRAS, image: '' },
];

export const INITIAL_TABLES: Table[] = [
  // Zona Barra (Top Left/Center)
  { id: 1, name: 'B1', status: TableStatus.AVAILABLE, items: [], guests: 0, x: 25, y: 22, width: 60, height: 60, shape: 'square', rotation: 0 },
  { id: 2, name: 'B2', status: TableStatus.OCCUPIED, items: [], guests: 2, x: 32, y: 22, width: 60, height: 60, shape: 'square', rotation: 0 },
  { id: 3, name: 'B3', status: TableStatus.AVAILABLE, items: [], guests: 0, x: 39, y: 22, width: 60, height: 60, shape: 'square', rotation: 0 },
  
  // Zona Central (Round Tables)
  { id: 4, name: 'Mesa 4', status: TableStatus.AVAILABLE, items: [], guests: 0, x: 20, y: 50, width: 90, height: 90, shape: 'round', rotation: 0 },
  { id: 5, name: 'Mesa 5', status: TableStatus.AVAILABLE, items: [], guests: 0, x: 35, y: 65, width: 90, height: 90, shape: 'round', rotation: 0 },
  { id: 6, name: 'Mesa 6', status: TableStatus.AVAILABLE, items: [], guests: 0, x: 50, y: 50, width: 90, height: 90, shape: 'round', rotation: 0 },
  { id: 7, name: 'Mesa 7', status: TableStatus.AVAILABLE, items: [], guests: 0, x: 65, y: 65, width: 90, height: 90, shape: 'round', rotation: 0 },

  // Zona Privada / Booths (Right Wall)
  { id: 8, name: 'P1', status: TableStatus.AVAILABLE, items: [], guests: 0, x: 85, y: 20, width: 100, height: 70, shape: 'rectangle', rotation: 0 },
  { id: 9, name: 'P2', status: TableStatus.AVAILABLE, items: [], guests: 0, x: 85, y: 40, width: 100, height: 70, shape: 'rectangle', rotation: 0 },
  { id: 10, name: 'P3', status: TableStatus.PAYING, items: [], guests: 4, x: 85, y: 60, width: 100, height: 70, shape: 'rectangle', rotation: 0 },
  { id: 11, name: 'P4', status: TableStatus.AVAILABLE, items: [], guests: 0, x: 85, y: 80, width: 100, height: 70, shape: 'rectangle', rotation: 0 },

  // Entrada / Ventana (Bottom Left)
  { id: 12, name: 'V1', status: TableStatus.AVAILABLE, items: [], guests: 0, x: 15, y: 85, width: 70, height: 70, shape: 'square', rotation: 45 },
];

export const INITIAL_MAP_ELEMENTS: MapElement[] = [
  { id: 'bar-main', type: 'bar', x: 50, y: 8, width: 60, height: 15, rotation: 0, label: 'BARRA PRINCIPAL' },
  { id: 'ent-main', type: 'entrance', x: 50, y: 98, width: 20, height: 2, rotation: 0, label: 'ENTRADA' },
  { id: 'kit-main', type: 'kitchen', x: 98, y: 25, width: 2, height: 30, rotation: 0, label: 'COCINA' },
];