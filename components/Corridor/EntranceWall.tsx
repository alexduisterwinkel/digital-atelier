import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * WALL WITH OPENING DOOR
 */
export function EntranceWall({ color }: { color: string }) {
    const doorRef = useRef<THREE.Group | null>(null);
    const [opening, setOpening] = useState(false);
    const [visible, setVisible] = useState(true);

    const WALL_WIDTH = 8;
    const WALL_HEIGHT = 4;
    const WALL_DEPTH = 0.2;

    const DOOR_WIDTH = 1.5;
    const DOOR_HEIGHT = 3.5;

    const SIDE_WIDTH = (WALL_WIDTH - DOOR_WIDTH) / 2;
    const TOP_HEIGHT = WALL_HEIGHT - DOOR_HEIGHT;


    const openAngle = THREE.MathUtils.degToRad(70);
    useFrame(() => {
        if (!doorRef.current || !opening) return;


        doorRef.current.rotation.y = THREE.MathUtils.lerp(
            doorRef.current.rotation.y,
            openAngle,
            0.08
        );

        if (Math.abs(doorRef.current.rotation.y - openAngle) < 0.01) {
            setTimeout(() => setVisible(false), 200);
        }

    });
    if (!visible) return null;

    const wallColor = color;
    const doorColor = "#666666";

    return (
        <group position={[0, 0, 6]}>
            {/* LEFT WALL */}
            <mesh position={[-DOOR_WIDTH / 2 - SIDE_WIDTH / 2, WALL_HEIGHT / 2, 0]}>
                <boxGeometry args={[SIDE_WIDTH, WALL_HEIGHT, WALL_DEPTH]} />
                <meshStandardMaterial color={wallColor} />
            </mesh>

            {/* RIGHT WALL */}
            <mesh position={[DOOR_WIDTH / 2 + SIDE_WIDTH / 2, WALL_HEIGHT / 2, 0]}>
                <boxGeometry args={[SIDE_WIDTH, WALL_HEIGHT, WALL_DEPTH]} />
                <meshStandardMaterial color={wallColor} />
            </mesh>

            {/* TOP WALL */}
            <mesh position={[0, DOOR_HEIGHT + TOP_HEIGHT / 2, 0]}>
                <boxGeometry args={[DOOR_WIDTH, TOP_HEIGHT, WALL_DEPTH]} />
                <meshStandardMaterial color={wallColor} />
            </mesh>

            {/* DOOR (hinged left) */}
            <group ref={doorRef} position={[-DOOR_WIDTH / 2, 0, 0]}>
                <mesh
                    position={[DOOR_WIDTH / 2 - 0.5, DOOR_HEIGHT / 2, 0.11 -0.5]}
                    rotation={[0,openAngle, 0]}
                    onClick={() => setOpening(true)}
                >
                    <boxGeometry args={[DOOR_WIDTH, DOOR_HEIGHT, 0.08]} />
                    <meshStandardMaterial
                        color={doorColor}
                        metalness={0.2}
                        roughness={0.6}
                    />
                </mesh>
            </group>
        </group>
    );
}