import React, { useMemo } from "react";
import { PivotControls, Text3D, Center } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useProductStore } from "../store/productStore";

const DraggableMannequin = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  productId,
  modelPath,
  onClick,
  model,
  sale = false, // New sale prop
}) => {
  const { openModal, setSelectedProduct, selectedProduct } = useProductStore();

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

  // Font URL for the "SALE" text
  const fontUrl = "/fonts/Poppins_Regular.json"; // Replace with the correct path to your font JSON

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
            openModal();
            setSelectedProduct(productId);
            console.log(selectedProduct);
          }}
          onClick={(e) => {
            openModal();
            setSelectedProduct(productId);
            console.log(selectedProduct);
          }}
          castShadow
          receiveShadow
        />
        {/* Conditionally render the SALE text */}
        {sale && (
          <Center position={[0.35, 2.5, 0]}>
            <Text3D
              font={fontUrl}
              size={0.25}
              height={0.2}
              curveSegments={32}
              bevelEnabled
              bevelThickness={0.02}
              bevelSize={0.02}
              bevelSegments={4}
              position={position}
            >
              SALE
              <meshStandardMaterial color="red" />
            </Text3D>
          </Center>
        )}
      </PivotControls>
    </RigidBody>
  );
};

export default DraggableMannequin;
