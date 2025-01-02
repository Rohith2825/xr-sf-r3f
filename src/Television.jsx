import React, { useEffect, useMemo } from 'react';
import { useVideoTexture } from '@react-three/drei';
import { useGLTFWithKTX2 } from './useGTLFwithKTX';

// Television component
export default function Television({
  videoPath,
  scale = [1, 1, 1],
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) {
  const { nodes, materials } = useGLTFWithKTX2('/models/tv_modified.glb');

  // Memoize nodes and materials to avoid unnecessary re-computations
  const memoizedNodes = useMemo(() => nodes, [nodes]);
  const memoizedMaterials = useMemo(() => materials, [materials]);

  // Load the video texture
  const videoTexture = useVideoTexture(videoPath, {
    crossOrigin: 'anonymous',
    loop: true,
    muted: true,
    playsInline: true,
  });

  // Correct the orientation of the texture
  useEffect(() => {
    if (videoTexture) {
      videoTexture.flipY = false;
    }
  }, [videoTexture]);

  // Memoize the computed rotation in radians
  const memoizedRotation = useMemo(
    () => rotation.map((r) => r * (Math.PI / 180)),
    [rotation]
  );

  return (
    <group
      dispose={null}
      scale={scale}
      position={position}
      rotation={memoizedRotation} // Use memoized rotation
    >
      <group
        position={[-0.577, 0.192, -0.479]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.004, 16, 9]}
      >
        {/* Monitor Screen with Video Texture */}
        <mesh
          castShadow
          receiveShadow
          geometry={memoizedNodes['monitor-screen'].geometry}
        >
          <meshBasicMaterial map={videoTexture} toneMapped={false} />
        </mesh>

        {/* TV Frame */}
        <mesh
          castShadow
          receiveShadow
          geometry={memoizedNodes.tv_frame.geometry}
          material={memoizedMaterials.phong15}
        />
      </group>
    </group>
  );
}

// useGLTF.preload('/models/tv_modified.glb');
