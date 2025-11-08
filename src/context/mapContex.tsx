import { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';
import type OLMap from 'ol/Map';

interface MapContextType {
  map: OLMap | null;
  setMap: (map: OLMap | null) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider = ({ children }: { children: ReactNode }) => {
  const [map, setMap] = useState<OLMap | null>(null);

  return (
    <MapContext.Provider value={{ map, setMap }}>
      {children}
    </MapContext.Provider>
  );
};


export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMapContext must be used within MapProvider');
  }
  return context;
};

export default MapContext;
