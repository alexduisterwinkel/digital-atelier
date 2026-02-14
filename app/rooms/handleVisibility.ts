import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type UseRoomVisibilityProps = {
    roomRef: React.RefObject<THREE.Group>;
    position: [number, number, number];
};

export function handleVisibility({
                                      roomRef,
                                  }: UseRoomVisibilityProps) {

    const { camera } = useThree();

    useFrame(() => {
        if (!roomRef.current) return;

        const roomZ = -27;
        const distance = Math.abs(camera.position.z - roomZ);

        const appearStart = 32;
        const appearFull = 22;

        const visibility = THREE.MathUtils.clamp(
            1 - (distance - appearFull) / (appearStart - appearFull),
            0,
            1
        );

        roomRef.current.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                if (mesh.userData.ignoreRoomFade) return;
                const material = mesh.material as THREE.Material;

                material.transparent = true;
                material.opacity = visibility;
            }
        });
    });
}
