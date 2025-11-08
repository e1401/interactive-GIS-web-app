import { useEffect, useState, useRef } from 'react';
import { useMapContext } from '../context/mapContex';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
import { Style, Stroke, Fill } from 'ol/style';
import type { FeatureLike } from 'ol/Feature';
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
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
  const [featureProperties, setFeatureProperties] = useState<CadastralProperties | null>(null);
  const layerRef = useRef<VectorTileLayer | null>(null);


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

    const styleFunction = (feature: FeatureLike) => {
      const featureId = feature.getId();
      const isSelected = featureId !== undefined && featureId === selectedFeatureId;

      return new Style({
        stroke: new Stroke({
          color: isSelected ? '#00FF00' : '#4ECDC4',
          width: isSelected ? 2 : 1,
        }),
        fill: new Fill({
          color: isSelected ? 'rgba(0, 255, 0, 0.4)' : 'rgba(78, 205, 196, 0.2)',
        }),
      });
    };

    const layer = new VectorTileLayer({
      source: new VectorTileSource({
        format: new MVT(),
        url: tileUrl,
      }),
      style: styleFunction,
    });

    map.addLayer(layer);
    layerRef.current = layer;

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
        const featureId = clickedFeature.getId();

        const mapSize = map.getSize();
        if (!mapSize) return;

        const [mapWidth, mapHeight] = mapSize;
        const clickX = event.pixel[0];
        const clickY = event.pixel[1];

        const popupWidth = 256; // w-64 = 16rem = 256px
        const popupHeight = 200;

        let x: number;
        let y: number;

        // Horizontal positioning: check if there's room on the right
        if (clickX + popupWidth <= mapWidth) {
          // Room on right, place popup at click point
          x = clickX;
        } else {
          // No room on right, place popup to the left of click
          x = clickX - popupWidth;
          // If that goes off left edge, clamp it
          if (x < 0) {
            x = 0;
          }
        }

        // Vertical positioning: check if there's room below
        if (clickY + popupHeight <= mapHeight) {
          // Room below, place popup at click point
          y = clickY;
        } else {
          // No room below, place popup above click
          y = clickY - popupHeight;
          // If that goes off top edge, clamp it
          if (y < 0) {
            y = 0;
          }
        }

        setSelectedFeatureId(featureId);
        setFeatureProperties(properties);
        setPopupPosition({ x, y });
        setPopupVisible(true);
      } else {
        setSelectedFeatureId(null);
        setFeatureProperties(null);
        setPopupVisible(false);
        setPopupPosition(null);
      }
    };

    map.on('click', handleMapClick);

    return () => {
      map.un('click', handleMapClick);
      map.removeLayer(layer);
      layerRef.current = null;
    };
  }, [map, tileUrl, selectedFeatureId]);

  useEffect(() => {
    if (layerRef.current) {
      layerRef.current.changed();
    }
  }, [selectedFeatureId]);

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