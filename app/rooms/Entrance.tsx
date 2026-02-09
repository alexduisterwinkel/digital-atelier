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

    const lightPosition = useRef(new THREE.Vector3(0,0,-10));

    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 10); // z = -10
    const intersection = new THREE.Vector3();


    useFrame((state) => {
        if (!group.current || !lightRef.current) return;

        if (!startTime.current) {
            startTime.current = state.clock.elapsedTime;
        }

        const t = state.clock.elapsedTime - startTime.current;
        const progress = Math.min(t / 3, 1);
        const ease = 1 - Math.pow(1 - progress, 3);

        setProgress(progress);

        // breathing motion fades out over time
        const breathStrength = 1 - ease;

        // subtle breathing motion
        group.current.position.y =
            Math.sin(state.clock.elapsedTime * 0.4) * 0.05 * breathStrength;

        // --- CURSOR LIGHT ---
        raycaster.setFromCamera(mouse, camera);
        raycaster.ray.intersectPlane(plane, intersection);

        lightRef.current.position.lerp(intersection, 0.08);

        lightRef.current.getWorldPosition(lightPosition.current);
    });

    return (
        <group ref={group} position={position}>
            <FogPlane index={0} progress={progress} lightPosition={lightPosition}/>
            <FogPlane index={1} progress={progress} lightPosition={lightPosition}/>
            <FogPlane index={2} progress={progress} lightPosition={lightPosition}/>
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


