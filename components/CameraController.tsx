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
    const mode = useRef<"orbit" | "head" | "focus">("orbit");
    const entranceZ = useRef<number>(-6.5); // <- fixed entrance Z

    const isCorridor = pathname === "/corridor";
    const mouseTarget = useRef({ x: 0, y: 0 });

    const focusedRoomX = useRef<{
        x: number;
        z: number;
    } | null>(null);

    const lightRef = useRef<THREE.Group>(null);

    // --- room focus handlers ---
    useEffect(() => {
        (window as any).enterRoom = (x: number, z: number) => {
            focusedRoomX.current = { x, z };
        };

        (window as any).exitRoom = () => {
            console.log("inside exitroom")
            focusedRoomX.current = null;
        };
    }, []);

    // --- mouse tracking ---
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

    // --- initial camera position ---
    useEffect(() => {
        mode.current = "orbit";
    }, [camera]);

    // Listen to page scroll
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (isCorridor) return;
        const roomIndex = getRoomIndex(pathname);
        targetZ.current = rooms[roomIndex].position[2] + 5;
    }, [pathname, isCorridor]);

    useEffect(() => {
        if (isCorridor) return;

        gsap.to(camera.position, {
            x: 0,
            y: 0,
            duration: 1.2,
            ease: "power2.out",
        });
    }, [isCorridor]);

    // --- rotation order for head movement ---
    useEffect(() => {
        camera.rotation.order = "YXZ";
    }, [camera]);

    useFrame(() => {
        if (mode.current === "orbit") {

            const targetX = mouse.x * viewport.width * 0.5;
            const targetY = mouse.y * 0.3;

            camera.position.x = THREE.MathUtils.lerp(
                camera.position.x,
                targetX,
                0.05
            );

            camera.position.y = THREE.MathUtils.lerp(
                camera.position.y,
                targetY,
                0.05
            );

            camera.lookAt(
                camera.position.x * 0.2,
                0,
                camera.position.z - 5
            );
        }

        // 1. --- MOMENTUM WALKING ---
        console.log("camera mode: ", mode.current);
        if (focusedRoomX.current === null) {
            if(mode.current === "focus") {
                mode.current = "head";
            }
            const scrollDelta = scrollY - lastScrollY.current;
            lastScrollY.current = scrollY;

            // impulse from scroll
            velocity.current += scrollDelta * 0.0008;

            // damping
            velocity.current *= 0.92;

            // forward movement
            camera.position.z -= velocity.current;

            if (
                mode.current === "orbit" &&
                camera.position.z <= entranceZ.current
            ) {
                mode.current = "head";

                // Capture current orientation from the world matrix
                const currentQuat = camera.quaternion.clone(); // current rotation as quaternion
                camera.rotation.setFromQuaternion(currentQuat); // convert to Euler to continue with rotation
            }

            if (
                mode.current === "head" &&
                camera.position.z >= entranceZ.current
            ) {
                mode.current = "orbit";

                // Capture current orientation from the world matrix
                const currentQuat = camera.quaternion.clone(); // current rotation as quaternion
                camera.rotation.setFromQuaternion(currentQuat); // convert to Euler to continue with rotation
            }

            // prevent overshooting target room
            camera.position.z = Math.min(
                camera.position.z,
                targetZ.current
            );
        } else {
            //inside the room and no camera-mouse looking
            mode.current = "focus";
            const room = focusedRoomX.current;

            // center camera
            camera.position.x = THREE.MathUtils.lerp(
                camera.position.x,
                0,
                0.08
            );

            camera.position.y = THREE.MathUtils.lerp(
                camera.position.y,
                0,
                0.08
            );

            // move forward into room
            camera.position.z = THREE.MathUtils.lerp(
                camera.position.z,
                room.z + 2,
                0.06
            );

            // rotate toward room
            camera.lookAt(room.x, 0, room.z);
        }

        if (mode.current === "orbit") {

            console.log("camera mode orbit: ", mode.current);
            camera.lookAt(
                camera.position.x * 0.2,
                0,
                camera.position.z - 5
            );
        } else if(mode.current === "head") {
            console.log("camera mode head: ", mode.current);
            const MAX_YAW = Math.PI * 0.15;
            const MAX_PITCH = Math.PI * 0.1;

            const targetYaw = mouse.x * MAX_YAW;
            const targetPitch = mouse.y * MAX_PITCH;

            camera.rotation.y = THREE.MathUtils.lerp(
                camera.rotation.y,
                targetYaw * -1,
                0.2
            );

            camera.rotation.x = THREE.MathUtils.lerp(
                camera.rotation.x,
                targetPitch,
                0.2
            );
            camera.rotation.x = THREE.MathUtils.clamp(camera.rotation.x, -MAX_PITCH, MAX_PITCH);
        }

        // 5. light follows camera
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
}
