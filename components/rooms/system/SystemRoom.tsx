import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Text } from "@react-three/drei";
import * as THREE from "three";
import { EntranceWall } from "@/components/Corridor/EntranceWall";

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
                <EntranceCollider onEnter={() => setEntered(true)} />
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

/**
 * INVISIBLE CLICK COLLIDER
 *
 * Clicking this moves the camera in front of the room
 * via CameraController.
 */
function EntranceCollider({
                                  onEnter,
                              }: {
    onEnter: () => void;
}) {
    return (
        <mesh
            position={[0, 1.2, 3]}
            onClick={(e) => {
                e.stopPropagation();

                if ((window as any).enterRoom) {
                    const worldPosition = new THREE.Vector3();
                    e.object.getWorldPosition(worldPosition);

                    (window as any).enterRoom(
                        worldPosition.x,
                        worldPosition.z
                    );
                }

                onEnter();
            }}
        >
            <boxGeometry args={[2.5, 2.5, 2]} />
            <meshBasicMaterial transparent opacity={0} />
        </mesh>
    );
}

/**
 * EXIT COLLIDER
 *
 * Invisible plane used to leave the room and return
 * to corridor navigation.
 */
function ExitCollider({ onExit }: { onExit: () => void }) {
    return (
        <mesh
            position={[0, 1.2, 4]}
            onClick={(e) => {
                e.stopPropagation();

                if ((window as any).exitRoom) {
                    (window as any).exitRoom();
                }

                onExit();
            }}
        >
            <planeGeometry args={[10, 6]} />
            <meshBasicMaterial transparent opacity={0} />
        </mesh>
    );
}

function Floor() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#0a0f14" roughness={0.9} />
        </mesh>
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
