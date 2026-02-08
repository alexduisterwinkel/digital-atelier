"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function RoomPreview({
                                position,
                                color,
                            }: {
    position: [number, number, number];
    color: string;
}) {
    const mesh = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!mesh.current) return;

        mesh.current.rotation.y += 0.003;

        mesh.current.position.y =
            Math.sin(state.clock.elapsedTime * 1.2) * 0.2;
    });

    return (
        <group position={position}>
            <pointLight intensity={5} distance={12} color={color} />

            <mesh ref={mesh}>
                <boxGeometry args={[1.5, 2, 1]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.9}
                />
            </mesh>
        </group>
    );
}
