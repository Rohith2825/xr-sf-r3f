import { PivotControls } from "@react-three/drei";
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
}) => {
  const computedScale =
    typeof scale === "number" ? [scale, scale, scale] : scale;

  const computedRotation = rotation.map((deg) => (deg * Math.PI) / 180);

  const { openModal, setSelectedProduct, selectedProduct } =
    useProductStore();

  // const findProductById = (id) => {
  //   return products.find(
  //     (product) => product.node.id === `gid://shopify/Product/${id}`
  //   );
  // };

  return (
    <RigidBody type="fixed">
      <PivotControls
        anchor={[0, 0, 0]}
        scale={1}
        activeAxes={[false, false, false]}
      >
        <primitive
          object={model.scene}
          position={position}
          rotation={computedRotation}
          scale={computedScale}
          onClick={(e) => {
            openModal();
            setSelectedProduct(productId);
            console.log(selectedProduct);
          }}
          castShadow
          receiveShadow
        />
      </PivotControls>
    </RigidBody>
  );
};

export default DraggableMannequin;
