import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';
import { formatPrice } from '../util/format';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    // const storagedCart = Buscar dados do localStorage

    // if (storagedCart) {
    //   return JSON.parse(storagedCart);
    // }

    return [];
  });


  useEffect(() => {
    console.log({cart})
  },[cart])

  const addProduct = async (productId: number) => {
    try {

      const updateCart = [...cart];
      const productExists = updateCart.find((product: Product) => product.id === productId);
      
      const responseStocks = await api.get('stock');
      const stocks = [...responseStocks.data];
      const stock = stocks.find((item: Stock) => item.id === productId);

      if((productExists && productExists.amount + 1 > stock.amount) || stock.amount <= 0) {
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }

      const responseProducts = await api.get('/products');
      const findedProduct = responseProducts.data.find((product: Product) => product.id === productId)

      if(productExists) {
        setCart(oldData => [
          ...oldData.filter(item => item.id !== productExists.id),
          {
            ...productExists,
            amount: productExists.amount + 1,
          }
        ])
      } else {
        setCart(oldData => [
          ...oldData,
         {
          ...findedProduct,
          amount: 1,
         }
        ])
      }
    } catch {
      toast.error('Erro na adição do produto');
      
    }
  };

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
