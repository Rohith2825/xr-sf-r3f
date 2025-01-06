import React, { useMemo } from "react";
import { PivotControls , Billboard , Text} from "@react-three/drei";
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
  //console.log("Position prop in DraggableMannequin:", position);

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

    // Adjusted position for the SALE text (increase y by 2)
    const saleTextPosition = useMemo(() => {
      const [x, y, z] = position;
      return [x, y + 2.5, z];
    }, [position]);


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
   
          <Billboard
          follow={true}
          position={saleTextPosition}
          lockX={false}
          lockY={false}
          lockZ={false} // Lock the rotation on the z axis (default=false)
        >
          <Text fontSize={0.15} color={"#DC143C"} font="/fonts/SF-Pro-Display-Regular.woff" >SALE !</Text>
        </Billboard>
     
        )}
      </PivotControls>
    </RigidBody>
    
  );
};

export default DraggableMannequin;
