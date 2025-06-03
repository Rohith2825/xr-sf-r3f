import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { Html, useProgress } from "@react-three/drei";
import { XR, createXRStore, useXR } from "@react-three/xr";
import App from "@/App.jsx";
import "@/index.scss";
import UI from "@/UI/UI.tsx";
import UIInFrontOfCamera from "@/UI/UIInFrontOfCamera";
import Load from "@/Loader.tsx";
import { ProductService } from "./api/shopifyAPIService";
import { useComponentStore } from "./stores/ZustandStores";

export const store = createXRStore();

function VRDetector() {
  const { isPresenting } = useXR();
  const { setVRMode } = useComponentStore();

  useEffect(() => {
    const checkVRSupport = async () => {
      if (navigator.xr) {
        const isSupported = await navigator.xr.isSessionSupported('immersive-vr');
        if (isSupported && !isPresenting) {
          store.enterVR();
        }
      }
    };

    checkVRSupport();
  }, [isPresenting]);

  return null;
}

function CanvasWrapper() {
  const { setProducts } = useComponentStore();
  const { progress } = useProgress();

  async function fetchProducts() {
    try {
      const response = await ProductService.getAllProducts();
      setProducts(response);
    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div id="container">
      <Canvas 
        camera={{ fov: 45 }} 
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
      >
        <XR store={store}>
          <VRDetector />
          <React.Suspense
            fallback={
              <Html center>
                <Load progress={progress} />
              </Html>
            }
          >
            <App />
            {progress >= 100 && (
              <UIInFrontOfCamera>
                <UI />
              </UIInFrontOfCamera>
            )}
          </React.Suspense>
        </XR>
      </Canvas>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CanvasWrapper />
  </React.StrictMode>
);
