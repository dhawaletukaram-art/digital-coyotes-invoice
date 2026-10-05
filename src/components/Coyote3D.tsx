import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Sparkles, Eye, Box } from 'lucide-react';

interface Coyote3DProps {
  className?: string;
  height?: number;
  interactive?: boolean;
  showControls?: boolean;
}

export const Coyote3D: React.FC<Coyote3DProps> = ({
  className = '',
  height = 360,
  interactive = true,
  showControls = true
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);
  const [rotationSpeed, setRotationSpeed] = useState<number>(0.008);
  const [activePreset, setActivePreset] = useState<'origami' | 'cyber' | 'minimal'>('origami');
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // References for animation loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const headMeshRef = useRef<THREE.Mesh | null>(null);
  const edgesLineRef = useRef<THREE.LineSegments | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const mouseRef = useRef<{ x: number; y: number; isDown: boolean; prevX: number; prevY: number }>({
    x: 0,
    y: 0,
    isDown: false,
    prevX: 0,
    prevY: 0
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const currentHeight = height;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / currentHeight, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, currentHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Transparent background

    container.appendChild(renderer.domElement);

    // 2. Lighting setup for 3D Origami depth
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xff7722, 2.8);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    fillLight.position.set(-4, -2, -3);
    scene.add(fillLight);

    const pointLight = new THREE.PointLight(0xff5500, 3, 10);
    pointLight.position.set(0, 0, 3);
    scene.add(pointLight);

    // 3. Custom 3D Origami Coyote Head Geometry
    // Constructed matching the polygonal facets of the DigiCoyotes logo
    const vertices = new Float32Array([
      // Ears & Crown
      -1.1, 2.6, 0.1,    // 0: Left Ear Tip
       1.1, 2.6, 0.1,    // 1: Right Ear Tip
      -1.7, 0.9, -0.3,   // 2: Left Ear Base Outer
       1.7, 0.9, -0.3,   // 3: Right Ear Base Outer
      -0.5, 0.9, 0.5,    // 4: Left Ear Inner
       0.5, 0.9, 0.5,    // 5: Right Ear Inner
       0.0, 1.4, 0.6,    // 6: Forehead Peak

      // Cheeks & Snout
       0.0, 0.1, 1.2,    // 7: Nose Bridge Top
      -1.5, -0.2, 0.2,   // 8: Left Cheekbone
       1.5, -0.2, 0.2,   // 9: Right Cheekbone
       0.0, -0.8, 1.7,   // 10: Snout Tip
      -0.6, -0.7, 1.0,   // 11: Left Muzzle Side
       0.6, -0.7, 1.0,   // 12: Right Muzzle Side

      // Jaws & Chin
      -1.1, -1.3, -0.2,  // 13: Left Jaw Corner
       1.1, -1.3, -0.2,  // 14: Right Jaw Corner
       0.0, -1.9, 0.3,   // 15: Chin Tip

      // Back of Head (Depth)
       0.0, 1.2, -1.2,   // 16: Occipital / Crown Back
      -1.2, 0.0, -1.0,   // 17: Left Back
       1.2, 0.0, -1.0,   // 18: Right Back
       0.0, -1.1, -0.9   // 19: Neck Base Back
    ]);

    const indices = [
      // Left Ear
      0, 2, 4,
      0, 4, 6,
      0, 16, 2,

      // Right Ear
      1, 5, 3,
      1, 6, 5,
      1, 3, 16,

      // Forehead
      6, 4, 7,
      6, 7, 5,
      4, 2, 8,
      4, 8, 7,
      5, 7, 9,
      5, 9, 3,

      // Snout & Muzzle
      7, 8, 11,
      7, 11, 10,
      7, 10, 12,
      7, 12, 9,

      // Jaw & Cheeks
      8, 13, 11,
      9, 12, 14,
      11, 13, 15,
      12, 15, 14,
      11, 15, 10,
      12, 10, 15,

      // Back of Skull
      6, 16, 4,
      6, 5, 16,
      2, 17, 8,
      3, 9, 18,
      2, 16, 17,
      3, 18, 16,
      8, 17, 13,
      9, 14, 18,
      13, 17, 19,
      14, 19, 18,
      13, 19, 15,
      14, 15, 19
    ];

    const coyoteGeometry = new THREE.BufferGeometry();
    coyoteGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    coyoteGeometry.setIndex(indices);
    coyoteGeometry.computeVertexNormals();

    // Group to hold mesh + edges
    const coyoteGroup = new THREE.Group();
    coyoteGroup.position.set(0, -0.2, 0);

    // Material 1: Polygonal Facets (Semi-translucent frosted glass / crystal with warm orange specular)
    const facetMaterial = new THREE.MeshPhongMaterial({
      color: 0x141b29,
      emissive: 0x241108,
      specular: 0xff6600,
      shininess: 90,
      flatShading: true,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide
    });

    const headMesh = new THREE.Mesh(coyoteGeometry, facetMaterial);
    headMeshRef.current = headMesh;
    coyoteGroup.add(headMesh);

    // Material 2: Razor sharp neon wireframe edges
    const wireGeometry = new THREE.WireframeGeometry(coyoteGeometry);
    const edgesMaterial = new THREE.LineBasicMaterial({
      color: 0xff6600,
      linewidth: 2,
      transparent: true,
      opacity: 0.95
    });
    const edgesLine = new THREE.LineSegments(wireGeometry, edgesMaterial);
    edgesLineRef.current = edgesLine;
    coyoteGroup.add(edgesLine);

    scene.add(coyoteGroup);

    // 4. Orbiting 3D Particle Universe
    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 3.2 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);

      // Alternate warm orange & cool slate star particles
      const isWarm = Math.random() > 0.4;
      particleColors[i * 3] = isWarm ? 1.0 : 0.4;
      particleColors[i * 3 + 1] = isWarm ? 0.45 : 0.6;
      particleColors[i * 3 + 2] = isWarm ? 0.1 : 0.9;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    particlesRef.current = particles;
    scene.add(particles);

    // 5. Mouse Interaction Listeners
    let targetRotationY = 0;
    let targetRotationX = 0;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      mouseRef.current.isDown = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      mouseRef.current.prevX = clientX;
      mouseRef.current.prevY = clientY;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (mouseRef.current.isDown) {
        const deltaX = clientX - mouseRef.current.prevX;
        const deltaY = clientY - mouseRef.current.prevY;
        targetRotationY += deltaX * 0.008;
        targetRotationX += deltaY * 0.008;
        mouseRef.current.prevX = clientX;
        mouseRef.current.prevY = clientY;
      } else {
        const rect = container.getBoundingClientRect();
        const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
        const normY = -(((clientY - rect.top) / rect.height) * 2 - 1);
        targetRotationY = normX * 0.4;
        targetRotationX = -normY * 0.3;
      }
    };

    const handlePointerUp = () => {
      mouseRef.current.isDown = false;
    };

    container.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    container.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // 6. Responsive Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        if (newWidth > 0) {
          camera.aspect = newWidth / currentHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, currentHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // 7. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Continuous subtle idle rotation + mouse spring damping
      coyoteGroup.rotation.y += (targetRotationY - coyoteGroup.rotation.y) * 0.06;
      coyoteGroup.rotation.x += (targetRotationX - coyoteGroup.rotation.x) * 0.06;

      if (!mouseRef.current.isDown) {
        coyoteGroup.rotation.y += rotationSpeed;
        coyoteGroup.position.y = -0.2 + Math.sin(elapsedTime * 1.5) * 0.08;
      }

      // Rotate particle cloud gently in opposite direction
      if (particles) {
        particles.rotation.y -= 0.002;
        particles.rotation.x = Math.sin(elapsedTime * 0.5) * 0.1;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      container.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      coyoteGeometry.dispose();
      wireGeometry.dispose();
      facetMaterial.dispose();
      edgesMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, [height, rotationSpeed]);

  // Handle Preset changes
  useEffect(() => {
    if (!headMeshRef.current || !edgesLineRef.current) return;
    const mesh = headMeshRef.current;
    const edges = edgesLineRef.current;

    if (activePreset === 'origami') {
      (mesh.material as THREE.MeshPhongMaterial).color.setHex(0x141b29);
      (mesh.material as THREE.MeshPhongMaterial).emissive.setHex(0x281005);
      (mesh.material as THREE.MeshPhongMaterial).specular.setHex(0xff7700);
      (mesh.material as THREE.MeshPhongMaterial).opacity = 0.95;
      (edges.material as THREE.LineBasicMaterial).color.setHex(0xff6600);
      (edges.material as THREE.LineBasicMaterial).opacity = 0.9;
    } else if (activePreset === 'cyber') {
      (mesh.material as THREE.MeshPhongMaterial).color.setHex(0x050811);
      (mesh.material as THREE.MeshPhongMaterial).emissive.setHex(0xff3300);
      (mesh.material as THREE.MeshPhongMaterial).opacity = 0.4;
      (edges.material as THREE.LineBasicMaterial).color.setHex(0xffaa00);
      (edges.material as THREE.LineBasicMaterial).opacity = 1.0;
    } else if (activePreset === 'minimal') {
      (mesh.material as THREE.MeshPhongMaterial).color.setHex(0x1e293b);
      (mesh.material as THREE.MeshPhongMaterial).emissive.setHex(0x000000);
      (mesh.material as THREE.MeshPhongMaterial).opacity = 0.98;
      (edges.material as THREE.LineBasicMaterial).color.setHex(0xf97316);
      (edges.material as THREE.LineBasicMaterial).opacity = 0.7;
    }
  }, [activePreset]);

  // Toggle wireframe mode
  useEffect(() => {
    if (!headMeshRef.current) return;
    (headMeshRef.current.material as THREE.MeshPhongMaterial).wireframe = wireframeMode;
  }, [wireframeMode]);

  return (
    <div 
      className={`relative rounded-2xl bg-gradient-to-b from-[#131b2c]/80 to-[#0c101a]/90 border border-slate-800/80 shadow-2xl overflow-hidden backdrop-blur-sm ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D WebGL Canvas Container */}
      <div 
        ref={mountRef} 
        style={{ height }}
        className="w-full cursor-grab active:cursor-grabbing select-none relative z-10"
      />

      {/* Atmospheric 3D Lighting & Radial Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/10 via-transparent to-[#070b13]/80 z-0" />

      {/* Top Left Badge: Spatial Hologram status */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 text-xs font-mono text-slate-300 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
        <span className="font-semibold text-slate-200">Digital Coyotes 3D Spatial Engine</span>
        <span className="text-slate-500">·</span>
        <span className="text-slate-400">Interactive Mesh</span>
      </div>

      {/* Interactive Controls Overlay */}
      {showControls && (
        <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800/90 text-xs backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px] hidden sm:inline">Theme:</span>
            <div className="flex items-center gap-1">
              {(['origami', 'cyber', 'minimal'] as const).map((preset) => (
                <button
                  key={preset}
                  onClick={() => setActivePreset(preset)}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors capitalize ${
                    activePreset === preset 
                      ? 'bg-orange-500 text-white font-semibold shadow-sm shadow-orange-500/30' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setWireframeMode(!wireframeMode)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                wireframeMode ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Toggle Wireframe Skeleton"
            >
              <Box className="w-3 h-3" />
              <span className="hidden sm:inline">Wireframe</span>
            </button>

            <button
              onClick={() => setRotationSpeed(s => s === 0 ? 0.008 : 0)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                rotationSpeed > 0 ? 'text-orange-400 bg-orange-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title="Toggle Auto Rotation"
            >
              <RotateCw className={`w-3 h-3 ${rotationSpeed > 0 ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
              <span className="hidden sm:inline">{rotationSpeed > 0 ? 'Orbiting' : 'Paused'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
