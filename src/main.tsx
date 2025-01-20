import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";
import App from "@/App.jsx";
import "@/index.scss";
import UI from "@/UI/UI.tsx";
import { ProductService } from "./api/shopifyAPIService";
import { useComponentStore } from "./stores/ZustandStores";

function CanvasWrapper() {
  const { setProducts } = useComponentStore();
  const { progress } = useProgress();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);
  const [maxProgress, setMaxProgress] = useState(0); 
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

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

  useEffect(() => {
    const scrollY = window.scrollY;
    const joystickZone = document.getElementById("joystickZone");
  
    if (!(progress >= 100 && videoLoaded)) {
      if (joystickZone) {
        joystickZone.style.display = "none";
      }
  
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      if (joystickZone) {
        joystickZone.style.display = "block";
      }
  
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      window.scrollTo(0, scrollY);
    }
  
    return () => {
      if (joystickZone) {
        joystickZone.style.display = "block";
      }
  
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      window.scrollTo(0, scrollY);
    };
  }, [progress, videoLoaded]);

  useEffect(() => {
    // Update maxProgress only if progress exceeds the current maxProgress
    if (progress > maxProgress) {
      setMaxProgress(progress);
    }
  }, [progress]);
  

  return (
    <div id="container">
      {progress >= 100 && videoLoaded ? (
        <UI />
      ) : (
        <div className="video-loader">
          <video
            ref={videoRef}
            src={isMobile ? "/media/Intro.mp4" : "/media/Intro.MOV"}
            autoPlay
            muted
            playsInline
            onEnded={() => setVideoLoaded(true)} // Set videoLoaded to true when the video ends
          />
          {/* Show progress bar and text only after the video finishes */}
          {videoLoaded && (
            <>
              <div className="loading-text">Your experience is loading!</div>
              <div className="progress-bar">
                <div
                  className="progress-bar-inner"
                  style={{ width: `${Math.min(maxProgress, 100)}%` }}
                />
              </div>
            </>
          )}
        </div>
      )}
      <Canvas camera={{ fov: 45 }} shadows>
        <React.Suspense fallback={null}>
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
