"use client";

import {useRef, useState} from "react";
import {useFrame, useThree} from "@react-three/fiber";
import { FogPlane } from "@/components/FogPlane";
import { VantaBackground } from "@/components/VantaBackground";
import { IntroText } from "@/components/IntroText";
import * as THREE from "three";

export function Entrance({ position }: { position: [number, number, number] }) {
    const group = useRef<THREE.Group>(null);
    const lightRef = useRef<THREE.Group>(null);

    const startTime = useRef(0);
    const [ progress, setProgress ] = useState(0);

    const { camera, mouse, viewport } = useThree();

    const lightPosition = new THREE.Vector3(0, 0, -10);


    useFrame((state) => {
        if (!group.current || !lightRef.current) return;

        if (!startTime.current) {
            startTime.current = state.clock.elapsedTime;
        }

        const t = state.clock.elapsedTime - startTime.current;
        const progress = Math.min(t / 3, 1);
        const ease = 1 - Math.pow(1 - progress, 3);

        setProgress(progress);

        // camera slowly moves forward
        camera.position.z = 6 - ease * 1.3;

        // breathing motion fades out over time
        const breathStrength = 1 - ease;

        // subtle breathing motion
        group.current.position.y =
            Math.sin(state.clock.elapsedTime * 0.4) * 0.05 * breathStrength;

        // --- CURSOR LIGHT ---
        const targetX = mouse.x * viewport.width * 0.3;
        const targetY = mouse.y * viewport.height * 0.3;

        lightRef.current.position.x = THREE.MathUtils.lerp(
            lightRef.current.position.x,
            targetX,
            0.08
        );

        lightRef.current.position.y = THREE.MathUtils.lerp(
            lightRef.current.position.y,
            targetY,
            0.08
        );

        lightRef.current.position.z = -10;

        lightRef.current.getWorldPosition(lightPosition);
    });

    return (
        <group ref={group} position={position}>
            <FogPlane index={0} progress={progress} lightPosition={lightPosition}/>
            <FogPlane index={1} progress={progress} lightPosition={lightPosition}/>
            <FogPlane index={2} progress={progress} lightPosition={lightPosition}/>
            {/*<LightSource />*/}
            <group ref={lightRef}>
                <pointLight intensity={3} distance={25} color="#ffffff" />
                <mesh>
                    <sphereGeometry args={[0.35, 32, 32]} />
                    <meshBasicMaterial color="#ffffff" />
                </mesh>
            </group>
            <IntroText />
        </group>
    );
}

function LightSource() {
    return (
        <group position={[0, 0, -10]}>
            <pointLight intensity={2} distance={20} color="#ffffff" />

            <mesh>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshBasicMaterial color="#ffffff" />
            </mesh>
        </group>
    );
}


