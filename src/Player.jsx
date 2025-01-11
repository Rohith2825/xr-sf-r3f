import * as THREE from "three";
import * as RAPIER from "@dimforge/rapier3d-compat";
import { CapsuleCollider, RigidBody, useRapier } from "@react-three/rapier";
import { useRef, useState, useEffect } from "react";
import { usePersonControls } from "@/hooks.js";
import { useFrame, useThree } from "@react-three/fiber";
import nipplejs from "nipplejs";
import gsap from "gsap";
import { useComponentStore, useTouchStore } from "./stores/ZustandStores";
import { CameraController } from "./CameraController";

const MOVE_SPEED = 12;
const TOUCH_SENSITIVITY = {
  PORTRAIT: {
    x: 0.004, // Reduced horizontal sensitivity in landscape
    y: 0.004, // Reduced vertical sensitivity in portrait
  },
  LANDSCAPE: {
    x: 0.004, // Reduced horizontal sensitivity in landscape
    y: 0.004, // Increased vertical sensitivity in landscape
  },
};

const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

const RESPAWN_HEIGHT = -5;
const START_POSITION = new THREE.Vector3(0, 7, -5);

export const Player = () => {
  const playerRef = useRef();
  const touchRef = useRef({
    cameraTouch: null,
    previousCameraTouch: null,
  });
  const { forward, backward, left, right, jump } = usePersonControls();
  const [canJump, setCanJump] = useState(true);
  const [isAnimating, setAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|Opera Mini|Kindle|Silk|Mobile|Tablet|Touch/i.test(
      navigator.userAgent
    )
  );
  const [isPortrait, setIsPortrait] = useState(
    window.innerHeight > window.innerWidth
  );
  const { camera } = useThree();

  const rapier = useRapier();

  useEffect(() => {
    const handleOrientationChange = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    window.addEventListener("resize", handleOrientationChange);
    handleOrientationChange();

    return () => {
      window.removeEventListener("resize", handleOrientationChange);
    };
  }, []);

  useEffect(() => {
    if (!isMobile) return;

    // Initialize the joystick
    const joystickZone = document.createElement("div");
    joystickZone.id = "joystickZone";
    joystickZone.style.position = "absolute";
    joystickZone.style.bottom = "15vh"; // Adjust for visibility
    joystickZone.style.left = "13vw"; // Adjust for visibility
    joystickZone.style.width = "150px";
    joystickZone.style.height = "150px";
    joystickZone.style.zIndex = "3"; //Higher than UI wafer z index = 2
    joystickZone.style.pointerEvents = "all"; // Ensure interactions are captured
    document.body.appendChild(joystickZone);

    const JOYSTICK_SIZE = 130; // pixels
    const PORTRAIT_MARGIN = {
      bottom: 70, // pixels from edge
      left: 80,
    };
    const LANDSCAPE_MARGIN = {
      bottom: 80, // smaller bottom margin for landscape
      left: 120, // larger left margin for landscape
    };

    // Function to calculate position based on screen size and orientation
    const calculatePosition = () => {
      // Get current viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Determine if we're in landscape mode
      const isLandscape = viewportWidth > viewportHeight;

      // Use different margins based on orientation
      const margins = isLandscape ? LANDSCAPE_MARGIN : PORTRAIT_MARGIN;

      // Calculate position with orientation-specific adjustments
      const bottom = isLandscape
        ? Math.min(margins.bottom, viewportHeight * 0.45) // 15% in landscape
        : Math.min(margins.bottom, viewportHeight * 0.01); // 10% in portrait

      const left = isLandscape
        ? Math.min(margins.left, viewportWidth * 0.08) // 8% in landscape
        : Math.min(margins.left, viewportWidth * 0.12); // 12% in portrait

      return {
        bottom: `${bottom}px`,
        left: `${left}px`,
      };
    };

    const manager = nipplejs.create({
      zone: joystickZone,
      size: JOYSTICK_SIZE,
      mode: "static",
      // position: { bottom: "10vh", left: "12vw" },
      position: calculatePosition(),
      color: "black",
      dynamicPage: true,
    });

    const handleMove = (evt, data) => {
      if (!data) return;

      const { angle, distance } = data;
      const radian = angle.radian; // Align with THREE.js coordinate system
      const speed = (distance / 100) * MOVE_SPEED;

      direction.set(Math.cos(radian) * speed, 0, -Math.sin(radian) * speed * 2);
    };

    const handleEnd = () => {
      direction.set(0, 0, 0);
    };

    manager.on("move", handleMove);
    manager.on("end", handleEnd);

    return () => {
      manager.destroy();
      document.body.removeChild(joystickZone);
    };
  }, [isMobile]);

  const initialTourComplete = useRef(false);
  const { 
    isModalOpen, isCartOpen, isWishlistOpen, crosshairVisible ,
    isInfoModalOpen , isDiscountModalOpen , isSettingsModalOpen , isTermsModalOpen , isContactModalOpen
  } = useComponentStore();

  const { isTouchEnabled, enableTouch} = useTouchStore();

  //More pans
  // useEffect(() => {
  //   if (!playerRef.current || initialTourComplete.current) return;

  //   // Set initial position off-screen
  //   const startPosition = new THREE.Vector3(0, 15, -5);
  //   playerRef.current.setTranslation(startPosition);
  //   camera.position.copy(startPosition);

  //   // Define the camera tour path
  //   const tourTimeline = gsap.timeline({
  //     onComplete: () => {
  //       isTransitioning.current = true;

  //       // Create a smooth transition to spawn point
  //       const finalTimeline = gsap.timeline({
  //         onComplete: () => {
  //           initialTourComplete.current = true;
  //           isTransitioning.current = false;
  //           touchEnabler.current = true;
  //           setTouchEnabled();

  //           // Reset physics state after transition
  //           playerRef.current.setLinvel({ x: 0, y: 0, z: 0 });
  //           playerRef.current.setAngvel({ x: 0, y: 0, z: 0 });
  //         },
  //       });

  //       // First, smoothly move to a position above the spawn point
  //       finalTimeline
  //         .to(camera.position, {
  //           duration: 1.5,
  //           x: START_POSITION.x,
  //           y: START_POSITION.y + 3,
  //           z: START_POSITION.z,
  //           ease: "power2.inOut",
  //         })
  //         // Then smoothly descend to the exact spawn point
  //         .to(camera.position, {
  //           duration: 0.8,
  //           y: START_POSITION.y,
  //           ease: "power2.out",
  //         });
  //     },
  //   });

  //   // Create the tour sequence
  //   tourTimeline
  //     .to(camera.position, {
  //       duration: 2,
  //       x: -10,
  //       y: 12,
  //       z: -15,
  //       ease: "power1.inOut",
  //     })
  //     .to(
  //       camera.rotation,
  //       {
  //         duration: 1.5,
  //         y: Math.PI * 0.25, // Rotate to the left view
  //         ease: "power1.inOut",
  //       },
  //       "-=1.5"
  //     )
  //     .to(camera.position, {
  //       duration: 2,
  //       x: 5,
  //       y: 10,
  //       z: -10,
  //       ease: "power1.inOut",
  //     })
  //     .to(
  //       camera.rotation,
  //       {
  //         duration: 1.5,
  //         y: 0, // Return to center
  //         ease: "power1.inOut",
  //       },
  //       "-=1.5"
  //     )
  //     .to(camera.position, {
  //       duration: 2,
  //       x: 10,
  //       y: 12,
  //       z: -15,
  //       ease: "power1.inOut",
  //     })
  //     .to(
  //       camera.rotation,
  //       {
  //         duration: 1.5,
  //         y: -Math.PI * 0.25, // Rotate to the right view
  //         ease: "power1.inOut",
  //       },
  //       "-=1.5"
  //     )
  //     .to(camera.position, {
  //       duration: 2,
  //       x: 5,
  //       y: 10,
  //       z: -10,
  //       ease: "power1.inOut",
  //     })
  //     .to(
  //       camera.rotation,
  //       {
  //         duration: 1.5,
  //         y: 0, // Return to center
  //         ease: "power1.inOut",
  //       },
  //       "-=1.5"
  //     )
  //     .to(camera.position, {
  //       duration: 1.5,
  //       x: START_POSITION.x,
  //       y: START_POSITION.y,
  //       z: START_POSITION.z,
  //       ease: "power2.inOut",
  //     });

  //   // Improved physics body synchronization
  //   const updatePhysicsBody = () => {
  //     if (!playerRef.current) return;

  //     if (!initialTourComplete.current || isTransitioning.current) {
  //       playerRef.current.wakeUp();
  //       playerRef.current.setTranslation(camera.position);
  //       playerRef.current.setLinvel({ x: 0, y: 0, z: 0 });
  //     }
  //   };

  //   // Smoother animation frame callback
  //   let animationFrameId;
  //   const animationFrame = () => {
  //     updatePhysicsBody();
  //     if (!initialTourComplete.current || isTransitioning.current) {
  //       animationFrameId = requestAnimationFrame(animationFrame);
  //     }
  //   };
  //   animationFrame();

  //   return () => {
  //     tourTimeline.kill();
  //     if (animationFrameId) {
  //       cancelAnimationFrame(animationFrameId);
  //     }
  //   };
  // }, [camera]);
  useEffect(() => {
    if (!playerRef.current || initialTourComplete.current) return;
  
    // Set initial position off-screen
    const startPosition = new THREE.Vector3(-3, 55, 80);
    playerRef.current.setTranslation(startPosition);
    camera.position.copy(startPosition);
  
    // Single smooth transition to spawn point
    const timeline = gsap.timeline({
      onComplete: () => {
        initialTourComplete.current = true;
        enableTouch();
  
        // Reset physics state
        playerRef.current.setLinvel({ x: 0, y: 0, z: 0 });
        playerRef.current.setAngvel({ x: 0, y: 0, z: 0 });
      },
    });
  
    // Direct transition to spawn point
    timeline.to(camera.position, {
      duration: 3,
      x: START_POSITION.x,
      y: START_POSITION.y,
      z: START_POSITION.z,
      ease: "power2.inOut",
    });
  
    // Sync physics body during transition
    const updatePhysicsBody = () => {
      if (!playerRef.current || initialTourComplete.current) return;
      
      playerRef.current.wakeUp();
      playerRef.current.setTranslation(camera.position);
      playerRef.current.setLinvel({ x: 0, y: 0, z: 0 });
    };
  
    const animationFrameId = setInterval(updatePhysicsBody, 1000 / 60);
  
    return () => {
      timeline.kill();
      clearInterval(animationFrameId);
    };
  }, [camera]);

  useEffect(() => {
    const handleTouchStart = (e) => {
      if(!isTouchEnabled) return; // Return if touch is not enabled (during the GSAP load)
      if(isModalOpen || isCartOpen || isWishlistOpen || isInfoModalOpen || isDiscountModalOpen || isSettingsModalOpen || isTermsModalOpen || isContactModalOpen || !crosshairVisible) return; // Return if any one of the components is open

      if (e.target.closest("#joystickZone")) return;

      // Find the rightmost touch for camera control
      const touches = Array.from(e.touches);
      const rightmostTouch = touches.reduce((rightmost, touch) => {
        return !rightmost || touch.clientX > rightmost.clientX
          ? touch
          : rightmost;
      }, null);

      if (rightmostTouch) {
        touchRef.current.cameraTouch = rightmostTouch.identifier;
        touchRef.current.previousCameraTouch = {
          x: rightmostTouch.clientX,
          y: rightmostTouch.clientY,
        };
      }
    };

    const handleTouchMove = (e) => {
      //if (!touchRef.current.cameraTouch || !touchRef.current.previousCameraTouch) return;
      if(!isTouchEnabled) return; // Return if touch is not enabled (during the GSAP load)
      if(isModalOpen || isCartOpen || isWishlistOpen || isInfoModalOpen || isDiscountModalOpen || isSettingsModalOpen || isTermsModalOpen || isContactModalOpen || !crosshairVisible) return; // Return if any one of the components is open

      const touch = Array.from(e.touches).find(
        (t) => t.identifier === touchRef.current.cameraTouch
      );

      if (!touch) return;

      const deltaX = touch.clientX - touchRef.current.previousCameraTouch.x;
      const deltaY = touch.clientY - touchRef.current.previousCameraTouch.y;

      const sensitivity = TOUCH_SENSITIVITY.PORTRAIT;

      camera.rotation.order = "YXZ";
      camera.rotation.y -= deltaX * sensitivity.x;
      camera.rotation.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, camera.rotation.x - deltaY * sensitivity.y)
      );

      touchRef.current.previousCameraTouch = {
        x: touch.clientX,
        y: touch.clientY,
      };
    };

    const handleTouchEnd = (e) => {
      if(!isTouchEnabled) return; // Return if touch is not enabled (during the GSAP load)
      if(isModalOpen || isCartOpen || isWishlistOpen || isInfoModalOpen || isDiscountModalOpen || isSettingsModalOpen || isTermsModalOpen || isContactModalOpen || !crosshairVisible) return; // Return if any one of the components is open

      const remainingTouches = Array.from(e.touches);
      if (
        !remainingTouches.some(
          (t) => t.identifier === touchRef.current.cameraTouch
        )
      ) {
        touchRef.current.cameraTouch = null;
        touchRef.current.previousCameraTouch = null;
      }
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [camera, isPortrait, isTouchEnabled, isModalOpen, isCartOpen, isWishlistOpen, isInfoModalOpen,isDiscountModalOpen,isSettingsModalOpen,isTermsModalOpen,isContactModalOpen,crosshairVisible]);

  const combinedInput = new THREE.Vector3();
  const movementDirection = new THREE.Vector3();
  useFrame((state) => {
    if (!playerRef.current || isAnimating ) return;

    const { y: playerY } = playerRef.current.translation();
    if (playerY < RESPAWN_HEIGHT) {
      respawnPlayer();
    }

    // Only allow movement when no component is open
    if (!isModalOpen && !isInfoModalOpen && !isCartOpen && !isWishlistOpen && !isDiscountModalOpen && !isSettingsModalOpen && !isTermsModalOpen && !isContactModalOpen && crosshairVisible) {
      const velocity = playerRef.current.linvel();

      // Combine joystick and keyboard inputs
      frontVector.set(0, 0, backward - forward);
      sideVector.set(right - left, 0, 0);

      // Combine inputs into a single movement direction
      combinedInput
        .copy(frontVector)
        .add(sideVector)
        .add(direction)
        .normalize();

      // Apply camera's rotation to align movement with camera orientation
      movementDirection
        .copy(combinedInput)
        .applyQuaternion(state.camera.quaternion) // Rotate input by the camera's orientation
        .normalize()
        .multiplyScalar(MOVE_SPEED);

      // Set the player's velocity based on movement direction
      playerRef.current.wakeUp();
      playerRef.current.setLinvel({
        x: movementDirection.x,
        y: velocity.y,
        z: movementDirection.z,
      });

      if (jump && canJump) {
        doJump();
        setCanJump(false);
        setTimeout(() => setCanJump(true), 500);
      }
    }

    // Sync the camera's position with the player
    const { x, y, z } = playerRef.current.translation();
    const lerpFactor = 0.05; // Adjust this value to control the smoothness (smaller is smoother)
    state.camera.position.lerp({ x, y, z }, lerpFactor);
  });

  const doJump = () => {
    playerRef.current.setLinvel({ x: 0, y: 5, z: 0 });
  };

  // const respawnPlayer = () => {
  //   playerRef.current.setTranslation(START_POSITION);
  //   playerRef.current.setLinvel({ x: 0, y: 0, z: 0 });
  // };

  const respawnPlayer = () => {
    if (!initialTourComplete.current) return; // Don't respawn during initial tour

    playerRef.current.setTranslation(START_POSITION);
    playerRef.current.setLinvel({ x: 0, y: 0, z: 0 });
    playerRef.current.setAngvel({ x: 0, y: 0, z: 0 });
  };

  return (
    <RigidBody
      colliders={false}
      mass={1}
      ref={playerRef}
      lockRotations
      canSleep={false}
    >
      <CameraController setAnimating={setAnimating} playerRef={playerRef} />
      <mesh castShadow>
        <CapsuleCollider args={[1.2, 1]} />
      </mesh>
    </RigidBody>
  );
};

//canSleep={false} - Sleeping caused problem :(((())))
