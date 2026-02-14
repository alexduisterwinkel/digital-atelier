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

    const WALL_WIDTH = 12;
    const WALL_HEIGHT = 6;
    const WALL_DEPTH = 0.15;

    const DOOR_WIDTH = 3;
    const DOOR_HEIGHT = 4;

    const SIDE_WIDTH = (WALL_WIDTH - DOOR_WIDTH) / 2;
    const TOP_HEIGHT = WALL_HEIGHT - DOOR_HEIGHT;

    const wallColor = color;
    const doorColor = "#666666";

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

    return (
        <group position={[-0.4, -1, 3.1]}>
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
                    position={[DOOR_WIDTH / 2 - 1, DOOR_HEIGHT / 2, 0.11 -1.5]}
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

export function NormalWall({ color }: { color: string }) {
    const WALL_WIDTH = 6;
    const WALL_HEIGHT = 6;
    const WALL_DEPTH = 0.1;

    const wallColor = color;

    return (
        <group position={[-0.4, 2, 0.5]} rotation={[0,1.5,0]}>
            {/* LEFT SIDE */}
            <mesh position={[0,0,-5.8]}>
                <boxGeometry args={[WALL_WIDTH, WALL_HEIGHT, WALL_DEPTH]} />
                <meshStandardMaterial color={wallColor} />
            </mesh>

            {/* RIGHT SIDE */}
            <mesh position={[1,0,6.2]}>
                <boxGeometry args={[WALL_WIDTH, WALL_HEIGHT, WALL_DEPTH]} />
                <meshStandardMaterial color={wallColor} />
            </mesh>
        </group>
    );
}