import React, { useEffect } from 'react';
import { useGLTF, useVideoTexture } from '@react-three/drei';
import { useGLTFWithKTX2 } from './useGTLFwithKTX';


// Television component
export default function Television({
  videoPath,
  scale = [1, 1, 1],
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) {
  
  const { nodes, materials } = useGLTF('/models/tv_modified.glb');
  
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

  return (
    <group
      dispose={null}
      scale={scale}
      position={position}
      rotation={rotation.map((r) => r * (Math.PI / 180))} // Convert to radians
    >
      <group
        position={[-0.577, 0.192, -0.479]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.004, 16, 9]}
      >
        {/* Monitor Screen with Video Texture */}
        <mesh castShadow receiveShadow geometry={nodes['monitor-screen'].geometry}>
          <meshBasicMaterial map={videoTexture} toneMapped={false} />
        </mesh>

        {/* TV Frame */}
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.tv_frame.geometry}
          material={materials.phong15}
        />
      </group>
    </group>
  );
}

useGLTF.preload('/models/tv_modified.glb');
