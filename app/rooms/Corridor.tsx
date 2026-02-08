"use client";

import { useRef } from "react";
import * as THREE from "three";
import { CorridorCamera } from "@/components/Corridor/CorridorCamera";
import { RoomPreview } from "@/components/Corridor/RoomPreview";

export function Corridor() {
    const group = useRef<THREE.Group>(null);

    return (
        <group ref={group}>
            <CorridorCamera />

            {/* LEFT ROOM */}
            <RoomPreview
                position={[-4, 0, -10]}
                color="#ff0040"
            />

            {/* RIGHT ROOM */}
            <RoomPreview
                position={[4, 0, -20]}
                color="#00ffff"
            />

            {/* CENTER FAR ROOM */}
            <RoomPreview
                position={[0, 0, -30]}
                color="#ffff00"
            />
        </group>
    );
}
