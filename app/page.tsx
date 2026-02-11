import Scene from "@/components/Scene";

export default function Home() {
  return (
      <>
          <div style={{ position: "fixed", inset: 0 }}>
              <main className="r3f-canvas w-screen h-screen overflow-hidden">
                  <Scene />
              </main>
          </div>
          <div style={{ height: "600vh" }}></div>
      </>
  );
}
