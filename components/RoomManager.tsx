"use client";

import { Entrance } from "@/app/rooms/Entrance";
import { Corridor } from "@/app/rooms/Corridor";
import { SystemRoom } from "@/app/rooms/SystemRoom";
import { StoryRoom } from "@/app/rooms/StoryRoom";
import { InteractionRoom } from "@/app/rooms/InteractionRoom";

export function RoomManager() {
    return (
        <>
            <Entrance position={[0, 0, 0]} />
            {/*Center room*/}
            <InteractionRoom position={[1.5, -2, -25]} />
            {/*Left room*/}
            <SystemRoom rotation={[0,1.570796,0]} position={[-8, -2, -16.3]} />
            {/*Right room*/}
            <StoryRoom rotation={[0,-1.5707963,0]} position={[10.1, -2, -15.5]} />

            <Corridor />

        </>
    );
}