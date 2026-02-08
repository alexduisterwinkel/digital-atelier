"use client";

import { usePathname } from "next/navigation";
import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useState, useRef } from "react";
import { rooms } from "@/lib/roomsConfig";
import { getRoomIndex } from "@/lib/routeMapper";
import gsap from "gsap";

export function CameraController() {
    const pathname = usePathname();
    const { camera } = useThree();
    const targetZ = useRef(camera.position.z);
    const [scrollY, setScrollY] = useState(0);

    // Listen to page scroll
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const roomIndex = getRoomIndex(pathname);
        targetZ.current = rooms[roomIndex].position[2] + 5;

        gsap.to(camera.position, {
            z: targetZ.current,
            duration: 1.5,
            ease: "power2.inOut",
        });
    }, [pathname, camera]);

    useFrame(() => {
        // optional: subtle floating motion
        camera.position.y = Math.sin(Date.now() * 0.001) * 0.1;

        // scroll-driven forward movement
        const scrollFactor = 0.01; // tweak speed
        const scrollZ = 5 - scrollY * scrollFactor; // moves toward negative Z
        camera.position.z = Math.min(scrollZ, targetZ.current); // don’t overshoot GSAP target

        // Room transition trigger: entrance → corridor
        if (scrollZ <= rooms[1].position[2] + 5 && pathname === "/") {
            window.history.replaceState(null, "", "/corridor");
        }
    });

    return null;
}
