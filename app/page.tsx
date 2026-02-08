import Scene from "@/components/Scene";
import { VantaBackground } from "@/components/VantaBackground";

export default function Home() {
  return (
      <>
          <div className="vanta-bg" />
          {/*  <VantaBackground />*/}
          {/*</div>*/}

          {/* Fixed 3D canvas */}
          <main className="r3f-canvas w-screen h-screen overflow-hidden">
              <Scene />
          </main>
      </>
  );
}
