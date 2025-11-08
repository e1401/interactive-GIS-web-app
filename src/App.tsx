import CustomMap from './components/CustomMap';
import CustomVectorTileLayer from './layers/CustomVectorTileLayer';


function App() {


  return (
    <div className='h-screen w-screen relative'>
       <CustomVectorTileLayer />
       <CustomMap />
    </div>
  )
}

export default App
