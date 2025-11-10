import { useEffect, useRef } from 'react';
import { useMapContext } from '../hooks/useMapContext';
import TileLayer from 'ol/layer/Tile';

import TileWMS from 'ol/source/TileWMS';

const CORINE_URL = 'https://image.discomap.eea.europa.eu/arcgis/services/Corine/CLC2018_WM/MapServer/WMSServer';

interface CorineLayerProps {
  visible: boolean;
}

const CorineLayer = ({ visible }: CorineLayerProps) => {
  const { map } = useMapContext();
  const layerRef = useRef<TileLayer<TileWMS> | null>(null);

  useEffect(() => {
    if (!map) return;

    const corineLayer = new TileLayer({
      source: new TileWMS({
        url: CORINE_URL,
        params: {
          //Layers 12 and 13 are relevant to Croatia, 13 has more detailed polygons
          'LAYERS': '13',
          'FORMAT': 'image/png',
          'TRANSPARENT': true,
          'VERSION': '1.3.0',
        }
      }),
      zIndex: 1,
      opacity: 0.7,
      visible: visible,
    });

    map.addLayer(corineLayer);
    layerRef.current = corineLayer;

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [map, visible]);

  useEffect(() => {
    if (layerRef.current) {
      layerRef.current.setVisible(visible);
    }
  }, [visible]);

  return null;
};

export default CorineLayer;
