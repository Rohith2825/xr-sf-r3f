import { useThree, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useRef, ReactNode } from 'react';
import * as THREE from 'three';
import { useXR } from '@react-three/xr';

interface UIInFrontOfCameraProps {
  children: ReactNode;
  distance?: number;
  scale?: number;
}

const UIInFrontOfCamera = ({ 
  children, 
  distance = 1,
  scale = 0.25 // Default scale factor
}: UIInFrontOfCameraProps) => {
  const { camera: defaultCamera } = useThree();
  const xr = useXR();
  const groupRef = useRef<THREE.Group>(null);

  // Temp objects to avoid allocations
  const worldPos = useRef(new THREE.Vector3());
  const worldQuat = useRef(new THREE.Quaternion());
  const gazeDir = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!groupRef.current) return;
    const camera = xr.isPresenting && xr.player?.camera ? xr.player.camera : defaultCamera;

    camera.updateMatrixWorld();
    camera.getWorldPosition(worldPos.current);
    camera.getWorldQuaternion(worldQuat.current);
    camera.getWorldDirection(gazeDir.current);

    groupRef.current.position.copy(worldPos.current)
      .add(gazeDir.current.multiplyScalar(distance));
    groupRef.current.quaternion.copy(worldQuat.current);
  });

  return (
    <group ref={groupRef}>
      <Html
        transform
        occlude
        scale={scale}
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'auto',
          transform: `scale(${scale})`,
          transformOrigin: 'center center'
        }}
      >
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'auto',
          maxWidth: '800px', // Limit maximum width
          maxHeight: '600px', // Limit maximum height
          padding: '20px',
          boxSizing: 'border-box'
        }}>
          {children}
        </div>
      </Html>
    </group>
  );
};

export default UIInFrontOfCamera; 