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
  isMobile = false,
  ...props
}, ref) => {
  const { viewport } = useThree();
  
  const pixelsToUnits = (pixels) => pixels / 100;
  
  // If mobile, swap width and height for portrait mode
  // and adjust the scale to maintain aspect ratio within viewport
  let widthInUnits, heightInUnits;
  if (isMobile) {
    // For mobile, we'll use a 9:16 aspect ratio
    const mobileWidth = 108;
    const mobileHeight = 192;
    
    widthInUnits = pixelsToUnits(mobileWidth);
    heightInUnits = pixelsToUnits(mobileHeight);
    
    // Default mobile constraints if none provided
    constraints = constraints || {
      video: {
        facingMode: "user",
        width: { ideal: mobileWidth },
        height: { ideal: mobileHeight },
        aspectRatio: 9/16
      }
    };
  } else {
    widthInUnits = pixelsToUnits(width);
    heightInUnits = pixelsToUnits(height);
  }

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