import React from 'react';
import type { Furniture, Window, Door, Product } from '../../types/editor';
import { mockProducts, mockWindowProducts, mockDoorProducts } from '../../constants/mockProducts';

interface ProductPanelProps {
  selectedFurniture?: Furniture | null;
  selectedWindow?: Window | null;
  selectedDoor?: Door | null;
  onClose: () => void;
  onProductSelect: (product: Product) => void;
}

export const ProductPanel: React.FC<ProductPanelProps> = ({
  selectedFurniture,
  selectedWindow,
  selectedDoor,
  onClose,
  onProductSelect
}) => {
  if (!selectedFurniture && !selectedWindow && !selectedDoor) return null;
  
  // Determine which products to show
  let products: Product[] = [];
  let title = 'Выберите товар';
  
  if (selectedWindow) {
    products = mockWindowProducts;
    title = 'Выберите окно';
  } else if (selectedDoor) {
    products = mockDoorProducts;
    title = 'Выберите дверь';
  } else if (selectedFurniture) {
    const category = selectedFurniture.category;
    products = mockProducts[category] || [];
    title = 'Выберите товар';
    
    // Sort products by similarity to current dimensions for furniture
    products = [...products].sort((a, b) => {
      const aDiff = Math.abs(a.dimensions.width - selectedFurniture.dimensions.width) + 
                    Math.abs(a.dimensions.height - selectedFurniture.dimensions.height);
      const bDiff = Math.abs(b.dimensions.width - selectedFurniture.dimensions.width) + 
                    Math.abs(b.dimensions.height - selectedFurniture.dimensions.height);
      return aDiff - bDiff;
    });
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto flex-shrink-0">
      <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
        <h3 className="font-bold text-lg text-gray-900">{title}</h3>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          aria-label="Закрыть"
        >
          ✕
        </button>
      </div>
      <div className="p-4 space-y-4">
        {products.map(product => {
          const isSelected = selectedWindow 
            ? product.id === selectedWindow.productId 
            : selectedDoor
              ? product.id === selectedDoor.productId
              : selectedFurniture 
                ? product.id === selectedFurniture.productId 
                : false;
          
          return (
            <div
              key={product.id}
              className={`border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md ${
                isSelected 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => onProductSelect(product)}
            >
              <div className="flex items-center gap-3">
                <div className="text-4xl">{product.imageUrl}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{product.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{product.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {product.dimensions.width} x {product.dimensions.height} мм
                  </p>
                  <p className="text-lg font-bold text-green-600 mt-2">
                    {product.price.toLocaleString()} ₽
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
