import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { Html, useProgress } from "@react-three/drei";
import { XR, createXRStore } from "@react-three/xr";
import App from "@/App.jsx";
import "@/index.scss";
import UI from "@/UI/UI.tsx";
import Load from "@/Loader.tsx";
import { ProductService } from "./api/shopifyAPIService";
import { useComponentStore } from "./stores/ZustandStores";

const store = createXRStore();

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
      {progress >= 100 && <UI />}
      <button onClick={() => store.enterVR()}>Enter AR</button>
      <Canvas camera={{ fov: 45 }} shadows>
        <XR store={store}>
          <React.Suspense
            fallback={
              <Html center>
                <Load progress={progress} />
              </Html>
            }
          >
            <App />
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
