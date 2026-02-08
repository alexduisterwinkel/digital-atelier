"use client";

import { Entrance } from "@/app/rooms/Entrance";

export function RoomManager() {
    return (
        <>
            <Entrance position={[0, 0, 0]} />
            {/* other rooms later */}
        </>
    );
}