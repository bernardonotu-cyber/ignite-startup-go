import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type BasketKind = "destination" | "flight" | "car" | "stay";

export type BasketItem = {
  id: string;
  kind: BasketKind;
  title: string;
  subtitle: string;
  price: number;
  destination: string;
};

type BasketContextValue = {
  items: BasketItem[];
  add: (item: BasketItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
  total: number;
  count: number;
};

const BasketContext = createContext<BasketContextValue | null>(null);
const STORAGE_KEY = "buboli.basket.v1";

export function TripBasketProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as BasketItem[]);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const value = useMemo<BasketContextValue>(() => {
    const add = (item: BasketItem) =>
      setItems((prev) => (prev.some((i) => i.id === item.id) ? prev : [...prev, item]));
    const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
    return {
      items,
      add,
      remove,
      clear: () => setItems([]),
      has: (id: string) => items.some((i) => i.id === id),
      total: items.reduce((sum, i) => sum + i.price, 0),
      count: items.length,
    };
  }, [items]);

  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>;
}

export function useTripBasket() {
  const ctx = useContext(BasketContext);
  if (!ctx) throw new Error("useTripBasket must be used inside TripBasketProvider");
  return ctx;
}
