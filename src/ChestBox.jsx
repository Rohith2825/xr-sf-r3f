import React, { useMemo } from "react";
import { PivotControls } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useGLTFWithKTX2 } from "./useGTLFwithKTX";

const ChestBox = () => {
  const { scene } = useGLTFWithKTX2("/models/old_chest.glb");
  return <ChestBoxLoader position={[8, -4, -77]} scale={1} model={{ scene }} />;
};

const ChestBoxLoader = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  model,
}) => {
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
            console.log("Chest Box clicked");
          }}
          castShadow
          receiveShadow
        />
      </PivotControls>
    </RigidBody>
  );
};

export default ChestBox;
