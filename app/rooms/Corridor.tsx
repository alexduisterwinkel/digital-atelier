"use client";

import { useRef } from "react";
import * as THREE from "three";
import { RoomPreview } from "@/components/Corridor/RoomPreview";
import { CorridorFog  } from "@/components/Corridor/CorridorFog";
import { useThree } from "@react-three/fiber";

export function Corridor() {
    const group = useRef<THREE.Group>(null);
    const { camera } = useThree();

    const corridorRooms = [
        /* LEFT ROOM */
        { position: [-4, 0, -10] as [number, number, number], color: "#ff0040" },
        /* RIGHT ROOM */
        { position: [4, 0, -12] as [number, number, number], color: "#00ffff" },
        /* CENTER FAR ROOM */
        { position: [0, 0, -14] as [number, number, number], color: "#ffff00" },
    ];

    return (
        <>
        {/*<group ref={group}>*/}
        {/*        <CorridorFog rooms={corridorRooms} />*/}

        {/*        {corridorRooms.map((room, i) => (*/}
        {/*            <RoomPreview*/}
        {/*                key={i}*/}
        {/*                position={room.position}*/}
        {/*                color={room.color}*/}
        {/*            />*/}
        {/*        ))}*/}

        {/*</group>*/}
        <mesh
            position={[0, 0, -5]}
            onClick={() => {
                if ((window as any).exitRoom) {
                    (window as any).exitRoom();
                }
            }}
        >
            <planeGeometry args={[100, 100]} />
            <meshBasicMaterial transparent opacity={0} />
        </mesh>
        </>
    );
}
