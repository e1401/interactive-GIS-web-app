import { OSM } from 'ol/source';
import { Map, View, TileLayer } from 'react-openlayers';
import { fromLonLat } from 'ol/proj';
import 'react-openlayers/dist/index.css'; // for css

// Coordinates in [longitude, latitude] format, important
const HOME_COORDINATES = fromLonLat([16.41774079137637, 46.20919794776915]);

const CustomMap = (props) =>  {
  return ( 
    <Map controls={[]} interactions={[]}>
      <TileLayer source={new OSM()} />
      <View 
        center={HOME_COORDINATES} 
        zoom={8}
        projection="EPSG:3857"
      />
    </Map>
  );
}

export default CustomMap;