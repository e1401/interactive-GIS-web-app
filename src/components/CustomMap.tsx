import { OSM } from 'ol/source';
import { Map, TileLayer, DragRotateAndZoomInteraction, useMap } from 'react-openlayers';
import { fromLonLat, transformExtent } from 'ol/proj';
import { View } from 'ol';
import { useEffect } from 'react';
import { useMapContext } from '../context/mapContex';
import 'react-openlayers/dist/index.css'; // for css

// Coordinates in [longitude, latitude] format, important
const HOME_COORDINATES = fromLonLat([16.41774079137637, 46.20919794776915]);

const CROATIA_COORDINATES = transformExtent([
  13.4896, // min longitude
  42.3924, // min latitude
  19.4458, // max longitude
  46.5551  // max latitude
], 'EPSG:4326', 'EPSG:3857');

// Component that captures the map instance from react-openlayers and stores it in context
const MapInitializer = () => {
  const map = useMap(); // Get map from context
  const { setMap } = useMapContext();

  useEffect(() => {
    if (map) {
      setMap(map);
    }

    return () => {
      setMap(null);
    };
  }, [map, setMap]);

  return null;
};

const CustomMap = () => {

  const view = new View({
    center: HOME_COORDINATES,
    extent: CROATIA_COORDINATES,
    zoom: 16,
    maxZoom: 20,
    minZoom: 4,
    constrainOnlyCenter: false,
    projection: 'EPSG:3857',
  });

  return (
    <div className="absolute inset-0">
      <Map view={view}>
        <MapInitializer />
        <TileLayer source={new OSM()} zIndex={0} />
        <DragRotateAndZoomInteraction />
      </Map>
    </div>
  );
}

export default CustomMap;