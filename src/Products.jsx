import React, { Suspense } from "react";
import { useGLTFWithKTX2 } from "./useGTLFwithKTX";
import mannequinData from "./data/MannequinData";
import { useComponentStore } from "./stores/ZustandStores";
const LazyMannequin = React.lazy(() => import("./Mannequin"));

const Products = () => {
  const { products } = useComponentStore();

  const isLoading = products.length === 0;

  // Filter products to include only those with environmentModal as true
  const filteredProducts = isLoading
    ? mannequinData
    : products
        .filter((product) => product.environmentModal === true) // Filter for products with environmentModal === true
        .map((product) => ({
          id: product.id,
          position: product.position,
          scale: product.scale,
          sale: product.sale,
          modelPath: product.environmentModalUrl, // Use environmentModalUrl for modelPath
        }));

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
  if (!modelPath) {
    console.error(`Invalid modelPath for product ID: ${productId}`);
    return null;
  }

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
