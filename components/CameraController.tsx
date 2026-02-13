"use client";

import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

type Mode = "orbit" | "head" | "focus";

export function CameraController() {
    const { camera, mouse, viewport } = useThree();

    const mode = useRef<Mode>("orbit");

    const scrollY = useRef(0);
    const lastScrollY = useRef(0);
    const velocity = useRef(0);

    const entranceZ = -6.5;

    // focus state
    const focusPosition = useRef<THREE.Vector3 | null>(null);
    const storedPose = useRef<{
        position: THREE.Vector3;
        quaternion: THREE.Quaternion;
    } | null>(null);

    const tmpVec = new THREE.Vector3();
    const tmpQuat = new THREE.Quaternion();

    const focusRotation = useRef<THREE.Quaternion | null>(null);

    /* ---------------------------------- */
    /* scroll listener */
    /* ---------------------------------- */
    useEffect(() => {
        const onScroll = () => {
            scrollY.current = window.scrollY;
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    /* ---------------------------------- */
    /* global room controls */
    /* ---------------------------------- */
    useEffect(() => {
        (window as any).enterRoom = (x, z, roomQuat) => {
            storedPose.current = {
                position: camera.position.clone(),
                quaternion: camera.quaternion.clone(),
            };

            // camera stands in front of room
            const forward = new THREE.Vector3(0, 0, -1)
                .applyQuaternion(roomQuat);

            focusPosition.current = new THREE.Vector3(
                x,
                0,
                z
            ).addScaledVector(forward, -5);

            // camera faces room head-on
            focusRotation.current = roomQuat.clone();

            mode.current = "focus";
        };

        (window as any).exitRoom = () => {
            if (!storedPose.current) return;
            mode.current = "head";
        };
    }, [camera]);

    /* ---------------------------------- */
    /* main loop */
    /* ---------------------------------- */
    useFrame(() => {
        /* ============================= */
        /* FOCUS MODE */
        /* ============================= */
        if (mode.current === "focus" && focusPosition.current) {
            // move toward focus position
            camera.position.lerp(focusPosition.current, 0.08);

            // rotate toward focus target
            camera.quaternion.slerp(focusRotation.current, 0.08);

            // freeze when close enough
            if (
                camera.position.distanceTo(focusPosition.current) < 0.01
            ) {
                camera.position.copy(focusPosition.current);
                camera.quaternion.copy(focusRotation.current);
            }

            return;
        }

        /* ============================= */
        /* RETURN FROM FOCUS */
        /* ============================= */
        if (mode.current === "head" && storedPose.current) {
            camera.position.lerp(storedPose.current.position, 0.08);
            camera.quaternion.slerp(storedPose.current.quaternion, 0.08);

            if (
                camera.position.distanceTo(storedPose.current.position) < 0.02
            ) {
                camera.position.copy(storedPose.current.position);
                camera.quaternion.copy(storedPose.current.quaternion);
                storedPose.current = null;
            }
        }

        /* ============================= */
        /* SCROLL MOMENTUM (unchanged) */
        /* ============================= */
        const scrollDelta = scrollY.current - lastScrollY.current;
        lastScrollY.current = scrollY.current;

        velocity.current += scrollDelta * 0.0008;
        velocity.current *= 0.92;
        camera.position.z -= velocity.current;

        /* ============================= */
        /* MODE SWITCH */
        /* ============================= */
        if (camera.position.z <= entranceZ) {
            if (mode.current === "orbit") mode.current = "head";
        } else {
            if (mode.current === "head") mode.current = "orbit";
        }

        /* ============================= */
        /* ORBIT MODE */
        /* ============================= */
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

            tmpVec.set(
                camera.position.x * 0.2,
                0,
                camera.position.z - 5
            );

            camera.lookAt(tmpVec);
        }

        /* ============================= */
        /* HEAD MODE */
        /* ============================= */
        if (mode.current === "head" && !storedPose.current) {
            const MAX_YAW = Math.PI * 0.15;
            const MAX_PITCH = Math.PI * 0.1;

            const yaw = mouse.x * MAX_YAW;
            const pitch = mouse.y * MAX_PITCH;

            tmpQuat.setFromEuler(
                new THREE.Euler(pitch, -yaw, 0, "YXZ")
            );

            camera.quaternion.slerp(tmpQuat, 0.2);
        }
    });

    return null;
}
