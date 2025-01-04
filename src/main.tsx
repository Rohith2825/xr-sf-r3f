import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { Html, useProgress } from "@react-three/drei";
import App from "@/App.jsx";
import "@/index.scss";
import UI from "@/UI/UI.tsx";
import Load from "@/Loader.tsx";
import { ProductService } from "./api/shopifyAPIService";
import { useZustandStore } from "./stores/ZustandStores";

function CanvasWrapper() {
  const { setProducts } = useZustandStore();
  const { progress } = useProgress();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await ProductService.getAllProducts();
        setProducts(response);
        
      } catch (err) {
        console.error(err);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div id="container">
      {progress >= 100 && <UI />}
      <Canvas camera={{ fov: 45 }} shadows>
        <React.Suspense
          fallback={
            <Html center>
              <Load progress={progress} />
            </Html>
          }
        >
          <App />
        </React.Suspense>
      </Canvas>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CanvasWrapper />
  </React.StrictMode>
);
