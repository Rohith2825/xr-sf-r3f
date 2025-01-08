import React, { Suspense, useMemo, useRef, useState } from "react";
import { PivotControls } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useGLTFWithKTX2 } from "./useGTLFwithKTX";
import { useProductStore } from "../store/productStore";
import { useFrame } from "@react-three/fiber";

const ChestBox = () => {
  const chestBoxData = [
    {
      position: [-22, -3.2, -63],
      scale: 1,
      rotation: [0, 90, 0],
      path: "/models/compressed_old_chest.glb",
      discountCode: "STRATEGYFOX10",
    },
    {
      position: [32, -4.2, -33],
      scale: 1,
      rotation: [0, -40, 0],
      path: "/models/compressed_old_chest1.glb",
      discountCode: "STRATEGYFOX15",
    },
    {
      position: [18, -4, -65],
      scale: 1,
      rotation: [0, -70, 0],
      path: "/models/compressed_old_chest2.glb",
      discountCode: "STRATEGYFOX20",
    },
  ];

  return (
    <Suspense fallback={null}>
      {chestBoxData.map((data, index) => (
        <ChestBoxWrapper
          key={index}
          position={data.position}
          scale={data.scale}
          rotation={data.rotation}
          path={data.path}
          discountCode={data.discountCode}
        />
      ))}
    </Suspense>
  );
};

const ChestBoxWrapper = ({ position, scale, rotation, path, discountCode }) => {
  const { scene } = useGLTFWithKTX2(path);

  return scene ? (
    <ChestBoxLoader
      position={position}
      scale={scale}
      rotation={rotation}
      model={{ scene }}
      discountCode={discountCode}
    />
  ) : null;
};

const ChestBoxLoader = ({ position, rotation, scale, model, discountCode }) => {
  const modelRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const { openDiscountModal, setDiscountCode } = useProductStore();

  // Wobble Effect: Only trigger useFrame when the model is hovered
  useFrame((state) => {
    if (isHovered && modelRef.current) {
      const time = state.clock.getElapsedTime(); // Total elapsed time in seconds
      modelRef.current.position.y = position[1] + Math.sin(time * 2) * 0.2; // Add wobble effect
    } else if (modelRef.current) {
      modelRef.current.position.y = position[1]; // Reset position when not hovered
    }
  });

  // Memoize scale
  const computedScale = useMemo(() => {
    return typeof scale === "number" ? [scale, scale, scale] : scale;
  }, [scale]);

  // Memoize rotation
  const computedRotation = useMemo(() => {
    return rotation.map((deg) => (deg * Math.PI) / 180);
  }, [rotation]);

  // Memoize the model.scene
  const memoizedModelScene = useMemo(() => model.scene, [model.scene]);

  return (
    <RigidBody type="fixed">
      <PivotControls
        anchor={[0, 0, 0]}
        scale={1}
        activeAxes={[false, false, false]}
      >
        <primitive
          ref={modelRef}
          object={memoizedModelScene}
          position={position}
          rotation={computedRotation}
          scale={computedScale}
          onPointerOver={() => setIsHovered(true)} // Enable wobble on hover
          onPointerOut={() => setIsHovered(false)} // Disable wobble on hover out
          onPointerDown={(e) => {
            openDiscountModal();
            setDiscountCode(discountCode);
          }}
          castShadow
          receiveShadow
        />
      </PivotControls>
    </RigidBody>
  );
};

export default ChestBox;
