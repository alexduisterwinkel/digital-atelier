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
    const fogOpacity = useRef(0.05);
    const { camera } = useThree();

    const FOG_START_Z = -20; // z1 → fog starts appearing
    const FOG_END_Z = -25;   // z2 → fog fully opaque
    const PLANE_SPACING = 2;
    const PLANE_COUNT = 8;

    useFrame(() => {
        const t = THREE.MathUtils.clamp(
            (FOG_START_Z - camera.position.z) /
            (FOG_START_Z - FOG_END_Z),
            0,
            1
        );

        const targetOpacity = THREE.MathUtils.lerp(0.02, 0.15, t);

        fogOpacity.current = THREE.MathUtils.lerp(
            fogOpacity.current,
            targetOpacity,
            0.05
        );
    });

    return (
        <>
            {[...Array(8)].map((_, i) => (
                // <mesh key={i} position={[0, 0, -5 - i * 2]}>
                <mesh key={i} position={[0, 0,
                    Math.min(
                    FOG_START_Z - i * PLANE_SPACING,
                    camera.position.z - i * PLANE_SPACING
                ),]}>
                    <planeGeometry args={[30, 30]} />
                    <meshBasicMaterial
                        transparent
                        opacity={fogOpacity.current * (1 - i / PLANE_COUNT)}
                        depthWrite={false}
                        color={new THREE.Color(0.9, 0.3, 0.15)} // RGB normalized 0-1
                        // color="#0b0b0f"
                    />
                </mesh>
            ))}
        </>
    );
}