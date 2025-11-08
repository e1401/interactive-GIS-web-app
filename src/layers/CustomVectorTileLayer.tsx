import { useEffect, useState } from 'react';
import { useMapContext } from '../context/mapContex';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
import { Style, Stroke, Fill } from 'ol/style';

const API_URL = "https://gis-dev.listlabs.net/api/tegola/tegola-capabilities";

interface TegolaMap {
  name: string;
  tiles: string[];
}

interface TegolaCapabilities {
  maps: TegolaMap[];
}

const CustomVectorTileLayer = () => {
  const { map } = useMapContext();
  const [tileUrl, setTileUrl] = useState<string | null>(null);

 
  useEffect(() => {
    const fetchCapabilities = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.statusText}`);
        }

        const data: TegolaCapabilities = await response.json();

        const parcelsMap = data.maps.find(m => m.name === 'cadastral_parcels');

        if (parcelsMap && parcelsMap.tiles && parcelsMap.tiles.length > 0) {
          setTileUrl(parcelsMap.tiles[0]);
          console.log('Cadastral parcels tile URL:', parcelsMap.tiles[0]);
        } else {
          console.error('cadastral_parcels layer not found in capabilities');
        }
      } catch (err) {
        console.error('Error fetching Tegola capabilities:', err);
      }
    };

    fetchCapabilities();
  }, []);

 
  useEffect(() => {
    if (!map || !tileUrl) return;

    
    const parcelsLayer = new VectorTileLayer({
      source: new VectorTileSource({
        format: new MVT(),
        url: tileUrl,
      }),
      style: new Style({
        stroke: new Stroke({
          color: '#4ECDC4',
          width: 1,
        }),
        fill: new Fill({
          color: 'rgba(78, 205, 196, 0.2)',
        }),
      }),
    });

  
    map.addLayer(parcelsLayer);
  

  
    return () => {
      map.removeLayer(parcelsLayer);
    };
  }, [map, tileUrl]);

  return null; 
};

export default CustomVectorTileLayer;