import { createContext, FC, PropsWithChildren, useContext, useMemo } from 'react';
import { AnalogueStore } from './AnalogueStore';
import { DigitalStore } from './DigitalStore';
import { TimeStore } from './TimeStore';

export interface Stores {
  time: TimeStore;
  analogue: AnalogueStore;
  digital: DigitalStore;
}

const StoresContext = createContext<Stores | null>(null);

export const StoresProvider: FC<PropsWithChildren> = ({ children }) => {
  const stores: Stores = useMemo(() => {
    const time = new TimeStore();
    const analogue = new AnalogueStore(time);
    const digital = new DigitalStore(time);
    return { time, analogue, digital };
  }, []);
  return <StoresContext.Provider value={stores}>{children}</StoresContext.Provider>;
};

export function useStores(): Stores {
  const stores = useContext(StoresContext);
  if (!stores) throw new Error('StoresContext not found');
  return stores;
}
