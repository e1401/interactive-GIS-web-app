import { useState } from 'react';
import CustomMap from './components/CustomMap';
import CustomVectorTileLayer from './layers/CustomVectorTileLayer';
import CorineLayer from './layers/CorineLayer';
import LayerToggle from './components/LayerToggle';

function App() {
  const [isCorineVisible, setIsCorineVisible] = useState(true);

  return (
    <div className='h-screen w-screen relative'>
      <LayerToggle visible={isCorineVisible} onToggle={setIsCorineVisible} />
      <CustomVectorTileLayer />
      <CorineLayer visible={isCorineVisible} />
      <CustomMap />
    </div>
  )
}

export default App
