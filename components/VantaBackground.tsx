"use client";

import {useEffect, useRef} from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import FOG from "vanta/dist/vanta.fog.min";

export function VantaBackground() {
    // const nearFog = useRef<THREE.Mesh>(null);
    // const midFog = useRef<THREE.Mesh>(null);
    // const farFog = useRef<THREE.Mesh>(null);
    //
    const vantaRef = useRef(null);

    useEffect(() => {
        const vantaEffect = FOG({
            el: vantaRef.current,
            THREE,
            minHeight: 200.0,
            minWidth: 200.0,
            highlightColor: 0x157fc5,
            midtoneColor: 0xb81f69,
            lowlightColor: 0xd10202,
            baseColor: 0x100000,
            blurFactor: 0.6,
            speed: 2,
            zoom: 1.5
        });

        return () => {
            if (vantaEffect) vantaEffect.destroy();
        }
    }, []);
    //
    //
    // const { mouse } = useThree();
    //
    // // random offsets for natural drift
    // const offsets = {
    //     near: { x: Math.random() * 10, y: Math.random() * 10 },
    //     mid: { x: Math.random() * 5, y: Math.random() * 5 },
    //     far: { x: Math.random() * 3, y: Math.random() * 3 },
    // };
    //
    // const speed1 = 0.5
    // const speed2 = 0.002
    //
    // useFrame((state) => {
    //     const t = state.clock.elapsedTime;
    //
    //     if (nearFog.current) {
    //        // nearFog.current.position.x = Math.sin(t * speed1 + offsets.near.x) * speed2;
    //        nearFog.current.position.x = mouse.x*1.5;
    //         nearFog.current.position.y = mouse.y*1.2;
    //     }
    //
    //     if (midFog.current) {
    //         midFog.current.position.x = Math.sin(t * speed1 + offsets.mid.x) * speed2;
    //         midFog.current.position.y = Math.sin(t * speed1 + offsets.mid.y) * speed2;
    //     }
    //
    //     if (farFog.current) {
    //         farFog.current.rotation.z += 0.0001;
    //         farFog.current.position.x = Math.sin(t * speed1 + offsets.far.x) * speed2;
    //         farFog.current.position.y = Math.cos(t * speed1 + offsets.far.y) * speed2;
    //     }
    // });

    // return (
    //     <>
    //         {/* Near fog (dense) */}
    //         <mesh ref={nearFog} position={[0, 0, -1.5]}>
    //             <planeGeometry args={[8, 4]} />
    //             <meshBasicMaterial
    //                 color="red"
    //                 // color="#2a2a35"
    //                 transparent
    //                 opacity={0.35}
    //                 depthWrite={false}
    //             />
    //         </mesh>
    //
    //         {/* Mid fog */}
    //         <mesh ref={midFog} position={[0, 0, -4]}>
    //             <planeGeometry args={[12, 8]} />
    //             <meshBasicMaterial
    //                 color="blue"
    //                 // color="#1f1f2a"
    //                 transparent
    //                 opacity={0.25}
    //                 depthWrite={false}
    //             />
    //         </mesh>
    //
    //         {/* Far fog (thin) */}
    //         <mesh ref={farFog} position={[0, 0, -8]}>
    //             <planeGeometry args={[16, 12]} />
    //             <meshBasicMaterial
    //                 color="green"
    //                 // color="#14141c"
    //                 transparent
    //                 opacity={0.15}
    //                 depthWrite={false}
    //             />
    //         </mesh>
    //     </>
    // );

    return  (
        <main>
            <div className="background" ref={vantaRef}></div>
            <div className="title">Background Animation</div>
        </main>
     )
}
