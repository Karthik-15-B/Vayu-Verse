
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Block } from '@/utils/blockchain';
import * as THREE from 'three';

interface BlockchainVisualizerProps {
  blocks: Block[];
  className?: string;
}

function BlockMesh({ block, position, isLatest }: { block: Block; position: [number, number, number]; isLatest: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
      if (isLatest) {
        meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
      }
    }
  });

  const color = isLatest ? '#10B981' : '#3B82F6';
  const intensity = isLatest ? 0.3 : 0.2;

  return (
    <group position={position}>
      {/* Main block cube */}
      <mesh ref={meshRef}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={intensity}
          metalness={0.3}
          roughness={0.1}
        />
      </mesh>
      
      {/* Top indicator sphere */}
      <mesh ref={sphereRef} position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial 
          color="#F59E0B" 
          emissive="#F59E0B" 
          emissiveIntensity={isLatest ? 0.4 : 0.2}
        />
      </mesh>
      
      {/* Block info - using HTML overlay instead of 3D text */}
      <mesh position={[0, -1.5, 0]} visible={false}>
        <planeGeometry args={[2, 0.5]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}

export const BlockchainVisualizer: React.FC<BlockchainVisualizerProps> = ({ blocks, className }) => {
  const blockPositions = blocks.map((_, index) => [index * 3 - (blocks.length - 1) * 1.5, 0, 0] as [number, number, number]);

  return (
    <div className={`h-64 w-full relative ${className}`}>
      <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {blocks.map((block, index) => (
          <BlockMesh
            key={block.hash}
            block={block}
            position={blockPositions[index]}
            isLatest={index === blocks.length - 1}
          />
        ))}
      </Canvas>
      
      {/* HTML overlay for text labels */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="relative h-full flex items-center justify-center">
          {blocks.map((block, index) => (
            <div
              key={block.hash}
              className="absolute text-center text-white"
              style={{
                left: `${50 + (index - (blocks.length - 1) / 2) * 15}%`,
                top: '75%',
                transform: 'translateX(-50%)',
                fontSize: '12px'
              }}
            >
              <div className="font-medium">Block {block.index}</div>
              <div className="text-xs text-gray-400">{block.transactions.length} TXs</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
