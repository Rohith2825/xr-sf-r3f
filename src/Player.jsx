import * as THREE from "three";
import * as RAPIER from "@dimforge/rapier3d-compat";
import { CapsuleCollider, RigidBody, useRapier } from "@react-three/rapier";
import { useRef, useState, useEffect } from "react";
import { usePersonControls } from "@/hooks.js";
import { useFrame, useThree } from "@react-three/fiber";
import nipplejs from "nipplejs";

const MOVE_SPEED = 12;
const TOUCH_SENSITIVITY = {
    PORTRAIT: {
      x: 0.002, // Reduced horizontal sensitivity in landscape
      y: 0.002  // Reduced vertical sensitivity in portrait
    },
    LANDSCAPE: {
        x: 0.002, // Reduced horizontal sensitivity in landscape
        y: 0.002  // Increased vertical sensitivity in landscape
    }
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
    previousCameraTouch: null
  });
  const { forward, backward, left, right, jump } = usePersonControls();
  const [canJump, setCanJump] = useState(true);
  const [isMobile, setIsMobile] = useState(
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone|Opera Mini|Kindle|Silk|Mobile|Tablet|Touch/i.test(
      navigator.userAgent
    )
  );
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
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
    joystickZone.style.zIndex = "5";
    joystickZone.style.pointerEvents = "all"; // Ensure interactions are captured
    document.body.appendChild(joystickZone);

    const manager = nipplejs.create({
      zone: joystickZone,
      size: 130,
      mode: "semi",
      multitouch: true,
      color: "black",
    });

    const handleMove = (evt, data) => {
      if (!data) return;

      const { angle, distance } = data;
      const radian = angle.radian ; // Align with THREE.js coordinate system
      const speed = (distance / 100) * MOVE_SPEED;

      direction.set(
        Math.cos(radian) * speed,
        0,
        -Math.sin(radian) * speed * 2
      );
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

    // Ensure the player is respawned when the component is mounted
    useEffect(() => {
      if (playerRef.current) {
        // Delay slightly to ensure physics world is initialized
        setTimeout(() => {
          respawnPlayer();
        }, 100);
      }
    }, []);

  useEffect(() => {
    const handleTouchStart = (e) => {
      if (e.target.closest("#joystickZone")) return;
      
      // Find the rightmost touch for camera control
      const touches = Array.from(e.touches);
      const rightmostTouch = touches.reduce((rightmost, touch) => {
        return (!rightmost || touch.clientX > rightmost.clientX) ? touch : rightmost;
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

      const touch = Array.from(e.touches).find(
        t => t.identifier === touchRef.current.cameraTouch
      );

      if (!touch) return;

      const deltaX = touch.clientX - touchRef.current.previousCameraTouch.x;
      const deltaY = touch.clientY - touchRef.current.previousCameraTouch.y;

      const sensitivity = TOUCH_SENSITIVITY.PORTRAIT ;

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
      const remainingTouches = Array.from(e.touches);
      if (!remainingTouches.some(t => t.identifier === touchRef.current.cameraTouch)) {
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
  }, [camera, isPortrait]);

  useFrame((state) => {
    if (!playerRef.current) return;
  
    const { y: playerY } = playerRef.current.translation();
    if (playerY < RESPAWN_HEIGHT) {
      respawnPlayer();
    }
  
    const velocity = playerRef.current.linvel();
  
    // Combine joystick and keyboard inputs
    frontVector.set(0, 0, backward - forward);
    sideVector.set(right - left, 0, 0);
  
    // Combine inputs into a single movement direction
    const combinedInput = new THREE.Vector3()
      .add(frontVector)
      .add(sideVector)
      .add(direction) // Add joystick input
      .normalize();
  
    // Apply camera's rotation to align movement with camera orientation
    const movementDirection = new THREE.Vector3()
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
  
    // Sync the camera's position with the player
    const { x, y, z } = playerRef.current.translation();
    state.camera.position.set(x, y, z);
  });
  

  const doJump = () => {
    playerRef.current.setLinvel({ x: 0, y: 5, z: 0 });
  };

  const respawnPlayer = () => {
    playerRef.current.setTranslation(START_POSITION);
    playerRef.current.setLinvel({ x: 0, y: 0, z: 0 });
  };

  return (
    <RigidBody colliders={false} mass={1} ref={playerRef} lockRotations canSleep={false}>
      <mesh castShadow>
        <CapsuleCollider args={[1.7, 1]} />
      </mesh>
    </RigidBody>
  );
};

//canSleep={false} - Sleeping caused problem :(((())))