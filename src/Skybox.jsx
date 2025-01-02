import { useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

const Skybox = () => {
  const { scene } = useThree();

  // Use useMemo to cache the texture
  const texture = useMemo(() => {
    const loader = new THREE.CubeTextureLoader();
    // Optional: Add loading manager for progress tracking
    const loadingManager = new THREE.LoadingManager();
    loader.setPath("/textures/skybox/");

    return loader.load(
      [
        "px.webp", // right
        "nx.webp", // left
        "py.webp", // up
        "ny.webp", // down
        "pz.webp", // front
        "nz.webp", // back
      ],
      undefined, // onLoad callback
      undefined, // onProgress callback
      (error) => {
        console.error("Error loading skybox:", error);
      }
    );
  }, []);

  // Set up and cleanup using useEffect
  useEffect(() => {
    const originalBackground = scene.background;
    scene.background = texture;

    // Cleanup when component unmounts
    return () => {
      scene.background = originalBackground;
      texture.dispose();
    };
  }, [scene, texture]);

  return null;
};

export default Skybox;