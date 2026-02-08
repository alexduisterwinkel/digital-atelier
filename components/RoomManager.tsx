"use client";

import { Entrance } from "@/app/rooms/Entrance";
import { Corridor } from "@/app/rooms/Corridor";

export function RoomManager() {
    return (
        <>
            <Entrance position={[0, 0, 0]} />
            {/* other rooms later */}

            <Corridor />
        </>
    );
}