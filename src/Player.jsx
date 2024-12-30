import * as THREE from "three";
import * as RAPIER from "@dimforge/rapier3d-compat";
import { CapsuleCollider, RigidBody, useRapier } from "@react-three/rapier";
import { useRef, useState, useEffect } from "react";
import { usePersonControls } from "@/hooks.js";
import { useFrame, useThree } from "@react-three/fiber";

const MOVE_SPEED = 12;
const TOUCH_SENSITIVITY = {
    PORTRAIT: {
        x: 0.008, // Increased horizontal sensitivity in portrait
        y: 0.006  // Reduced vertical sensitivity in portrait
    },
    LANDSCAPE: {
        x: 0.008, // Reduced horizontal sensitivity in landscape
        y: 0.015  // Increased vertical sensitivity in landscape
    }
};

const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

const RESPAWN_HEIGHT = -5;
const START_POSITION = new THREE.Vector3(0, 5, -5);

export const Player = () => {
    const playerRef = useRef();
    const touchRef = useRef({ isDragging: false, previousTouch: null });
    const { forward, backward, left, right, jump } = usePersonControls();
    const [isMoving, setIsMoving] = useState(false);
    const [canJump, setCanJump] = useState(true);
    const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
    const { camera } = useThree();

    const rapier = useRapier();

    // Handle orientation changes
    useEffect(() => {
        const handleOrientationChange = () => {
            setIsPortrait(window.innerHeight > window.innerWidth);
        };

        window.addEventListener('resize', handleOrientationChange);
        
        // Check orientation on mount
        handleOrientationChange();

        return () => {
            window.removeEventListener('resize', handleOrientationChange);
        };
    }, []);

    useEffect(() => {
        const handleTouchStart = (e) => {
            e.preventDefault();
            touchRef.current.isDragging = true;
            touchRef.current.previousTouch = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
        };

        const handleTouchMove = (e) => {
            e.preventDefault();
            if (!touchRef.current.isDragging || !touchRef.current.previousTouch) return;

            const touch = e.touches[0];
            const deltaX = touch.clientX - touchRef.current.previousTouch.x;
            const deltaY = touch.clientY - touchRef.current.previousTouch.y;

            // Apply orientation-specific sensitivity
            const sensitivity = isPortrait ? TOUCH_SENSITIVITY.PORTRAIT : TOUCH_SENSITIVITY.LANDSCAPE;

            // Update camera euler rotation
            camera.rotation.order = 'YXZ'; // Important for FPS-style camera
            camera.rotation.y -= deltaX * sensitivity.x;
            camera.rotation.x = Math.max(
                -Math.PI / 2,
                Math.min(Math.PI / 2, camera.rotation.x - deltaY * sensitivity.y)
            );

            touchRef.current.previousTouch = {
                x: touch.clientX,
                y: touch.clientY
            };
        };

        const handleTouchEnd = (e) => {
            e.preventDefault();
            touchRef.current.isDragging = false;
            touchRef.current.previousTouch = null;
        };

        document.addEventListener('touchstart', handleTouchStart, { passive: false });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd, { passive: false });

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [camera, isPortrait]); // Added isPortrait to dependencies

    useFrame((state) => {
        if (!playerRef.current) return;

        // Check if player has fallen below respawn height
        const { y: playerY } = playerRef.current.translation(); // Renamed to playerY
        if (playerY < RESPAWN_HEIGHT) {
            respawnPlayer();
        }

        // Moving player
        const velocity = playerRef.current.linvel();

        frontVector.set(0, 0, backward - forward);
        sideVector.set(left - right, 0, 0);
        direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(MOVE_SPEED).applyEuler(state.camera.rotation);

        playerRef.current.wakeUp();
        playerRef.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z });

        // Jumping
        if (jump && canJump) {
            doJump();
            setCanJump(false); // Prevent jumping again until cooldown period is over

      // Re-enable jumping after a short cooldown period (e.g., 500ms)
      setTimeout(() => {
        setCanJump(true);
      }, 500);
    }

        // Moving camera
        const { x, y, z } = playerRef.current.translation();
        state.camera.position.set(x, y, z);

        setIsMoving(direction.length() > 0);

    });

    const doJump = () => {
        playerRef.current.setLinvel({x: 0, y: 5, z: 0});
    }

    const respawnPlayer = () => {
        playerRef.current.setTranslation(START_POSITION); // Reset position to start position
        playerRef.current.setLinvel({ x: 0, y: 0, z: 0 }); // Reset velocity to stop movement
    };
    //HeightModifcation just change CapsuleCollider Height
    return (
        <>
            <RigidBody colliders={false} mass={1} ref={playerRef} lockRotations>
                <mesh castShadow>
                    {/* <capsuleGeometry args={[0.5, 0.5]}/> */}
                    <CapsuleCollider args={[1.7, 0.5]} /> 
                </mesh>
            </RigidBody>
        </>
    );
}