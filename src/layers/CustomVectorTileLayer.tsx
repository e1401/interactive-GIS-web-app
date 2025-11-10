import { useEffect, useState, useRef } from 'react';
import { useMapContext } from '../context/mapContex';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
import { Style, Stroke, Fill } from 'ol/style';
import type { FeatureLike } from 'ol/Feature';
import ParcelPopup from '../components/ParcelPopup';
import { calculatePopupPosition } from '../utils/popupPositioning';
import type { Position } from '../types';

const API_URL = "https://gis-dev.listlabs.net/api/tegola/tegola-capabilities";

interface TegolaMap {
  name: string;
  tiles: string[];
}

interface TegolaCapabilities {
  maps: TegolaMap[];
}

interface PopupState {
  visible: boolean;
  position: Position | null;
  selectedFeatureId: number | null;
}

const initialPopupState: PopupState = {
  visible: false,
  position: null,
  selectedFeatureId: null,
};

const CustomVectorTileLayer = () => {
  const { map } = useMapContext();
  const [tileUrl, setTileUrl] = useState<string | null>(null);
  const [popup, setPopup] = useState<PopupState>(initialPopupState);
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
      const isSelected = featureId !== undefined && featureId === popup.selectedFeatureId;

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
      zIndex: 2,
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
        const featureId = clickedFeature.getId();

        const mapSize = map.getSize();
        if (!mapSize) return;

        const [mapWidth, mapHeight] = mapSize;
        const popupWidth = 256; // w-64 = 16rem = 256px
        const popupHeight = 200;

        const position = calculatePopupPosition(
          { x: event.pixel[0], y: event.pixel[1] },
          { width: popupWidth, height: popupHeight },
          { width: mapWidth, height: mapHeight }
        );

        setPopup({
          visible: true,
          position,
          selectedFeatureId: featureId,
        });
      } else {
        setPopup(initialPopupState);
      }
    };

    const handleMapMove = () => {
      if (popup.visible) {
        setPopup(initialPopupState);
      }
    };

    map.on('click', handleMapClick);
    map.on('movestart', handleMapMove);

    return () => {
      map.un('click', handleMapClick);
      map.un('movestart', handleMapMove);
      map.removeLayer(layer);
      layerRef.current = null;
    };
  }, [map, tileUrl, popup.selectedFeatureId]);

  useEffect(() => {
    if (layerRef.current) {
      layerRef.current.changed();
    }
  }, [popup.selectedFeatureId]);

  const handleClosePopup = () => {
    setPopup(initialPopupState);
  };

  return (
    <ParcelPopup
      visible={popup.visible}
      position={popup.position}
      id={popup.selectedFeatureId}
      onClose={handleClosePopup}
    />
  );
};

export default CustomVectorTileLayer;