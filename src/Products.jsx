import React, { Suspense } from "react";
import { useGLTFWithKTX2 } from "./useGTLFwithKTX";
const LazyMannequin = React.lazy(() => import("./Mannequin"));

// Your mannequin data
const mannequinData = [
  {
    id: 9658662584613,
    position: [2, -4, -77],
    modelPath: "/models/inter_elem1.glb",
    scale: 1.2,
  },
  {
    id: 9689001328933,
    position: [4, -4, -77],
    modelPath: "/models/inter_elem2.glb",
    scale: 1.2,
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
    id: 9658662813989,
    position: [-2, -4, -77],
    modelPath: "/models/final_women_gym.glb",
    scale: 0.22,
  },
  {
    id: 9689001328933,
    position: [-4, -4, -77],
    modelPath: "/models/final_sports.glb",
    scale: 0.35,
  },
  {
    id: 9658661732645,
    position: [-6, -4, -77],
    modelPath: "/models/finalblack_suit.glb",
    scale: 0.3,
  },
  // { id: 9658662060325, position: [45.76, -11.05, 40.64], modelPath: "/models/final_girl.glb", scale: 0.25 },
  // { id: 9658662060325, position: [-21.19, -3, 7.86], modelPath: "/models/finalblack_suit.glb", scale: 0.3 },
  // { id: 9658662060325, position: [-17.57, -4.8, 33.33], modelPath: "/models/final_women_gym.glb", scale: 0.22 },
  // { id: 9658662060325, position: [23.78, -4, 38.54], modelPath: "/models/final_sports.glb", scale: 0.35 },
  // { id: 9658662060325, position: [0.44, -4, 20.13], modelPath: "/models/final_women_top.glb", scale: 0.25 },
  // { id: 9658662060325, position: [9.99, -4, 8.13], modelPath: "/models/final_hoodie.glb", scale: 0.36 },
  // { id: 9658662060325, position: [23.47, -4, 5.4], modelPath: "/models/final_studio_men.glb", scale: 0.25 },
];

// The Products component

const Products = () => {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      {mannequinData.map((data, index) => (
        <ModelWrapper
          key={index}
          productId={data.id}
          modelPath={data.modelPath}
          position={data.position}
          scale={data.scale}
        />
      ))}
    </Suspense>
  );
};

// The ModelWrapper component
const ModelWrapper = ({ productId, modelPath, position, scale}) => {
  const { scene } = useGLTFWithKTX2(modelPath); // Use the custom hook to load the model

  return scene ? ( // Render LazyMannequin only if the model is loaded
    <LazyMannequin
      productId={productId}
      position={position}
      modelPath={modelPath}
      scale={scale}
      model={{ scene }}
    />
  ) : null; // Don't render anything if the model isn't loaded yet
};

// A simple loading indicator
const LoadingIndicator = () => {
  return (
    <group>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="lightblue" />
      </mesh>
    </group>
  );
};

export default Products;
