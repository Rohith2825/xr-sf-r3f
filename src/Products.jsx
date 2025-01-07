import React, { Suspense } from "react";
import { useGLTFWithKTX2 } from "./useGTLFwithKTX";
const LazyMannequin = React.lazy(() => import("./Mannequin"));

// Your mannequin data
const mannequinData = [
  {
    id: 9688999952677,
    position: [2, -4, -77],
    modelPath: "/models/inter_elem1.glb",
    scale: 1.2,
    sale: true,
  },
  {
    id: 9689001328933,
    position: [4, -4, -77],
    modelPath: "/models/inter_elem2.glb",
    scale: 1.2,
    sale: true,
  },
  {
    id: 9658662519077,
    position: [6, -4, -77],
    modelPath: "/models/inter_elem.glb",
    scale: 1.2,
  },
  {
    id: 9658662682917,
    position: [0, -4, -77],
    modelPath: "/models/women.glb",
    scale: 0.35,
  },
  {
    id: 9729009615141,
    position: [-2, -4, -77],
    modelPath: "/models/final_women_gym.glb",
    scale: 0.22,
  },
  {
    id: 9729030488357,
    position: [-4, -4, -77],
    modelPath: "/models/final_sports.glb",
    scale: 0.35,
  },
  {
    id: 9729035632933,
    position: [-6, -4, -77],
    modelPath: "/models/finalblack_suit.glb",
    scale: 0.3,
  },
];

// The Products component

const Products = () => {
  return (
    <Suspense fallback={null}>
      {mannequinData.map((data, index) => (
        <ModelWrapper
          key={index}
          productId={data.id}
          modelPath={data.modelPath}
          position={data.position}
          scale={data.scale}
          sale={data.sale || false }
        />
      ))}
    </Suspense>
  );
};

// The ModelWrapper component
const ModelWrapper = ({ productId, modelPath, position, scale ,sale}) => {
  const { scene } = useGLTFWithKTX2(modelPath); // Use the custom hook to load the model

  return scene ? ( // Render LazyMannequin only if the model is loaded
    <LazyMannequin
      productId={productId}
      position={position}
      modelPath={modelPath}
      sale = {sale}
      scale={scale}
      model={{ scene }}
    />
  ) : null; // Don't render anything if the model isn't loaded yet
};

export default Products;
