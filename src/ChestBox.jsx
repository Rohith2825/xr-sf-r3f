import React, { Suspense, useMemo } from "react";
import { PivotControls } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useGLTFWithKTX2 } from "./useGTLFwithKTX";
import { useProductStore } from "../store/productStore";

const ChestBox = () => {
  const chestBoxData = [
    {
      position: [-22, -3.5, -63],
      scale: 1,
      rotation: [0, 90, 0],
      path: "/models/compressed_old_chest.glb",
      discountCode: "STRATEGYFOX10",
    },
    {
      position: [32, -4.5, -33],
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
  const { openDiscountModal, setDiscountCode } = useProductStore();
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
          object={memoizedModelScene}
          position={position}
          rotation={computedRotation}
          scale={computedScale}
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
