"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export function RoomPreview({
                                position,
                                color,
                            }: {
    position: [number, number, number];
    color: string;
}) {
    const mesh = useRef<THREE.Mesh>(null);
    const light = useRef<THREE.PointLight>(null);

    const { camera } = useThree();

    useFrame((state) => {
        if (!mesh.current || !light.current) return;

        const roomZ = position[2];
        const distance = Math.abs(camera.position.z - roomZ);

        // visibility range
        const appearStart = 15;
        const appearFull = 6;

        const visibility = THREE.MathUtils.clamp(
            1 - (distance - appearFull) / (appearStart - appearFull),
            0,
            1
        );

        mesh.current.rotation.y += 0.003;

        mesh.current.position.y =
            Math.sin(state.clock.elapsedTime * 1.2) * 0.2;

        // emerge from fog
        mesh.current.scale.setScalar(0.6 + visibility * 0.4);

        const material =
            mesh.current.material as THREE.MeshBasicMaterial;

        material.opacity = visibility;

        light.current.intensity = visibility * 5;
    });

    return (
        <group position={position}>
            <pointLight ref={light} intensity={0} distance={12} color={color} />

            <mesh ref={mesh}
                onClick={(e) => {
                e.stopPropagation();

                if ((window as any).enterRoom) {
                    (window as any).enterRoom(position[0]);
                }
            }}>
                //size of the rooms
                <boxGeometry args={[1.5, 2, 1]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0}
                />
            </mesh>
        </group>
    );
}
