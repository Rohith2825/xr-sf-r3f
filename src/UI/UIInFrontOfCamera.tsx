import { useThree, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
import { useXR } from '@react-three/xr';

const UIInFrontOfCamera = ({ children, distance = 2 }) => {
  const { camera: defaultCamera } = useThree();
  const { player, isPresenting } = useXR();
  const groupRef = useRef(null);

  // Temp objects to avoid allocations
  const worldPos = useRef(new THREE.Vector3());
  const worldQuat = useRef(new THREE.Quaternion());
  const gazeDir = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!groupRef.current) return;
    // Use XR camera if in VR, otherwise use default camera
    const camera = isPresenting && player?.camera ? player.camera : defaultCamera;

    // Get world position and quaternion from camera's world matrix
    camera.updateMatrixWorld();
    camera.getWorldPosition(worldPos.current);
    camera.getWorldQuaternion(worldQuat.current);

    // Get gaze direction in world space
    camera.getWorldDirection(gazeDir.current);

    // Place UI at camera position + gazeDir * distance
    groupRef.current.position.copy(worldPos.current).add(gazeDir.current.multiplyScalar(distance));
    groupRef.current.quaternion.copy(worldQuat.current);
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