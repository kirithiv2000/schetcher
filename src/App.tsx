import { useState } from 'react';
import CameraFeed from './components/CameraFeed';
import ImageOverlay from './components/ImageOverlay';
import Controls from './components/Controls';

function App() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [opacity, setOpacity] = useState<number>(0.5);
  const [isLocked, setIsLocked] = useState<boolean>(false);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <CameraFeed />
      
      <ImageOverlay 
        imageUrl={imageUrl} 
        opacity={opacity} 
        isLocked={isLocked} 
      />
      
      <Controls 
        onImageUpload={setImageUrl}
        opacity={opacity}
        onOpacityChange={setOpacity}
        isLocked={isLocked}
        onLockToggle={() => setIsLocked(!isLocked)}
        hasImage={imageUrl !== null}
      />
    </div>
  );
}

export default App;
