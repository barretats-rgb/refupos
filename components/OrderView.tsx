import React, { useState } from 'react';
import { Table, Product, Category, OrderItem, TableStatus, Printer, PrinterRoute } from '../types';
import { MENU_ITEMS } from '../constants';
import { Search, Plus, Minus, Trash2, Sparkles, CreditCard, ArrowLeft, ChefHat, UtensilsCrossed, Printer as PrinterIcon, AlertTriangle, FileText } from 'lucide-react';
import { getOrderRecommendation, generateReceiptMessage } from '../services/geminiService';
import { printOrderTicket } from '../services/printerService';

interface OrderViewProps {
  table: Table;
  onUpdateTable: (updatedTable: Table) => void;
  onClose: () => void;
  printers: Printer[];
  routes: PrinterRoute[];
}

export const OrderView: React.FC<OrderViewProps> = ({ 
  table, 
  onUpdateTable, 
  onClose,
  printers,
  routes
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [receiptMsg, setReceiptMsg] = useState('');
  const [printStatus, setPrintStatus] = useState<string>('');
  const [printError, setPrintError] = useState<string | null>(null);

  // Filter products
  const filteredProducts = MENU_ITEMS.filter(product => {
    const matchesCategory = selectedCategory === 'ALL' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    return `₡${amount.toLocaleString('es-CR')}`;
  };

  const calculateTotal = () => table.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const addItem = (product: Product) => {
    const existingItem = table.items.find(item => item.productId === product.id);
    let newItems: OrderItem[];

    if (existingItem) {
      newItems = table.items.map(item => 
        item.productId === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      );
    } else {
      newItems = [...table.items, {
        id: Math.random().toString(36).substr(2, 9),
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        category: product.category // Store category for printing routing
      }];
    }
    
    onUpdateTable({ ...table, status: TableStatus.OCCUPIED, items: newItems });
    setAiMessage(null); // Clear previous suggestion on new action
  };

  const updateQuantity = (itemId: string, delta: number) => {
    const newItems = table.items.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0);

    const newStatus = newItems.length === 0 ? TableStatus.AVAILABLE : TableStatus.OCCUPIED;
    onUpdateTable({ ...table, status: newStatus, items: newItems });
  };

  const handleGetRecommendation = async () => {
    setIsThinking(true);
    const suggestion = await getOrderRecommendation(table.items);
    setAiMessage(suggestion);
    setIsThinking(false);
  };

  const executePrinting = async (items: OrderItem[], orderId: string) => {
    setPrintStatus('Procesando impresiones...');
    setPrintError(null);
    
    let errors: string[] = [];
    let successCount = 0;

    // 1. Group items by printer destination
    const jobs = new Map<string, OrderItem[]>(); // Map<PrinterId, Items>
    
    items.forEach(item => {
       if (!item.category) return;
       // Find route
       const route = routes.find(r => r.categoryId === item.category);
       const printerId = route ? route.printerId : printers.find(p => p.isDefault)?.id;
       
       if (printerId) {
         const current = jobs.get(printerId) || [];
         jobs.set(printerId, [...current, item]);
       }
    });

    // 2. Send print jobs to distinct printers (Kitchen/Bar tickets)
    for (const [printerId, jobItems] of jobs.entries()) {
        const printer = printers.find(p => p.id === printerId);
        if (printer) {
           const result = await printOrderTicket(printer, jobItems, table.name, orderId, 'KITCHEN');
           if (!result.success) errors.push(`${printer.name}: ${result.message}`);
           else successCount++;
        }
    }

    // 3. Print customer receipt (Always to default or cashier printer)
    const cashierPrinter = printers.find(p => p.isDefault) || printers[0];
    if (cashierPrinter) {
        const result = await printOrderTicket(cashierPrinter, items, table.name, orderId, 'RECEIPT');
        if (!result.success) errors.push(`Caja: ${result.message}`);
        else successCount++;
    }

    if (errors.length > 0) {
        setPrintError(errors[0]); // Show first error
        setPrintStatus(successCount > 0 ? 'Impresión parcial' : 'Falló impresión IP');
    } else {
        setPrintStatus('Impresión exitosa');
    }
  };

  const handleCheckout = async () => {
    setIsThinking(true);
    const msg = await generateReceiptMessage(table.items, calculateTotal());
    setReceiptMsg(msg);
    
    const orderId = `${table.id}-${Date.now().toString().slice(-4)}`;
    
    // Try printing, but don't block checkout if it fails
    await executePrinting(table.items, orderId);

    setIsThinking(false);
    setShowPaymentSuccess(true);
    
    // Close anyway after delay, UNLESS print error to give user time to read/native print
    // const delay = printError ? 10000 : 5000;
    
    // Actually, let's keep it simple. Auto close unless user interacts.
    // We set a timeout reference if we wanted to clear it, but for now rely on user closing or 5s.
    if (!printError) {
        setTimeout(() => {
           onUpdateTable({ ...table, status: TableStatus.AVAILABLE, items: [], guests: 0 });
           onClose();
        }, 5000);
    }
  };
  
  const handleNativePrint = () => {
      window.print();
  };
  
  const handleCloseSuccess = () => {
      onUpdateTable({ ...table, status: TableStatus.AVAILABLE, items: [], guests: 0 });
      onClose();
  };

  return (
    <div className="flex h-full bg-slate-900 animate-fade-in">
      {/* Left: Product Catalog */}
      <div className="flex-1 flex flex-col border-r border-slate-800">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/95 backdrop-blur z-10">
          <button onClick={onClose} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={20} /> Atrás
          </button>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text"
              placeholder="Buscar item..."
              className="w-full bg-slate-800 border border-slate-700 rounded-full py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="px-6 py-4 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {['ALL', ...Object.values(Category)].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as Category | 'ALL')}
              className={`
                px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0
                ${selectedCategory === cat 
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' 
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}
              `}
            >
              {cat === 'ALL' ? 'Todos' : cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-6 pt-0">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                onClick={() => addItem(product)}
                className="group flex flex-col bg-slate-800 rounded-xl overflow-hidden hover:ring-2 hover:ring-amber-500/50 transition-all text-left"
              >
                <div className="h-32 overflow-hidden relative bg-slate-700">
                   {product.image ? (
                     <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-slate-500"><UtensilsCrossed size={32}/></div>
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
                   <span className="absolute bottom-2 right-2 font-bold text-white bg-black/40 backdrop-blur px-2 py-1 rounded-lg text-sm">
                     {formatCurrency(product.price)}
                   </span>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-slate-200 text-sm line-clamp-1" title={product.name}>{product.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 truncate">{product.category}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Current Order */}
      <div className="w-96 bg-slate-950 flex flex-col shadow-2xl z-20 border-l border-slate-800">
        <div className="p-6 border-b border-slate-800">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-xl font-bold text-white">{table.name}</h2>
            <span className="px-2 py-1 rounded bg-slate-800 text-xs text-amber-500 font-mono">Order #{table.id}2023</span>
          </div>
          <p className="text-sm text-slate-500">
            {table.items.length > 0 ? 'Orden en curso' : 'Mesa vacía'}
          </p>
        </div>

        {/* Order Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {table.items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
              <ChefHat size={48} className="opacity-20" />
              <p className="text-center text-sm px-8">No hay items seleccionados. Agrega productos del menú.</p>
            </div>
          ) : (
            table.items.map(item => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-slate-800">
                <div className="flex-1 min-w-0 pr-4">
                  <h4 className="text-sm font-medium text-slate-200 truncate">{item.name}</h4>
                  <div className="text-xs text-slate-500">{formatCurrency(item.price)} u.</div>
                </div>
                <div className="flex items-center gap-3 bg-slate-800 rounded-lg p-1">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-red-400 transition-colors">
                    {item.quantity === 1 ? <Trash2 size={14}/> : <Minus size={14}/>}
                  </button>
                  <span className="text-sm font-mono w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-emerald-400 transition-colors">
                    <Plus size={14}/>
                  </button>
                </div>
                <div className="w-20 text-right font-mono text-sm font-medium text-amber-500">
                  {formatCurrency(item.price * item.quantity)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* AI Suggestion Box */}
        <div className="px-4 pb-2">
          {aiMessage && (
            <div className="bg-indigo-900/30 border border-indigo-500/30 p-3 rounded-lg mb-3 animate-fade-in">
               <div className="flex gap-2">
                 <Sparkles className="text-indigo-400 shrink-0" size={16} />
                 <p className="text-xs text-indigo-200 italic">"{aiMessage}"</p>
               </div>
            </div>
          )}
          
          <button 
            onClick={handleGetRecommendation}
            disabled={isThinking}
            className="w-full py-2 border border-dashed border-slate-700 rounded-lg text-xs text-slate-400 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all flex items-center justify-center gap-2"
          >
            {isThinking ? 'Consultando al Chef...' : <><Sparkles size={14} /> Sugerencia del Chef (IA)</>}
          </button>
        </div>

        {/* Footer / Checkout */}
        <div className="p-6 bg-slate-900 border-t border-slate-800">
          <div className="flex justify-between items-center mb-4 text-slate-400 text-sm">
            <span>Subtotal</span>
            <span>{formatCurrency(calculateTotal())}</span>
          </div>
          <div className="flex justify-between items-center mb-6 text-2xl font-bold text-white">
            <span>Total</span>
            <span>{formatCurrency(calculateTotal())}</span>
          </div>
          
          <button 
            onClick={handleCheckout}
            disabled={table.items.length === 0}
            className={`
              w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg
              ${table.items.length === 0 
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                : 'bg-amber-500 hover:bg-amber-400 text-white shadow-amber-500/20 hover:shadow-amber-500/40 active:scale-[0.98]'}
            `}
          >
            <CreditCard size={20} />
            Cobrar Mesa
          </button>
        </div>
      </div>

      {/* Payment Success Modal */}
      {showPaymentSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl shadow-amber-500/10 relative overflow-hidden">
            
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="text-emerald-500" size={32} />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2">¡Mesa Cerrada!</h3>
            <p className="text-slate-400 mb-6">El registro se ha guardado correctamente.</p>
            
            {/* Print Status Area */}
            <div className={`mb-6 rounded-lg p-3 border text-xs text-left ${printError ? 'bg-amber-900/20 border-amber-900/50' : 'bg-slate-800 border-slate-700'}`}>
               <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-300 flex items-center gap-2">
                     <PrinterIcon size={12} /> Estado Impresora
                  </span>
                  <span className={printError ? 'text-amber-500' : 'text-emerald-500'}>
                    {printStatus}
                  </span>
               </div>
               {printError && (
                 <div className="flex flex-col gap-3 mt-2 text-amber-500/80">
                   <div className="flex items-start gap-2">
                     <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                     <span className="leading-tight">{printError}</span>
                   </div>
                   
                   {/* Fallback Button */}
                   <button 
                     onClick={handleNativePrint}
                     className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-white rounded-lg font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition-colors"
                   >
                      <FileText size={14} />
                      Imprimir Ticket (Tablet/Nativo)
                   </button>
                 </div>
               )}
            </div>

            {receiptMsg && (
              <div className="bg-slate-800 p-4 rounded-lg mb-6 border border-slate-700 transform -rotate-1">
                 <p className="font-mono text-xs text-slate-500 mb-2 text-center">*** REFUGIO POS ***</p>
                 <p className="text-sm text-amber-100 italic text-center">"{receiptMsg}"</p>
              </div>
            )}
            
            {printError ? (
                 <button onClick={handleCloseSuccess} className="text-slate-500 hover:text-white text-sm underline">
                     Cerrar sin imprimir
                 </button>
            ) : (
                <>
                    <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                    <div className="h-full bg-emerald-500 animate-[width_5s_linear_forwards]" style={{ width: '0%' }}></div>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">Volviendo al mapa...</p>
                </>
            )}
          </div>
        </div>
      )}

      {/* HIDDEN PRINTABLE RECEIPT FOR TABLETS */}
      <div id="printable-area" style={{ display: 'none' }}>
         <div style={{ textAlign: 'center', marginBottom: '10px' }}>
             <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>REFUGIO POS</h2>
             <p style={{ margin: 0, fontSize: '12px' }}>Tamarindo, Costa Rica</p>
             <p style={{ margin: '5px 0', borderBottom: '1px dashed black' }}></p>
         </div>
         <div style={{ fontSize: '12px', marginBottom: '10px' }}>
             <p style={{ margin: '2px 0' }}>Mesa: {table.name}</p>
             <p style={{ margin: '2px 0' }}>Fecha: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
         </div>
         <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
             <thead>
                 <tr style={{ borderBottom: '1px dashed black' }}>
                     <th style={{ textAlign: 'left' }}>Cant</th>
                     <th style={{ textAlign: 'left' }}>Desc</th>
                     <th style={{ textAlign: 'right' }}>Total</th>
                 </tr>
             </thead>
             <tbody>
                 {table.items.map((item, i) => (
                     <tr key={i}>
                         <td style={{ textAlign: 'left', verticalAlign: 'top', padding: '2px 0' }}>{item.quantity}</td>
                         <td style={{ textAlign: 'left', padding: '2px 0' }}>{item.name}</td>
                         <td style={{ textAlign: 'right', verticalAlign: 'top', padding: '2px 0' }}>{item.price * item.quantity}</td>
                     </tr>
                 ))}
             </tbody>
         </table>
         <div style={{ marginTop: '10px', borderTop: '1px dashed black', paddingTop: '5px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '14px' }}>
                 <span>TOTAL</span>
                 <span>{formatCurrency(calculateTotal())}</span>
             </div>
         </div>
         <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '10px' }}>
             <p>¡Gracias por su visita!</p>
             <p>{receiptMsg}</p>
         </div>
      </div>

    </div>
  );
};