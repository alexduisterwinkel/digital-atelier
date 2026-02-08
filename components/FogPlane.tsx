"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function FogPlane({
                             index,
                             progress,
                             lightPosition,
                         }: {
    index: number;
    progress: number;
    lightPosition: THREE.Vector3;
}) {
    const mesh = useRef<THREE.Mesh>(null);

    // deeper planes move slower
    const depth = -6 - index * 2;
    const parallaxStrength = 1 - index * 0.25;

    const worldPos = new THREE.Vector3();
    const lightPos = new THREE.Vector3();

    useFrame((state) => {
        if (!mesh.current) return;

        const ease = 1 - Math.pow(1 - progress, 3);
        const time = state.clock.elapsedTime;

        // move backward as camera advances
        mesh.current.position.z = depth - ease * (2 + index * 0.5);

        // parallax drift (near fog moves more)
        mesh.current.position.x =
            Math.sin(time * 0.25 + index) *
            0.4 *
            parallaxStrength;

        mesh.current.position.y =
            Math.cos(time * 0.18 + index) *
            0.25 *
            parallaxStrength;

        // rotation settles as entrance completes
        mesh.current.rotation.z =
            0.15 * (index + 1) * (1 - ease);

        // slight scale growth prevents edge reveal
        const scale = 1 + ease * 0.15;
        mesh.current.scale.set(scale, scale, 1);

        // --- LIGHT PENETRATION ---
        mesh.current.getWorldPosition(worldPos);
        lightPos.copy(lightPosition)

        const distanceToLight = worldPos.distanceTo(lightPos);

        // fog clears near light
        const lightClear = THREE.MathUtils.clamp(
            1 - distanceToLight / 7,
            0,
            1
        );

        // fog thickens slightly behind light
        const behindLight =
            worldPos.z > lightPos.z ? 1 : 0;

        const densityBoost = behindLight * 0.25 * (1 - lightClear);

        // fade slightly toward end
        const material = mesh.current.material as THREE.MeshBasicMaterial;
        material.opacity =
            (0.35 * (1 - ease * 0.5)) *
            (1 - densityBoost * 0.6);
    });

    return (
        <mesh ref={mesh}>
            <planeGeometry args={[20, 20]} />
            <meshBasicMaterial
                color="#1a2a44"
                transparent
                opacity={0.35}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </mesh>
    );
}
