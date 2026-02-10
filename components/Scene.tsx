"use client";

import { Canvas } from "@react-three/fiber";
import { RoomManager } from "./RoomManager";
import { CameraController } from "./CameraController";

export default function Scene() {
    return (
        <>
            <Canvas gl={{ alpha: true }} camera={{ position: [0, 0, 5], fov: 50 }} dpr={[1, 2]} shadows>
                <color attach="background" args={["#0b0b0f"]} />
                <ambientLight intensity={0.5} />
                <directionalLight position={[3, 5, 2]} intensity={1} />
                <fog attach="fog" args={['#374f75', 7, 20]} /> //corridorfog coloring
                <CameraController />
                <RoomManager />
            </Canvas>
        </>
    );
}