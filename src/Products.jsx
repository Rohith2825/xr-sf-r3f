import React, { Suspense } from "react";
import { useGLTFWithKTX2 } from "./useGTLFwithKTX";
import mannequinData from "./data/MannequinData";
import { useComponentStore } from "./stores/ZustandStores";
const LazyMannequin = React.lazy(() => import("./Mannequin"));

const Products = () => {
  const { products } = useComponentStore();

  // Map through mannequinData and find matching product by id
  const filteredProducts =
    products.length > 0
      ? mannequinData.map((mannequin) => {
          // Find the matching product by id
          const product = products.find(
            (product) => product.id === mannequin.id
          );

          // If a matching product is found, update modelPath with environmentModal
          if (product) {
            return {
              ...mannequin,
              modelPath: product.environmentModal || mannequin.modelPath, // Update modelPath with environmentModal
              sale: product.sale || mannequin.sale, // Merge sale status
            };
          }
          return mannequin; // If no match, return original mannequin data
        })
      : mannequinData; // If products array is empty, fallback to mannequinData

  console.log("Mannequin Data:", mannequinData);
  console.log("Filtered Products Data:", filteredProducts);

  return (
    <Suspense fallback={null}>
      {filteredProducts.map((data, index) => (
        <ModelWrapper
          key={index}
          productId={data.id}
          modelPath={data.modelPath}
          position={data.position}
          scale={data.scale}
          sale={data.sale || false}
        />
      ))}
    </Suspense>
  );
};

const ModelWrapper = ({ productId, modelPath, position, scale, sale }) => {
  const { scene } = useGLTFWithKTX2(modelPath);

  return scene ? (
    <LazyMannequin
      productId={productId}
      position={position}
      modelPath={modelPath}
      sale={sale}
      scale={scale}
      model={{ scene }}
    />
  ) : null;
};

export default Products;
