import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useProductStore } from "../store/productStore";
import { useEffect } from "react";

export const CameraController = ({ setAnimating }) => {
  const { camera } = useThree();
  const { tourComplete } = useProductStore();

  useEffect(() => {
    if (tourComplete) {
      // Notify Player component to suspend camera sync
      setAnimating(true);

      // Animate the camera's position and rotation using GSAP
      gsap.to(camera.position, {
        x: 0, // target position
        y: 4,
        z: -65,
        duration: 5,
        ease: "power2.inOut",
      });

      gsap.to(camera.rotation, {
        x: -0.5, // target rotation in radians (e.g., look straight)
        y: 0, // rotate 45 degrees around the Y-axis
        z: 0, // no tilt
        duration: 5,
        ease: "power2.inOut",
        onComplete: () => {
          // Reset camera rotation to its default state
          gsap.to(camera.rotation, {
            x: 0, // Reset x rotation
            y: 0, // Reset y rotation
            z: 0, // Reset z rotation
            duration: 1,
            ease: "power2.inOut",
            onComplete: () => {
              // Notify Player component to resume camera sync
              setAnimating(false);

              // Reset tourComplete flag
              useProductStore.setState({ tourComplete: false });
            },
          });
        },
      });
    }
  }, [tourComplete, camera, setAnimating]);

  return null;
};
