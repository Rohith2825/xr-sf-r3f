import React from 'react';
import { useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import { useGLTFWithKTX2 } from './useGTLFwithKTX';

export function Ground() {
  const { nodes, materials } = useGLTF('/Castle28.glb');
  
  return (
    <RigidBody type="fixed" colliders="trimesh">
      <group position={[0, -4, 0]} dispose={null}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane_1.geometry}
          material={materials['Material.004']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane_2.geometry}
          material={materials['Material.002']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane_3.geometry}
          material={materials['Material.001']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Plane_4.geometry}
          material={materials['Material.003']}
        />
      </group>
    </RigidBody>
  );
}


useGLTF.preload('/Castle28.glb');
