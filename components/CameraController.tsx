"use client";

import { usePathname } from "next/navigation";
import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useState, useRef } from "react";
import { rooms } from "@/lib/roomsConfig";
import { getRoomIndex } from "@/lib/routeMapper";
import gsap from "gsap";
import * as THREE from "three";

export function CameraController() {
    const pathname = usePathname();
    const { camera, mouse, viewport } = useThree();
    const targetZ = useRef(camera.position.z);
    const [scrollY, setScrollY] = useState(0);

    // --- entrance timing  ---
    const startTime = useRef(0);
    const entranceFinished = useRef(false);
    

    // Listen to page scroll
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const roomIndex = getRoomIndex(pathname);
        targetZ.current = rooms[roomIndex].position[2] + 5;

        gsap.to(camera.position, {
            z: targetZ.current,
            duration: 1.5,
            ease: "power2.inOut",
        });
    }, [pathname, camera]);

    useFrame(() => {
        // optional: subtle floating motion
        camera.position.y = Math.sin(Date.now() * 0.001) * 0.1;

        // scroll-driven forward movement
        const scrollFactor = 0.01; // tweak speed
        const scrollZ = 5 - scrollY * scrollFactor; // moves toward negative Z
        camera.position.z = Math.min(scrollZ, targetZ.current); // don’t overshoot GSAP target

        // Room transition trigger: entrance → corridor
        if (scrollZ <= rooms[1].position[2] + 5 && pathname === "/") {
            window.history.replaceState(null, "", "/corridor");
        }
    });

    useFrame((state) => {
        // --- ENTRANCE CHOREOGRAPHY  ---
        if (!startTime.current) {
            startTime.current = state.clock.elapsedTime;
        }

        const t = state.clock.elapsedTime - startTime.current;

        if (t < 3) {
            const progress = t / 3;
            const ease = 1 - Math.pow(1 - progress, 3);

            camera.position.z = 6 - ease * 1.3;
        } else {
            entranceFinished.current = true;
        }

        // optional: subtle floating motion
        camera.position.y = Math.sin(Date.now() * 0.001) * 0.1;

        // --- SCROLL MOVEMENT  ---
        if (entranceFinished.current) {
            const scrollFactor = 0.01;
            const scrollZ = 5 - scrollY * scrollFactor;

            camera.position.z = Math.min(
                THREE.MathUtils.lerp(
                    camera.position.z,
                    scrollZ,
                    0.08
                ),
                targetZ.current
            );

            // Room transition trigger: entrance → corridor
            if (
                scrollZ <= rooms[1].position[2] + 5 &&
                pathname === "/"
            ) {
                window.history.replaceState(null, "", "/corridor");
            }
        }

        // --- CURSOR STEERING (ADDED) ---
        const targetX = mouse.x * viewport.width * 0.5;

        camera.position.x = THREE.MathUtils.lerp(
            camera.position.x,
            targetX,
            0.05
        );

        camera.lookAt(
            camera.position.x * 0.2,
            0,
            camera.position.z - 5
        );
    });

    return null;
}
