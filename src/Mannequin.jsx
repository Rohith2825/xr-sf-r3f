import React, { useMemo } from "react";
import { PivotControls, Billboard, Image } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useComponentStore } from "./stores/ZustandStores";
import Swal from "sweetalert2";
import styles from "@/UI/UI.module.scss";
import { ProductService } from "./api/shopifyAPIService";

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
  const { openModal, setSelectedProduct, products, setProducts } = useComponentStore();

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

  // On clicking product
  const handleProductOpen = () => {
    // Check if products are loaded
    if(products && products.length > 0){
      setSelectedProduct(productId);
      openModal();
    }
    else{
      const fetchProducts = async () => {
        try {
          const response = await ProductService.getAllProducts();
          setProducts(response);
          
        } catch (err) {
          console.error(err);
        }
      };
      fetchProducts();
      
      Swal.fire({
        title: "Could Not Load Product",
        text: "The products couldn't be loaded. Please try again.",
        icon: "error",
        customClass: {
          title: styles.swalTitle,
          popup: styles.swalPopup
        }
      });
    }
  };

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
          onTouchStart={handleProductOpen}
          onClick={handleProductOpen}
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
            <Image url="/icons/Sale.png" transparent scale={[0.75, 0.25]} />
          </Billboard>
        )}
      </PivotControls>
    </RigidBody>
  );
};

export default DraggableMannequin;
