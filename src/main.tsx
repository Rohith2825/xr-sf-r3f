import React from 'react';
import ReactDOM from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import { Html, useProgress } from '@react-three/drei';
import App from '@/App.jsx';
import '@/index.scss';
import UI from '@/UI/UI.tsx';
import Load from '@/Loader.tsx';


function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <Load progress={progress}/>
    </Html>   
  );
}


function CanvasWrapper() {
  const { progress } = useProgress();

  return (
    <div id="container">
      {progress >= 100 && <UI />}
      <Canvas camera={{ fov: 45 }} shadows>
        <React.Suspense fallback={<Loader />}>
          <App />
        </React.Suspense>
      </Canvas>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CanvasWrapper />
  </React.StrictMode>
);

