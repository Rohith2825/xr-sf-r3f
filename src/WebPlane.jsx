import React from 'react';
import { Html } from '@react-three/drei';

export default function WebPlane({
  scale = [1, 1, 1],
  position = [0, 0, 0],
  rotation = [0, 0, 0],
}) {
  const styles = {
    wrapper: {
      width: '960px',
      height: '540px',
      overflow: 'hidden',
      borderRadius: '8px',
      position: 'relative',
    },
    iframe: {
      width: '100%',
      height: '200%', // Ensures there is enough content to scroll
      border: 'none',
      position: 'absolute',
      top: '0',
      animation: 'scrolling 20s linear infinite', // Keyframes for scrolling
    },
    keyframes: `
      @keyframes scrolling {
        0% {
          transform: translateY(0);
        }
        100% {
          transform: translateY(-50%);
        }
      }
    `,
  };


  return (
    <group
      scale={scale}
      position={position}
      rotation={rotation.map((r) => r * (Math.PI / 180))} // Convert degrees to radians
    >
      {/* Plane geometry */}
      <mesh>
        <planeGeometry args={[1, 1]} /> {/* Adjust size as needed */}
        <meshBasicMaterial color="#000000" /> {/* Background material */}
        <Html
          className="web-content"
          rotation={[0, 0, 0]}
          position={[0, 0, 0.01]} // Slight offset to avoid z-fighting
          transform
          occlude
        >
          <div style={styles.wrapper}>
            <iframe
              src="https://strategyfox.in"
              style={styles.iframe}
              title="Strategy Fox Website"
            />
            {/* Inject keyframes */}
            <style>
              {styles.keyframes}
            </style>
          </div>
        </Html>
      </mesh>
    </group>
  );
}