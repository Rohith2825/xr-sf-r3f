import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { useXR } from "@react-three/xr";
import gsap from "gsap";
import { useComponentStore } from "./stores/ZustandStores";

export const ProductGSAPUtil = ({ setAnimating, playerRef }) => {
  const { camera: defaultCamera } = useThree();
  const { player, isPresenting } = useXR();
  const { searchResult, initiateSearchGSAP, resetSearchGSAP } = useComponentStore();

  useEffect(() => {
    if (!initiateSearchGSAP || !searchResult || !playerRef.current) return;

    setAnimating(true);
    const targetPosition = {
      x: searchResult.x + 1.5,
      y: searchResult.y + 1.9,
      z: searchResult.z +3,
    };

    // Use XR camera if in VR, otherwise use default camera
    const camera = isPresenting && player?.camera ? player.camera : defaultCamera;

    const timeline = gsap.timeline({
      onComplete: () => {
        if (playerRef.current) {
          playerRef.current.setTranslation(targetPosition);
          playerRef.current.setLinvel({ x: 0, y: 0, z: 0 });
          playerRef.current.setAngvel({ x: 0, y: 0, z: 0 });
          setAnimating(false);
        }
        resetSearchGSAP();
      },
    });

    timeline.to(camera.rotation, {
      x: 0,
      y: 0,
      z: 0,
      duration: 1,
      ease: "power2.inOut",
    });

    timeline.to(camera.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 2,
      ease: "power2.inOut",
    });

    return () => {
      timeline.kill();
      setAnimating(false);
    };
  }, [initiateSearchGSAP, searchResult, playerRef, defaultCamera, resetSearchGSAP, setAnimating, player, isPresenting]);

  return null;
};