function Floor() {
    return (
        <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0, 0]}
            receiveShadow
        >
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial
                color="#0f0f0f"
                roughness={0.9}
                metalness={0.1}
            />
        </mesh>
    );
}