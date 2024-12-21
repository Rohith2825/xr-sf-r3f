import * as THREE from "three";
import * as RAPIER from "@dimforge/rapier3d-compat";
import { CapsuleCollider, RigidBody, useRapier } from "@react-three/rapier";
import { useRef, useState } from "react";
import { usePersonControls } from "@/hooks.js";
import { useFrame } from "@react-three/fiber";

const MOVE_SPEED = 10;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

const RESPAWN_HEIGHT = -5; // The Y position threshold for respawning
const START_POSITION = new THREE.Vector3(0, 5, 0); // Example respawn position

export const Player = () => {
    const playerRef = useRef();
    const { forward, backward, left, right, jump } = usePersonControls();
    const [isMoving, setIsMoving] = useState(false);
    const [canJump, setCanJump] = useState(true);

    const rapier = useRapier();

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
            }, 500); // 500ms cooldown
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

    return (
        <>
            <RigidBody colliders={false} mass={1} ref={playerRef} lockRotations>
                <mesh castShadow>
                    <capsuleGeometry args={[0.5, 0.5]}/>
                    <CapsuleCollider args={[0.75, 0.5]} />
                </mesh>
            </RigidBody>
        </>
    );
}