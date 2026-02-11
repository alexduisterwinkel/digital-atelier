"use client";

import { Entrance } from "@/app/rooms/Entrance";
import { Corridor } from "@/app/rooms/Corridor";
import { InteractionRoom } from "@/components/rooms/interaction/InteractionRoom";

export function RoomManager() {
    return (
        <>
            <Entrance position={[0, 0, 0]} />
            <InteractionRoom position={[-0, -2, -20]} />

            <Corridor />

        </>
    );
}