import React, { forwardRef } from 'react';
import { WebcamVideoTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

const MirrorPoster = forwardRef(({
  width = 1920,
  height = 1080,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  constraints,
  transparent = true,
  flipHorizontal = true,
  ...props
}, ref) => {
  const { viewport } = useThree();
  
  const pixelsToUnits = (pixels) => pixels / 100;
  const widthInUnits = pixelsToUnits(width);
  const heightInUnits = pixelsToUnits(height);

  // Apply horizontal flip if needed
  const scale = [flipHorizontal ? -1 : 1, 1, 1];

  return (
    <group
      position={position}
      rotation={rotation.map((r) => r * (Math.PI / 180))}
      scale={scale}
    >
      <mesh>
        <planeGeometry args={[widthInUnits, heightInUnits]} />
        <WebcamVideoTexture 
          ref={ref}
          constraints={constraints}
        >
          {(texture) => (
            <meshBasicMaterial
              map={texture}
              transparent={transparent}
              {...props}
            />
          )}
        </WebcamVideoTexture>
      </mesh>
    </group>
  );
});

MirrorPoster.displayName = 'MirrorPoster';

export default MirrorPoster;