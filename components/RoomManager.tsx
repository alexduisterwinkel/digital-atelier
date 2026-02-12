"use client";

import { Entrance } from "@/app/rooms/Entrance";
import { Corridor } from "@/app/rooms/Corridor";
import { SystemRoom } from "@/components/rooms/system/SystemRoom";
import { StoryRoom } from "@/components/rooms/story/StoryRoom";
import { InteractionRoom } from "@/components/rooms/interaction/InteractionRoom";

export function RoomManager() {
    return (
        <>
            <Entrance position={[0, 0, 0]} />
            {/*<SystemRoom position={[-4, 0, -10]} />*/}
            <InteractionRoom position={[0, -2, -20]} />
            {/*<SystemRoom position={[14, -2, -15]} />*/}
            <SystemRoom rotation={[0,1.5,0]} position={[-14, -2, -12]} />
            {/*<StoryRoom position={[-0, -2, -20]} />*/}
            <StoryRoom rotation={[0,-1.5,0]} position={[14, -2, -12]} />

            <Corridor />

        </>
    );
}