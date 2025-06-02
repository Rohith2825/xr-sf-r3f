import { useThree, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

const UIInFrontOfCamera = ({ children, distance = 2 }) => {
  const { camera } = useThree();
  const groupRef = useRef(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    groupRef.current.position.copy(camera.position).add(dir.multiplyScalar(distance));
    groupRef.current.quaternion.copy(camera.quaternion);
  });

  return (
    <group ref={groupRef}>
      <Html fullscreen transform={false} pointerEvents="auto">
        {children}
      </Html>
    </group>
  );
};

export default UIInFrontOfCamera; 