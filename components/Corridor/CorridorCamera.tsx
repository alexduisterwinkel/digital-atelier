"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export function CorridorCamera() {
    const { camera, mouse, viewport } = useThree();

    const scroll = useRef(0);
    const targetZ = useRef(6);

    useFrame(() => {
        // scroll progress
        scroll.current = window.scrollY * 0.01;

        targetZ.current = 6 - scroll.current;

        // forward movement
        camera.position.z = THREE.MathUtils.lerp(
            camera.position.z,
            targetZ.current,
            0.08
        );

        // cursor steering
        const targetX = mouse.x * viewport.width * 0.5;

        camera.position.x = THREE.MathUtils.lerp(
            camera.position.x,
            targetX,
            0.05
        );

        camera.lookAt(camera.position.x * 0.2, 0, camera.position.z - 5);
    });

    return null;
}
