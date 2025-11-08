import { useEffect, useState, useRef } from 'react';
import { useMapContext } from '../context/mapContex';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
import { Style, Stroke, Fill } from 'ol/style';
import ParcelPopup from '../components/ParcelPopup';
import type { CadastralProperties } from '../types';

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
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | number | null>(null);
  const selectedFeatureIdRef = useRef<string | number | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
  const [featureProperties, setFeatureProperties] = useState<CadastralProperties | null>(null);
  const [parcelsLayer, setParcelsLayer] = useState<VectorTileLayer | null>(null);


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

    const layer = new VectorTileLayer({
      source: new VectorTileSource({
        format: new MVT(),
        url: tileUrl,
      }),
      style: (feature) => {
        const properties = feature.getProperties();
        const featureId = properties.parcel_number || properties.id ||
                          properties.gid || properties.fid || feature.getId();
        const isSelected = featureId !== undefined && featureId === selectedFeatureIdRef.current;

        return new Style({
          stroke: new Stroke({
            color: isSelected ? '#00FF00' : '#4ECDC4',
            width: isSelected ? 2 : 1,
          }),
          fill: new Fill({
            color: isSelected ? 'rgba(0, 255, 0, 0.4)' : 'rgba(78, 205, 196, 0.2)',
          }),
        });
      },
    });

    map.addLayer(layer);
    setParcelsLayer(layer);

    const handleMapClick = (event: any) => {
      let clickedFeature: any = null;

      map.forEachFeatureAtPixel(event.pixel, (feature, mapLayer) => {
        if (mapLayer === layer) {
          clickedFeature = feature;
          return true;
        }
      });

      if (clickedFeature) {
        const properties = clickedFeature.getProperties();

        console.log('=== Feature Properties Debug ===');
        console.log('All property keys:', Object.keys(properties));
        Object.keys(properties).forEach(key => {
          if (key !== 'geometry') {
            console.log(`${key}:`, properties[key], typeof properties[key]);
          }
        });
        console.log('getId():', clickedFeature.getId());

        const featureId = properties.parcel_number || properties.id ||
                          properties.gid || properties.fid ||
                          clickedFeature.getId();

        selectedFeatureIdRef.current = featureId;
        setSelectedFeatureId(featureId);
        setFeatureProperties(properties);
        setPopupPosition({ x: event.pixel[0], y: event.pixel[1] });
        setPopupVisible(true);

        layer.changed();
      } else {
        selectedFeatureIdRef.current = null;
        setSelectedFeatureId(null);
        setFeatureProperties(null);
        setPopupVisible(false);
        setPopupPosition(null);

        layer.changed();
      }
    };

    map.on('click', handleMapClick);

    return () => {
      map.un('click', handleMapClick);
      map.removeLayer(layer);
      setParcelsLayer(null);
    };
  }, [map, tileUrl]);

  useEffect(() => {
    if (parcelsLayer) {
      parcelsLayer.changed();
    }
  }, [selectedFeatureId, parcelsLayer]);

  const handleClosePopup = () => {
    setSelectedFeatureId(null);
    setFeatureProperties(null);
    setPopupVisible(false);
    setPopupPosition(null);
  };

  return (
    <ParcelPopup
      visible={popupVisible}
      position={popupPosition}
      properties={featureProperties}
      onClose={handleClosePopup}
    />
  );
};

export default CustomVectorTileLayer;