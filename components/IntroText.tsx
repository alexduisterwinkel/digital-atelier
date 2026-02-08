"use client";

import { Text } from "@react-three/drei";

export function IntroText() {
    return (
        <group position={[0, 0.5, -6]}>
            <Text
                fontSize={0.6}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                Digital Atelier
            </Text>

            <Text
                position={[0, -0.8, 0]}
                fontSize={0.25}
                color="#aaaaaa"
                anchorX="center"
                anchorY="middle"
            >
                Interfaces · Motion · Experiments
            </Text>
        </group>
    );
}