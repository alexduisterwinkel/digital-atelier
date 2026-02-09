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
    const lastScrollY = useRef(0);
    const velocity = useRef(0);

    const isCorridor = pathname === "/corridor";
    const mouseTarget = useRef({ x: 0, y: 0 });

    const lightRef = useRef<THREE.Group>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseTarget.current.x =
                (e.clientX / window.innerWidth - 0.5) * 2;

            mouseTarget.current.y =
                (e.clientY / window.innerHeight - 0.5) * 2;
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () =>
            window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useEffect(() => {
        if (!isCorridor) return;

        gsap.to(camera.position, {
            x: 0,
            y: 0,
            duration: 1.2,
            ease: "power2.out",
        });
    }, [isCorridor]);

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

    useEffect(() => {
        if (!isCorridor) return;

        gsap.to(camera.position, {
            x: 0,
            y: 0,
            duration: 1.2,
            ease: "power2.out",
        });
    }, [isCorridor]);

    useFrame((state) => {
        // optional: subtle floating motion
        camera.position.y = Math.sin(Date.now() * 0.001) * 0.1;

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

        // --- MOMENTUM WALKING ---

        const scrollDelta = scrollY - lastScrollY.current;
        lastScrollY.current = scrollY;

        // add impulse from scroll
        velocity.current += scrollDelta * 0.0008;

        // damping (friction)
        velocity.current *= 0.92;

        // apply movement
        camera.position.z -= velocity.current;

        // prevent overshooting target room
        camera.position.z = Math.min(
            camera.position.z,
            targetZ.current
        );

        const mouseStrength = isCorridor ? 0.3 : 0.8;
        const invert = isCorridor ? -1 : 1;

        camera.position.x = THREE.MathUtils.lerp(
            camera.position.x,
            mouseTarget.current.x * mouseStrength * invert,
            0.05
        );

        camera.position.y +=
            (mouseTarget.current.y * mouseStrength -
                camera.position.y) *
            0.05;

        if (lightRef.current) {
            // keep light fixed relative to camera
            lightRef.current.position.set(
                camera.position.x,
                camera.position.y,
                camera.position.z - 2
            );
        }
    });

    return null;
    // return (
    //     <group ref={lightRef}>
    //         <pointLight intensity={3} distance={25} color="#ffffff" />
    //         <mesh>
    //             <sphereGeometry args={[0.2, 24, 24]} />
    //             <meshBasicMaterial color="#ffff89" />
    //         </mesh>
    //     </group>
    // );
}
