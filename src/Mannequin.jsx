import React, { useMemo } from "react";
import { PivotControls } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useZustandStore } from "./stores/ZustandStores";

const DraggableMannequin = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  productId,
  modelPath,
  onClick,
  model,
}) => {
  const { openModal, setSelectedProduct } = useZustandStore();

  // const findProductById = (id) => {
  //   return products.find(
  //     (product) => product.node.id === `gid://shopify/Product/${id}`
  //   );
  // };

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
          onTouchStart={(e) => {
            setSelectedProduct(productId);
            openModal();
          }}
          onClick={(e) => {
            setSelectedProduct(productId);
            openModal();
          }}
          castShadow
          receiveShadow
        />
      </PivotControls>
    </RigidBody>
  );
};

export default DraggableMannequin;
