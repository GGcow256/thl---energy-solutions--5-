import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Add type definitions for R3F elements to satisfy TypeScript compiler
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      cylinderGeometry: any;
      meshStandardMaterial: any;
      meshBasicMaterial: any;
      torusGeometry: any;
      boxGeometry: any;
      ringGeometry: any;
    }
  }
}

export const BatteryModel = (props: any) => {
  const group = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);
  const ringRef3 = useRef<THREE.Mesh>(null);

  // --- 移动端检测逻辑 ---
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // 屏幕宽度小于 768px 判断为手机/小平板
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- 动态精度参数 (PC端满血还原，移动端降级保护) ---
  // 外壳高精度分段 (PC: 64, 手机: 32)
  const highSegments = isMobile ? 32 : 64;
  // 内部构件中等分段 (PC: 32, 手机: 16)
  const medSegments = isMobile ? 16 : 32;
  // 全息光环分段 (PC: 100, 手机: 48)
  const torusTubularSegments = isMobile ? 48 : 100;
  
  // 玻璃材质核心参数
  // 采样率：决定玻璃的细腻程度和折射质量 (PC: 8 原画质, 手机: 3)
  const glassSamples = isMobile ? 3 : 8;
  // 分辨率：决定玻璃内部纹理的清晰度 (PC: 1024 满画质, 手机: 256)
  const glassResolution = isMobile ? 256 : 1024;
  
  // 能量粒子数量 (PC: 40 原数量, 手机: 15)
  const sparkleCount = isMobile ? 15 : 40;
  // 内部线框网格高度分段 (PC: 8, 手机: 4)
  const wireframeHeightSegments = isMobile ? 4 : 8;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Core breathing effect - Energy pulse
    if (coreRef.current) {
        (coreRef.current.material as THREE.MeshBasicMaterial).opacity = 0.5 + Math.sin(t * 3) * 0.3;
        coreRef.current.scale.y = 1 + Math.sin(t * 10) * 0.01; 
    }

    // Rings rotation - Gyroscopic movement
    if (ringRef1.current) {
        ringRef1.current.rotation.z = t * 0.2;
        ringRef1.current.rotation.x = Math.sin(t * 0.5) * 0.2;
    }
    if (ringRef2.current) {
        ringRef2.current.rotation.z = -t * 0.15;
        ringRef2.current.rotation.y = Math.cos(t * 0.5) * 0.2;
    }
    if (ringRef3.current) {
        ringRef3.current.rotation.x = t * 0.1;
        ringRef3.current.rotation.y = t * 0.1;
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        
        {/* --- 1. Main Casing (High-Tech Glass Shell) --- */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[2.2, 2.2, 7.2, highSegments]} />
          {/* Advanced Glass Material */}
          <MeshTransmissionMaterial 
            backside
            samples={glassSamples} 
            resolution={glassResolution} 
            thickness={0.8}
            chromaticAberration={0.06} // 还原色散效果 (0.06)
            anisotropy={0.1}
            distortion={0.2}
            distortionScale={0.3} // 还原扭曲缩放 (0.3)
            temporalDistortion={0.1}
            ior={1.52}
            color="#e0f2fe" 
            roughness={0.1}
            clearcoat={1}
          />
        </mesh>

        {/* --- 2. Internal Tech Structure (Wireframe Cage) --- */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[1.8, 1.8, 6.8, medSegments, wireframeHeightSegments, true]} />
          <meshBasicMaterial 
            color="#0ea5e9" 
            wireframe 
            transparent 
            opacity={0.05} 
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* --- 3. Top Cap (Detailed Metal) --- */}
        <group position={[0, 3.65, 0]}>
            {/* Main Cap */}
            <mesh>
                <cylinderGeometry args={[2.25, 2.2, 0.5, highSegments]} />
                <meshStandardMaterial color="#f1f5f9" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Inner Ring */}
            <mesh position={[0, 0.3, 0]}>
                <cylinderGeometry args={[1.5, 1.8, 0.3, medSegments]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.3} />
            </mesh>
            {/* Positive Terminal */}
            <mesh position={[0, 0.5, 0]}>
                <cylinderGeometry args={[0.6, 0.6, 0.4, medSegments]} />
                <meshStandardMaterial color="#ef4444" metalness={0.4} roughness={0.4} emissive="#ef4444" emissiveIntensity={0.2} />
            </mesh>
            {/* Status LED Ring */}
            <mesh position={[0, 0.26, 0]} rotation={[-Math.PI/2, 0, 0]}>
                <ringGeometry args={[1.9, 2.0, highSegments]} />
                <meshBasicMaterial color="#00f3ff" toneMapped={false} />
            </mesh>
        </group>

        {/* --- 4. Bottom Cap (Detailed Metal) --- */}
        <group position={[0, -3.65, 0]}>
            <mesh>
                <cylinderGeometry args={[2.2, 2.25, 0.5, highSegments]} />
                <meshStandardMaterial color="#f1f5f9" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, -0.3, 0]}>
                 <cylinderGeometry args={[1.8, 1.5, 0.3, medSegments]} />
                 <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.5} />
            </mesh>
        </group>

        {/* --- 5. Inner Energy Core (Volumetric Glow) --- */}
        <group>
            {/* Inner Solid Core */}
            <mesh ref={coreRef} position={[0, 0, 0]}>
                <cylinderGeometry args={[0.8, 0.8, 6.5, medSegments]} />
                <meshBasicMaterial color="#00f3ff" transparent opacity={0.8} toneMapped={false} />
            </mesh>
            
            {/* Outer Glow Haze */}
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[1.4, 1.4, 6, medSegments]} />
                <meshBasicMaterial color="#0ea5e9" transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>

            {/* Energy Particles inside the glass */}
            <Sparkles 
                count={sparkleCount} 
                scale={[3, 6, 3]} 
                size={4} 
                speed={0.4} 
                opacity={0.8} 
                color="#00f3ff"
            />
        </group>

        {/* --- 6. Floating Holographic Rings --- */}
        <mesh ref={ringRef1} position={[0, 0, 0]} rotation={[0.2, 0, 0]}>
          <torusGeometry args={[2.8, 0.03, 16, torusTubularSegments]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </mesh>

        <mesh ref={ringRef2} position={[0, 0, 0]} rotation={[-0.2, 0, 0]}>
          <torusGeometry args={[3.2, 0.02, 16, torusTubularSegments]} />
          <meshBasicMaterial color="#06b6d4" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
        </mesh>

        <mesh ref={ringRef3} position={[0, 0, 0]}>
           <torusGeometry args={[4.0, 0.01, 16, torusTubularSegments]} />
           <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
        </mesh>

      </Float>
    </group>
  );
};