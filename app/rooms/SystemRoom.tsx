import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Text } from "@react-three/drei";
import * as THREE from "three";
import { EntranceWall } from "@/components/Corridor/EntranceWall";
import { ExitCollider, RoomEntranceCollider } from "@/components/Corridor/Collider";

/**
 * SYSTEMS ROOM
 *
 * A room focused on interconnected motion.
 * Gears rotate, nodes pulse, and connections react.
 */

export function SystemRoom({
                               rotation = [0, 0, 0] as [number, number, number],
                               position = [0, 0, 0] as [number, number, number],
                                    }) {
    const [entered, setEntered] = useState(false);

    return (
        <group position={position} rotation={rotation}>
            <color attach="background" args={["#04060a"]} />

            <ambientLight intensity={0.3} />
            <directionalLight position={[4, 6, 4]} intensity={1.4} />

            {!entered && (
                <RoomEntranceCollider onEnter={() => setEntered(true)} />
            )}

            {!entered && <EntranceWall color={"#5050ad"}/>}

            {/*<Floor />*/}
            <BackWall />
            <Title />

            <RotatingGear position={[-2, 1.5, -1]} speed={0.6} />
            <RotatingGear position={[2, 1.5, -1]} speed={-0.8} />
            <PulsingCore position={[0, 1.2, -1]} />
            <ConnectionBeams />

            {entered && (
                <ExitCollider onExit={() => setEntered(false)} />
            )}

            <Environment preset="warehouse" />
        </group>
    );
}

function BackWall() {
    return (
        <mesh position={[0, 2, -3]}>
            <planeGeometry args={[12, 6]} />
            <meshStandardMaterial color="#060a0f" />
        </mesh>
    );
}

function Title() {
    return (
        <Text
            position={[0, 3.2, -2.8]}
            fontSize={0.35}
            color="#88ccff"
            anchorX="center"
        >
            Systems Room
        </Text>
    );
}

function RotatingGear({ position, speed }) {
    const ref = useRef<THREE.Mesh | null>(null);

    useFrame((_, delta) => {
        if (!ref.current) return;
        ref.current.rotation.z += delta * speed;
    });

    return (
        <mesh ref={ref} position={position}>
            <torusGeometry args={[0.8, 0.2, 16, 32]} />
            <meshStandardMaterial color="#4fa3ff" metalness={0.7} roughness={0.3} />
        </mesh>
    );
}

function PulsingCore({ position }) {
    const ref = useRef<THREE.Mesh | null>(null);

    useFrame(({ clock }) => {
        if (!ref.current) return;
        const scale = 1 + Math.sin(clock.elapsedTime * 2) * 0.2;
        ref.current.scale.set(scale, scale, scale);
    });

    return (
        <mesh ref={ref} position={position}>
            <sphereGeometry args={[0.6, 32, 32]} />
            <meshStandardMaterial
                emissive="#00ffff"
                emissiveIntensity={1.5}
                color="#112233"
            />
        </mesh>
    );
}

function ConnectionBeams() {
    return (
        <group>
            <mesh position={[-1, 1.5, -1]} rotation={[0, 0, 0.4]}>
                <cylinderGeometry args={[0.05, 0.05, 2]} />
                <meshStandardMaterial emissive="#00ffff" emissiveIntensity={0.8} />
            </mesh>
            <mesh position={[1, 1.5, -1]} rotation={[0, 0, -0.4]}>
                <cylinderGeometry args={[0.05, 0.05, 2]} />
                <meshStandardMaterial emissive="#00ffff" emissiveIntensity={0.8} />
            </mesh>
        </group>
    );
}
