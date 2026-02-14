import { useCallback } from "react";
import * as THREE from "three";

type UseRoomInteractionProps = {
    roomRef: React.RefObject<THREE.Group>;
    focusTarget: React.RefObject<THREE.Object3D>;
    setEntered: React.Dispatch<React.SetStateAction<boolean>>;
};

export function handleCollider({
                                       roomRef,
                                       focusTarget,
                                       setEntered,
                                   }: UseRoomInteractionProps) {

    const handleEnter = useCallback(() => {
        if (!focusTarget.current || !roomRef.current) return;

        const worldPos = new THREE.Vector3();
        focusTarget.current.getWorldPosition(worldPos);

        const roomQuat = new THREE.Quaternion();
        roomRef.current.getWorldQuaternion(roomQuat);

        (window as any).enterRoom(worldPos.x, worldPos.z, roomQuat);
        setEntered(true);
    }, [roomRef, focusTarget, setEntered]);

    const handleExit = useCallback(() => {
        (window as any).exitRoom();
        setEntered(false);
    }, [setEntered]);

    return { handleEnter, handleExit };
}
