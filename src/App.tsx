import { useMapContext } from './context/mapContex';
import CustomMap from './components/CustomMap';


function App() {
  const { map } = useMapContext();


  console.log('Map instance available:', map !== null);

  return (
    <div className='h-screen w-screen relative'>
       <CustomMap />
    </div>
  )
}

export default App
