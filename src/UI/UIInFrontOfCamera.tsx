import { useThree } from '@react-three/fiber';
import { useRef, ReactNode } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

interface UIInFrontOfCameraProps {
  children: ReactNode;
  position?: [number, number, number];
  scale?: number;
}

const UIInFrontOfCamera = ({ 
  children, 
  position = [0, 0, -15], // Default position in front of user
  scale = 1
}: UIInFrontOfCameraProps) => {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef} position={new THREE.Vector3(...position)}>
      <Html
        transform
        occlude
        distanceFactor={scale}
        style={{
          width: '800px',
          height: '600px',
          background: 'transparent',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          boxSizing: 'border-box',
          pointerEvents: 'auto'
        }}
      >
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'auto',
          maxWidth: '800px',
          maxHeight: '600px',
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