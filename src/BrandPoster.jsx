import React from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three';

export default function BrandPoster({
  imageUrl,
  width = 1920, 
  height = 1080, 
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) {
  const texture = useLoader(TextureLoader, imageUrl);
  const { viewport } = useThree();

  // Convert pixels to Three.js units
  // By default, 1 Three.js unit = 100 pixels
  const pixelsToUnits = (pixels) => pixels / 100;
  
  const widthInUnits = pixelsToUnits(width);
  const heightInUnits = pixelsToUnits(height);

  return (
    <group
      position={position}
      rotation={rotation.map((r) => r * (Math.PI / 180))} // Convert degrees to radians
    >
      <mesh>
        <planeGeometry args={[widthInUnits, heightInUnits]} />
        <meshBasicMaterial 
          map={texture}
          transparent={true}
        />
      </mesh>
    </group>
  );
}