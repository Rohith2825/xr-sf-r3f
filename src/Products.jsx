import React, { Suspense } from "react";
import { useGLTFWithKTX2 } from "./useGTLFwithKTX";
import mannequinData from "./data/MannequinData";
import { useComponentStore } from "./stores/ZustandStores";
import ImageShowcase from "./ImageShowcase";
import positionsData from "./data/positionsData";
const LazyMannequin = React.lazy(() => import("./Mannequin"));

const Products = () => {
  const { products } = useComponentStore();

  const isLoading = products.length === 0;

  // Filter products to include only those with environmentModal as true
  const filteredProducts = isLoading
    ? []
    : products
        .filter((product) => product.environmentModal === true) // Filter for products with environmentModal === true
        .map((product) => ({
          id: product.id,
          position: product.position,
          scale: product.scale,
          sale: product.sale,
          modelPath: product.environmentModalUrl, // Use environmentModalUrl for modelPath
          imagePath: product.images[1].src,
          predefinded: product.predefinded,
          placeholder: product.placeholder,
          environmentModal3D: product.environmentModal3D,
          environmentModalImage: product.environmentModalImage,
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
          imagePath={data.imagePath}
          position={data.position}
          scale={data.scale}
          sale={data.sale || false}
          predefinded={data.predefinded}
          environmentModal3D={data.environmentModal3D}
          environmentModalImage={data.environmentModalImage}
          placeholder={data.placeholder}
        />
      ))}
    </Suspense>
  );
};

const ModelWrapper = ({
  productId,
  modelPath,
  imagePath,
  position,
  scale,
  sale,
  environmentModal3D,
  environmentModalImage,
  placeholder,
  predefinded,
}) => {
  console.log("Position:", position);
  if (environmentModalImage && predefinded) {
    return (
      <ImageShowcase
        productId={productId}
        url={imagePath}
        position={positionsData[placeholder]}
        transparent={true}
        scale={[scale, scale]}
        width={1080}
        height={1080}
      />
    );
  }

  if (environmentModalImage && !predefinded) {
    return (
      <ImageShowcase
        productId={productId}
        url={imagePath}
        position={position}
        transparent={true}
        scale={[scale, scale]}
        width={1080}
        height={1080}
      />
    );
  }

  const { scene } = useGLTFWithKTX2(modelPath);

  return scene ? (
    environmentModal3D && predefinded ? (
      <LazyMannequin
        productId={productId}
        position={positionsData[placeholder]}
        modelPath={modelPath}
        sale={sale}
        scale={scale}
        model={{ scene }}
      />
    ) : (
      <LazyMannequin
        productId={productId}
        position={position}
        modelPath={modelPath}
        sale={sale}
        scale={scale}
        model={{ scene }}
      />
    )
  ) : null;
};

export default Products;
