import React, { useRef, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Text } from "@react-three/drei";
import * as THREE from "three";
import { EntranceWall } from "@/components/Corridor/EntranceWall";

/**
 * INVISIBLE CLICK COLLIDER
 *
 * Clicking this moves the camera in front of the room
 * via CameraController.
 */
export function RoomEntranceCollider({
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
export function ExitCollider({ onExit }: { onExit: () => void }) {
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