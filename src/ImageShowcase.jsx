import React from "react";
import { Billboard, Image as DreiImage } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import Swal from "sweetalert2";
import styles from "@/UI/UI.module.scss";
import { useComponentStore } from "./stores/ZustandStores";
import { ProductService } from "./api/shopifyAPIService";

export default function Image({
  productId,
  url,
  width = 1920,
  height = 1080,
  position = [0, 0, 0],
  transparent = false,
  scale = [1, 1],
}) {
  const { openModal, setSelectedProduct, products, setProducts } =
    useComponentStore();

  // Convert pixels to Three.js world units
  const pixelsToUnits = (pixels) => pixels / 100;
  const widthInUnits = pixelsToUnits(width) * scale[0];
  const heightInUnits = pixelsToUnits(height) * scale[1];

  const handleEvent = (event) => {
    event.stopPropagation();

    if (products && products.length > 0) {
      setSelectedProduct(productId);
      openModal();
    } else {
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
          popup: styles.swalPopup,
        },
      });
    }
  };

  return (
    <RigidBody mass={1}>
      <Billboard
        position={position}
        follow={true}
        lockX={false}
        lockY={false}
        lockZ={false}
      >
        <DreiImage
          url={url}
          scale={[widthInUnits, heightInUnits, 1]}
          transparent={transparent}
          onClick={handleEvent}
        />
      </Billboard>
    </RigidBody>
  );
}
