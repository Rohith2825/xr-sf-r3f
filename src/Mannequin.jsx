import { PivotControls } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";


const DraggableMannequin = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0], 
  scale = 1,
  productId,
  modelPath,
  onClick,
  model,
}) => {
  const computedScale = typeof scale === "number" ? [scale, scale, scale] : scale;

  const computedRotation = rotation.map((deg) => (deg * Math.PI) / 180);


  return (
    <RigidBody type="fixed">
      <PivotControls anchor={[0, 0, 0]} scale={1} activeAxes={[false, false, false]}>
        <primitive
          object={model.scene}
          position={position}
          rotation={computedRotation} 
          scale={computedScale}
          onClick={(e) => onClick(productId)}
          castShadow
          receiveShadow
        />
      </PivotControls>
    </RigidBody>
  );
};

export default DraggableMannequin;
