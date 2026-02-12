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
            <InteractionRoom position={[0, -2, -20]} />
            {/*Left room*/}
            <SystemRoom rotation={[0,1.5,0]} position={[-14, -2, -12]} />
            {/*Right room*/}
            <StoryRoom rotation={[0,-1.5,0]} position={[14, -2, -12]} />

            <Corridor />

        </>
    );
}