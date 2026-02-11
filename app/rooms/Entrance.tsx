"use client";

import {useRef, useState} from "react";
import { useFrame } from "@react-three/fiber";
import { FogPlane } from "@/components/FogPlane";
import { IntroText } from "@/components/IntroText";
import * as THREE from "three";

export function Entrance({ position }: { position: [number, number, number] }) {
    const group = useRef<THREE.Group>(null);
    const lightRef = useRef<THREE.Group>(null);

    const startTime = useRef(0);
    const [ progress, setProgress ] = useState(0);

    const lightPosition = useRef(new THREE.Vector3(0,0,-10));

    useFrame((state) => {
        if (!group.current || !lightRef.current) return;

        if (!startTime.current) {
            startTime.current = state.clock.elapsedTime;
        }

        const t = state.clock.elapsedTime - startTime.current;
        const progress = Math.min(t / 3, 1);

        setProgress(progress);
    });

    return (
        <>
            <group ref={group} position={position}>
                <FogPlane index={0} progress={progress} lightPosition={lightPosition}/>
                <FogPlane index={1} progress={progress} lightPosition={lightPosition}/>
                <FogPlane index={2} progress={progress} lightPosition={lightPosition}/>
            </group>
            <IntroText />
        </>
    );
}


