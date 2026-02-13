import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Text, Float } from "@react-three/drei";
import * as THREE from "three";
import { EntranceWall, NormalWall } from "@/components/Corridor/EntranceWall";
import { ExitCollider, RoomEntranceCollider } from "@/components/Corridor/Collider";

/**
 * STORY ROOM
 *
 * A room about narrative and presentation.
 * Elements appear sequentially and react subtly to presence.
 */

export function StoryRoom({
                                      position = [0, 0, 0] as [number, number, number],
                              rotation = [0, 0, 0] as [number, number, number],
                                  }) {
    const [entered, setEntered] = useState(false);

    return (
        <group position={position} rotation={rotation}>
            <color attach="background" args={["#060407"]} />

            <ambientLight intensity={0.35} />
            <directionalLight position={[3, 5, 4]} intensity={1.1} />

            {!entered && (
                <RoomEntranceCollider onEnter={() => setEntered(true)} />
            )}

            {!entered && <EntranceWall color={"#549e52"}/>}

            <NormalWall color={"orange"} />

            {/*<Floor />*/}
            <BackWall />
            <Title />

            <FloatingPanel
                position={[-2.5, 1.6, -1.5]}
                title="Concept"
                text="Ideas begin as sketches. Structure gives them direction."
                delay={0}
            />

            <FloatingPanel
                position={[0, 1.6, -1.2]}
                title="Process"
                text="Iteration shapes clarity. Systems emerge through refinement."
                delay={0.4}
            />

            <FloatingPanel
                position={[2.5, 1.6, -1.5]}
                title="Outcome"
                text="Experience is where technology disappears into feeling."
                delay={0.8}
            />

            <CentralArtifact position={[0, 1.2, -2]} />

            {entered && (
                <ExitCollider onExit={() => setEntered(false)} />
            )}

            <Environment preset="studio" />
        </group>
    );
}

function BackWall() {
    return (
        <mesh position={[-0.4, 2, -3]}>
            <planeGeometry args={[12, 6]} />
            <meshStandardMaterial color="#140b12" />
        </mesh>
    );
}

function Title() {
    return (
        <Text
            position={[0, 3.2, -2.8]}
            fontSize={0.35}
            color="#ff99cc"
            anchorX="center"
        >
            Story Room
        </Text>
    );
}

function FloatingPanel({ position, title, text, delay }) {
    const group = useRef<THREE.Group | null>(null);
    const startTime = useRef<number | null>(null);

    useFrame(({ clock }) => {
        if (!group.current) return;

        if (startTime.current === null) {
            startTime.current = clock.elapsedTime;
        }

        const t = clock.elapsedTime - startTime.current - delay;
        const visibility = THREE.MathUtils.clamp(t * 1.5, 0, 1);

        group.current.position.y =
            position[1] + Math.sin(clock.elapsedTime * 1.5) * 0.05;

        group.current.scale.setScalar(visibility);
    });

    return (
        <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
            <group ref={group} position={position}>
                <mesh>
                    <planeGeometry args={[2.4, 1.4]} />
                    <meshStandardMaterial color="#22131f" />
                </mesh>

                <Text
                    position={[0, 0.3, 0.02]}
                    fontSize={0.18}
                    anchorX="center"
                >
                    {title}
                </Text>

                <Text
                    position={[0, -0.2, 0.02]}
                    fontSize={0.12}
                    maxWidth={2}
                    anchorX="center"
                >
                    {text}
                </Text>
            </group>
        </Float>
    );
}

function CentralArtifact({ position }) {
    const ref = useRef<THREE.Mesh | null>(null);

    useFrame(({ clock }) => {
        if (!ref.current) return;

        ref.current.rotation.y += 0.003;
        ref.current.position.y =
            position[1] + Math.sin(clock.elapsedTime * 2) * 0.15;
    });

    return (
        <mesh ref={ref} position={position}>
            <icosahedronGeometry args={[0.6, 1]} />
            <meshStandardMaterial
                color="#ff66aa"
                metalness={0.4}
                roughness={0.3}
                emissive="#ff3388"
                emissiveIntensity={0.6}
            />
        </mesh>
    );
}