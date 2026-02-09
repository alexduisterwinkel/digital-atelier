"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export function CorridorFog({
                                rooms,
                            }: {
    rooms: { position: [number, number, number]; color: string }[];
}) {
    const mesh = useRef<THREE.Mesh>(null);
    const { camera } = useThree();

    useFrame(() => {
        if (!mesh.current) return;

        let influenceColor = new THREE.Color("#0b0b0f");
        let totalInfluence = 0;

        rooms.forEach((room) => {
            const dz = Math.abs(camera.position.z - room.position[2]);

            const influence = THREE.MathUtils.clamp(
                1 - dz / 12,
                0,
                1
            );

            if (influence > 0) {
                const c = new THREE.Color(room.color);
                influenceColor.lerp(c, influence);
                totalInfluence += influence;
            }
        });

        const material =
            mesh.current.material as THREE.MeshBasicMaterial;

        material.color.lerp(influenceColor, 0.05);
    });

    return (
        <mesh position={[0, 0, -25]}>
            <sphereGeometry args={[8, 64, 64]} />
            <meshBasicMaterial
                color="#0b0b0f"
                transparent
                opacity={0.25}
                depthWrite={false}
            />
        </mesh>
    );
}