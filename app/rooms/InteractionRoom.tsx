import React, { useRef, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Text } from "@react-three/drei";
import * as THREE from "three";
import { EntranceWall, NormalWall } from "@/components/Corridor/EntranceWall";
import { ExitCollider, RoomEntranceCollider } from "@/components/Corridor/Collider";

/**
 * INTERACTION LAB
 *
 * The room itself is now the clickable object in the corridor.
 * It manages entering, being inside, and exiting.
 */

export function InteractionRoom({
                                            position = [0, 0, 0] as [number, number, number],
                                        }) {
    const [entered, setEntered] = useState(false);
    const roomRef = useRef<THREE.Group>(null);
    const focusTarget = useRef<THREE.Object3D>(null);

    const handleEnter = () => {
        if (!focusTarget.current || !roomRef.current) return;
        // get WORLD position of focus anchor

        const worldPos = new THREE.Vector3();
        focusTarget.current.getWorldPosition(worldPos);
        const roomQuat = new THREE.Quaternion();

        roomRef.current.getWorldQuaternion(roomQuat);
        (window as any).enterRoom(worldPos.x, worldPos.z, roomQuat);

        setEntered(true);
    };

    const handleExit = () => {
        (window as any).exitRoom();
        setEntered(false);
    };

    return (
        <group ref={roomRef} position={position}>
            <color attach="background" args={["#050505"]} />

            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} />

            {/* Click target used while in corridor */}
            {!entered && (
                    <RoomEntranceCollider onEnter={handleEnter}/>
            )}

            {/* Entrance wall + door */}
            {!entered && <EntranceWall color={"#914b4a"}/>}


            <NormalWall color={"orange"} />
            {/*<Floor />*/}
            <BackWall />

            <InteractiveSphere position={[-2, 1.2, 0]} />
            <InteractiveCube position={[0, 1.2, 0]} />
            <InteractivePlane position={[2, 1.2, 0]} />
            <Title />

            {/* Exit collider only exists while inside */}
            {entered && (
                <ExitCollider onExit={handleExit} />
            )}

            <Environment preset="city" />
            <mesh ref={focusTarget} position={[0, 0, 2]} />
        </group>
    );
}

function BackWall() {
    return (
        <mesh position={[0, 2, -3]}>
            <planeGeometry args={[12, 6]} />
            <meshStandardMaterial color="#0a0a0a" />
        </mesh>
    );
}

function Title() {
    return (
        <Text
            position={[0, 3.2, -2.8]}
            fontSize={0.35}
            color="#ffffff"
            anchorX="center"
        >
            Interaction Lab
        </Text>
    );
}

function InteractiveSphere({ position }) {
    const ref = useRef<THREE.Mesh | null>(null);
    const { mouse, viewport } = useThree();

    useFrame((_, delta) => {
        if (!ref.current) return;

        const targetX = (mouse.x * viewport.width) / 4;
        const targetY = (mouse.y * viewport.height) / 6 + 1.2;

        ref.current.position.x = THREE.MathUtils.lerp(
            ref.current.position.x,
            position[0] + targetX,
            0.08
        );

        ref.current.position.y = THREE.MathUtils.lerp(
            ref.current.position.y,
            targetY,
            0.08
        );

        ref.current.rotation.y += delta * 0.6;
    });

    return (
        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.6}>
            <mesh ref={ref} position={position}>
                <sphereGeometry args={[0.6, 64, 64]} />
                <meshStandardMaterial
                    color="#66ccff"
                    metalness={0.6}
                    roughness={0.2}
                />
            </mesh>
        </Float>
    );
}

function InteractiveCube({ position }) {
    const ref = useRef<THREE.Mesh | null>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((_, delta) => {
        if (!ref.current) return;

        const targetScale = hovered ? 1.4 : 1;
        ref.current.scale.lerp(
            new THREE.Vector3(targetScale, targetScale, targetScale),
            0.1
        );

        ref.current.rotation.x += delta * 0.4;
        ref.current.rotation.y += delta * 0.5;
    });

    return (
        <mesh
            ref={ref}
            position={position}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
                color={hovered ? "#ff8844" : "#ffffff"}
                metalness={0.3}
                roughness={0.5}
            />
        </mesh>
    );
}

function InteractivePlane({ position }) {
    const ref = useRef<THREE.Mesh | null>(null);
    const { mouse } = useThree();

    const geometry = useMemo(() => {
        const geo = new THREE.PlaneGeometry(2, 2, 40, 40);
        geo.rotateY(-Math.PI / 6);
        return geo;
    }, []);

    useFrame(() => {
        if (!ref.current) return;

        const geometry = ref.current.geometry as THREE.BufferGeometry;
        const positions = geometry.attributes.position as THREE.BufferAttribute;

        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const y = positions.getY(i);

            const dist = Math.sqrt(
                Math.pow(mouse.x * 2 - x * 0.3, 2) +
                Math.pow(mouse.y * 2 - y * 0.3, 2)
            );

            const z = Math.sin(dist * 4) * 0.15;
            positions.setZ(i, z);
        }

        positions.needsUpdate = true;
    });

    return (
        <mesh ref={ref} geometry={geometry} position={position}>
            <meshStandardMaterial
                color="#88ffaa"
                wireframe
                metalness={0.2}
                roughness={0.8}
            />
        </mesh>
    );
}
