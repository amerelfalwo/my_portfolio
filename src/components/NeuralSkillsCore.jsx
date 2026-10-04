import React, { useEffect, useRef, useState, useMemo, memo } from 'react';
import * as THREE from 'three';
import { m, AnimatePresence } from 'framer-motion';
import { Brain } from 'lucide-react';
import { getToolIconUrl } from '../utils/getToolIcon';

/* ═══════════════════════════════════════════════════════════════════════════
   DYNAMIC ADAPTIVE 3D AI CORE SPHERE (Apple Vision Pro Inspired)
   - Automatically recalculates layers (1, 2, or 3 layers), radius, spacing,
     scale, and camera distance based on technology count N (2, 4, 6, 8, 12, 18, 24).
   - Exactly 3 Structured Transparent Orbit Rings (Pink 0.2, Purple 0.15, Cyan 0.1)
   - Auto rotation: 35s period. STOPS during mouse drag, RESUMES when released.
   - Floating animation: 12s cycle.
   - 60 FPS GPU-Accelerated WebGL + CSS 3D Projection
   ═══════════════════════════════════════════════════════════════════════════ */

/* Dynamic 3D Layout Mathematics Algorithm */
function calculateAdaptiveLayout(skillsList, isMobile) {
  const count = skillsList.length;
  if (count === 0) return { ringCount: 1, layers: [[]], radii: [150], cameraZ: 550 };

  // Rule 1: N = 1 or 2 technologies -> 1 Layer, Opposite Poles (0 & PI)
  if (count <= 2) {
    const radius = isMobile ? 120 : 180;
    return {
      ringCount: 1,
      layers: [skillsList],
      radii: [radius],
      cameraZ: isMobile ? 480 : 540,
    };
  }

  // Rule 2: N = 3 to 4 technologies -> 1 Layer
  if (count <= 4) {
    const radius = isMobile ? 140 : 210;
    return {
      ringCount: 1,
      layers: [skillsList],
      radii: [radius],
      cameraZ: isMobile ? 500 : 580,
    };
  }

  // Rule 3: N = 5 to 17 technologies -> 2 Layers
  if (count <= 17) {
    const mid = Math.ceil(count / 2);
    const innerRadius = isMobile ? 110 : 155;
    const outerRadius = isMobile ? 180 : 245;
    return {
      ringCount: 2,
      layers: [skillsList.slice(0, mid), skillsList.slice(mid)],
      radii: [innerRadius, outerRadius],
      cameraZ: isMobile ? 600 : 760,
    };
  }

  // Rule 4: N >= 18 technologies -> 3 Layers
  const l1 = Math.ceil(count * 0.25);
  const l2 = Math.ceil(count * 0.35);
  const innerRadius = isMobile ? 120 : 180;
  const midRadius = isMobile ? 200 : 285;
  const outerRadius = isMobile ? 280 : 395;

  return {
    ringCount: 3,
    layers: [
      skillsList.slice(0, l1),
      skillsList.slice(l1, l1 + l2),
      skillsList.slice(l1 + l2),
    ],
    radii: [innerRadius, midRadius, outerRadius],
    cameraZ: isMobile ? 540 : 620,
  };
}

const NeuralSkillsCore = memo(({ skills = [], activeCategory = 'all', categoryLabel = 'All Stack' }) => {
  const containerRef = useRef(null);
  const mountRef = useRef(null);
  const canvasLinesRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedTech, setSelectedTech] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(620);
  const [isGrabbing, setIsGrabbing] = useState(false);

  // IntersectionObserver: Only run heavy 3D WebGL loop when section is visible
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: '120px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Deduplicate input skills
  const cleanSkills = useMemo(() => {
    if (!skills || skills.length === 0) return [];
    const uniqueMap = new Map();
    skills.forEach((s) => uniqueMap.set(s.name.toLowerCase(), s));
    return Array.from(uniqueMap.values());
  }, [skills]);

  // Compute adaptive layout parameters
  const layoutConfig = useMemo(() => {
    return calculateAdaptiveLayout(cleanSkills, isMobile);
  }, [cleanSkills, isMobile]);

  // 3D Sphere Rotation State (Stops on Drag, Resumes on Release)
  const sphereRot = useRef({ x: 0.3, y: 0.2, vx: 0, vy: 0 });
  const isSphereDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  // Camera Zoom & Mouse Parallax Damping State
  const cameraZ = useRef(layoutConfig.cameraZ);
  const targetCameraZ = useRef(layoutConfig.cameraZ);
  const mouseParallax = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Node Drag & Spring Return State
  const activeNodeDrag = useRef(null);
  const nodeOffsets = useRef({});
  const nodeDragStart = useRef({ pointerX: 0, pointerY: 0, offsetX: 0, offsetY: 0 });

  const nodeRefs = useRef({});
  const [nodePositions, setNodePositions] = useState([]);

  // Use refs for hover and selection to avoid resetting the animation loop
  const hoveredIdRef = useRef(hoveredId);
  const selectedTechRef = useRef(selectedTech);

  useEffect(() => {
    hoveredIdRef.current = hoveredId;
  }, [hoveredId]);

  useEffect(() => {
    selectedTechRef.current = selectedTech;
  }, [selectedTech]);

  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (isInView && !hasInitialized) {
      setHasInitialized(true);
    }
  }, [isInView, hasInitialized]);

  // Sync cameraZ when layout changes
  useEffect(() => {
    targetCameraZ.current = layoutConfig.cameraZ;
    cameraZ.current = layoutConfig.cameraZ;
    setZoomLevel(layoutConfig.cameraZ);
  }, [layoutConfig]);

  // ── THREE.JS WEBGL SCENE SETUP (Lazy-initialized only when user reaches section) ──
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const ringsGroupRef = useRef(null);
  const coreGroupRef = useRef(null);

  useEffect(() => {
    if (!hasInitialized) return;
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 900;
    const height = mount.clientHeight || 600;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 3000);
    camera.position.z = cameraZ.current;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Central AI Core Icosahedron Wireframe
    const coreGroup = new THREE.Group();
    coreGroupRef.current = coreGroup;

    const coreGeo = new THREE.IcosahedronGeometry(52, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    coreGroup.add(new THREE.Mesh(coreGeo, coreMat));

    const innerGeo = new THREE.IcosahedronGeometry(28, 1);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    coreGroup.add(new THREE.Mesh(innerGeo, innerMat));

    const sphereGeo = new THREE.SphereGeometry(14, 16, 16);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0xec4899,
      transparent: true,
      opacity: 0.7,
    });
    coreGroup.add(new THREE.Mesh(sphereGeo, sphereMat));

    scene.add(coreGroup);

    // ── 3 STRUCTURED TRANSPARENT ORBIT RINGS ONLY ──
    const ringsGroup = new THREE.Group();
    ringsGroupRef.current = ringsGroup;

    const r0 = layoutConfig.radii[0] || (isMobile ? 120 : 180);
    const r1 = layoutConfig.radii[1] || (isMobile ? 200 : 285);
    const r2 = layoutConfig.radii[2] || (isMobile ? 280 : 395);

    // Ring 1: Inner Pink (Opacity 0.2)
    const ring1Geo = new THREE.TorusGeometry(r0, 1.2, 16, 120);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0xec4899,
      transparent: true,
      opacity: 0.2,
    });
    const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1Mesh.rotation.x = Math.PI / 3;
    ring1Mesh.rotation.y = Math.PI / 6;
    ringsGroup.add(ring1Mesh);

    // Ring 2: Middle Purple (Opacity 0.15)
    const ring2Geo = new THREE.TorusGeometry(r1, 1.2, 16, 120);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      transparent: true,
      opacity: 0.15,
    });
    const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2Mesh.rotation.x = -Math.PI / 4;
    ring2Mesh.rotation.y = -Math.PI / 6;
    ringsGroup.add(ring2Mesh);

    // Ring 3: Outer Blue/Cyan (Opacity 0.1)
    const ring3Geo = new THREE.TorusGeometry(r2, 1.2, 16, 120);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.1,
    });
    const ring3Mesh = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3Mesh.rotation.x = Math.PI / 5;
    ring3Mesh.rotation.y = -Math.PI / 4;
    ringsGroup.add(ring3Mesh);

    scene.add(ringsGroup);

    // Ambient Micro Dust Particles
    const particleCount = 20;
    const particlesGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 800;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 600;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 500;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 2,
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.25,
    });
    scene.add(new THREE.Points(particlesGeo, particlesMat));

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth || 900;
      const h = mount.clientHeight || 600;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      const canvas = canvasLinesRef.current;
      if (canvas) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [layoutConfig, isMobile, hasInitialized]);

  // ── MOUSE WHEEL ZOOM & POINTER HANDLERS ──

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * 0.35;
    targetCameraZ.current = Math.min(850, Math.max(380, targetCameraZ.current + zoomDelta));
    setZoomLevel(Math.round(targetCameraZ.current));
  };

  const handlePointerDownContainer = (e) => {
    if (e.target.closest('.tech-node-badge') || e.target.closest('.tech-info-card')) return;
    isSphereDragging.current = true;
    setIsGrabbing(true);
    lastPointer.current = { x: e.clientX, y: e.clientY };
  };

  const handleNodePointerDown = (e, nodeId) => {
    e.stopPropagation();
    activeNodeDrag.current = nodeId;
    setIsGrabbing(true);

    if (!nodeOffsets.current[nodeId]) {
      nodeOffsets.current[nodeId] = { x: 0, y: 0 };
    }

    nodeDragStart.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      offsetX: nodeOffsets.current[nodeId].x,
      offsetY: nodeOffsets.current[nodeId].y,
    };
  };

  const handlePointerMove = (e) => {
    const rect = mountRef.current?.getBoundingClientRect();
    if (rect) {
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      mouseParallax.current.targetX = px * 35;
      mouseParallax.current.targetY = py * 30;
    }

    // 1. Individual Node Dragging
    if (activeNodeDrag.current) {
      const nodeId = activeNodeDrag.current;
      const dx = e.clientX - nodeDragStart.current.pointerX;
      const dy = e.clientY - nodeDragStart.current.pointerY;

      nodeOffsets.current[nodeId] = {
        x: nodeDragStart.current.offsetX + dx,
        y: nodeDragStart.current.offsetY + dy,
      };
      return;
    }

    // 2. Sphere Dragging (Auto rotation STOPS during drag)
    if (isSphereDragging.current) {
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;

      sphereRot.current.y += dx * 0.006;
      sphereRot.current.x -= dy * 0.006;

      sphereRot.current.vy = dx * 0.0008;
      sphereRot.current.vx = -dy * 0.0008;

      lastPointer.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handlePointerUp = () => {
    isSphereDragging.current = false;
    activeNodeDrag.current = null;
    setIsGrabbing(false);
  };

  // ── 60 FPS ANIMATION LOOP (Paused when off-screen for maximum performance) ──
  useEffect(() => {
    if (!isInView) return;

    let frameId;
    let angleBase = 0;
    let time = 0;

    // 35-Second Sphere Rotation Speed: 2*PI / (35 * 60) ≈ 0.003
    const speed35s = (2 * Math.PI) / (35 * 60);

    const computePositions = () => {
      time += 0.016;

      // Camera Z Zoom Smooth Damping
      cameraZ.current += (targetCameraZ.current - cameraZ.current) * 0.08;
      if (cameraRef.current) {
        cameraRef.current.position.z = cameraZ.current;

        // Mouse Parallax Smooth Damping
        mouseParallax.current.x += (mouseParallax.current.targetX - mouseParallax.current.x) * 0.05;
        mouseParallax.current.y += (mouseParallax.current.targetY - mouseParallax.current.y) * 0.05;

        cameraRef.current.position.x = mouseParallax.current.x;
        cameraRef.current.position.y = -mouseParallax.current.y;
        cameraRef.current.lookAt(0, 0, 0);
      }

      // Auto Rotation Behavior: STOPS while dragging, RESUMES 35s rotation when released
      if (!isSphereDragging.current) {
        // Resume slow 35s rotation, now in all directions
        sphereRot.current.vy += (speed35s * 1.2 - sphereRot.current.vy) * 0.03;
        sphereRot.current.vx += (speed35s * 0.8 - sphereRot.current.vx) * 0.03;

        sphereRot.current.x += sphereRot.current.vx;
        sphereRot.current.y += sphereRot.current.vy;
      }

      angleBase += speed35s;

      // 12-Second Weightless Floating Animation Cycle
      const floatCycle = (time % 12) / 12;
      const floatY = Math.sin(floatCycle * 2 * Math.PI) * 12;

      // Update Three.js Object Rotations
      const rotX = sphereRot.current.x;
      const rotY = sphereRot.current.y;

      if (ringsGroupRef.current) {
        ringsGroupRef.current.rotation.x = rotX;
        ringsGroupRef.current.rotation.y = rotY;
        ringsGroupRef.current.rotation.z = time * 0.05;
      }

      if (coreGroupRef.current) {
        const pulse = 1 + Math.sin(time * 2) * 0.05;
        coreGroupRef.current.scale.set(pulse, pulse, pulse);
        coreGroupRef.current.rotation.y = time * 0.2;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      // Spring physics lerp for released nodes back to (0,0)
      const allSkills = layoutConfig.layers.flat();
      allSkills.forEach((s) => {
        const id = s.id || s._id || s.name;
        if (id !== activeNodeDrag.current && nodeOffsets.current[id]) {
          nodeOffsets.current[id].x *= 0.85;
          nodeOffsets.current[id].y *= 0.85;
          if (Math.abs(nodeOffsets.current[id].x) < 0.1) nodeOffsets.current[id].x = 0;
          if (Math.abs(nodeOffsets.current[id].y) < 0.1) nodeOffsets.current[id].y = 0;
        }
      });

      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      const computed = [];

      // ── DYNAMIC MATHEMATICAL 3D LAYER LAYOUT ──
      layoutConfig.layers.forEach((layerSkills, layerIdx) => {
        const layerCount = layerSkills.length;
        if (layerCount === 0) return;

        const radius = layoutConfig.radii[layerIdx] || 160;
        const layerSpeedDirection = layerIdx % 2 === 0 ? 1 : -1;
        const layerPhaseAngle = layerIdx * (Math.PI / 3);

        layerSkills.forEach((skill, i) => {
          const id = skill.id || skill._id || skill.name;

          // Special Rule: N = 2 technologies -> Opposite Positions (0 & PI)
          let theta;
          if (layerCount === 2) {
            theta = angleBase * layerSpeedDirection + (i === 0 ? 0 : Math.PI);
          } else {
            theta = angleBase * layerSpeedDirection + layerPhaseAngle + (i * 2 * Math.PI) / layerCount;
          }

          const phi = (layerIdx === 0 ? 0.3 : layerIdx === 1 ? -0.25 : 0.4) + Math.sin(i * 1.5) * 0.25;

          // 3D Position
          let x0 = radius * Math.cos(theta) * Math.cos(phi);
          let y0 = radius * Math.sin(phi) + floatY + Math.sin(theta * 2) * 20;
          let z0 = radius * Math.sin(theta) * Math.cos(phi);

          // Apply 3D Sphere Euler Rotations
          let x1 = x0 * cosY + z0 * sinY;
          let z1 = z0 * cosY - x0 * sinY;

          let y2 = y0 * cosX - z1 * sinX;
          let z2 = z1 * cosX + y0 * sinX;

          const offset = nodeOffsets.current[id] || { x: 0, y: 0 };
          const finalX = x1 + offset.x;
          const finalY = y2 + offset.y;

          const zoomFactor = layoutConfig.cameraZ / cameraZ.current;
          const scale = Math.max(0.78, ((z2 + 380) / 480) * zoomFactor);
          const alpha = Math.max(0.72, (z2 + 250) / 400);

          computed.push({
            id,
            name: skill.name,
            icon: getToolIconUrl(skill.name) || skill.iconUrl || skill.icon,
            layer: layerIdx + 1,
            x: finalX * zoomFactor,
            y: finalY * zoomFactor,
            z: z2,
            scale,
            alpha,
            isDragging: activeNodeDrag.current === id,
          });
        });
      });

      // OPTIMIZATION: Update DOM directly via refs instead of React state for 60FPS
      computed.forEach((node) => {
        const el = nodeRefs.current[node.id];
        if (el) {
          const isHovered = hoveredIdRef.current === node.id;
          const isSelected = selectedTechRef.current?.id === node.id;
          const isDragging = node.isDragging;
          
          const finalScale = isDragging ? 1.3 : (isHovered || isSelected) ? node.scale * 1.18 : node.scale;
          const finalOpacity = (isDragging || isHovered || isSelected) ? 1 : node.alpha;
          const finalZIndex = isDragging ? 999 : Math.round(node.z + 500);

          el.style.transform = `translate3d(${node.x}px, ${node.y}px, 0px) scale(${finalScale})`;
          el.style.opacity = finalOpacity;
          el.style.zIndex = finalZIndex;
        }
      });

      // OPTIMIZATION: Draw canvas directly in the RAF loop without forced reflow
      const canvas = canvasLinesRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const w = canvas.width || 900;
          const h = canvas.height || 600;
          ctx.clearRect(0, 0, w, h);
          const centerX = w / 2;
          const centerY = h / 2;

          computed.forEach((node) => {
            const isHovered = hoveredIdRef.current === node.id;
            const isSelected = selectedTechRef.current?.id === node.id;
            const isDragging = node.isDragging;
            const nodeX = centerX + node.x;
            const nodeY = centerY + node.y;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(nodeX, nodeY);
            if (isDragging || isHovered || isSelected) {
              ctx.strokeStyle = 'rgba(34, 211, 238, 0.75)';
              ctx.lineWidth = 2;
            } else {
              ctx.strokeStyle = `rgba(168, 85, 247, ${Math.min(0.12, node.alpha * 0.15)})`;
              ctx.lineWidth = 1;
            }
            ctx.stroke();
          });
        }
      }

      frameId = requestAnimationFrame(computePositions);
    };

    frameId = requestAnimationFrame(computePositions);
    return () => cancelAnimationFrame(frameId);
  }, [layoutConfig, isMobile, isInView]);

  // We no longer need the separate useEffect for canvas rendering or node state update

  // ── NEURAL LASER CONNECTIONS ON CANVAS ──
  // Handled inside the RAF loop for better performance

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDownContainer}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className={`relative w-full max-w-[1400px] h-[720px] md:h-[820px] mx-auto flex items-center justify-center select-none my-2 group/core ${
        isGrabbing ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* Three.js WebGL 3D Canvas */}
      <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* 2D Connecting Laser Lines Overlay */}
      <canvas ref={canvasLinesRef} className="absolute inset-0 z-10 pointer-events-none" />

      {/* Ambient Center Glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-r from-purple-500/15 via-cyan-500/15 to-pink-500/15 blur-[120px] pointer-events-none -z-10" />

      {/* ── CENTER AI CORE EMBLEM ── */}
      <div className="absolute z-20 flex flex-col items-center justify-center pointer-events-none">
        <div className="relative w-22 h-22 md:w-26 md:h-26 rounded-3xl bg-slate-900/90 border border-purple-500/40 backdrop-blur-2xl flex items-center justify-center shadow-xl group-hover/core:border-cyan-400 transition-colors duration-500">
          <Brain className="w-11 h-11 md:w-13 md:h-13 text-cyan-400 animate-pulse drop-shadow-[0_0_12px_rgba(34,211,238,0.7)]" />
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 blur-sm -z-10" />
        </div>
      </div>

      {/* ── 3D ORBITING & DRAGGABLE TECHNOLOGY BADGES ── */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        {layoutConfig.layers.flat().map((skill) => {
          const id = skill.id || skill._id || skill.name;
          const isHovered = hoveredId === id;
          const isSelected = selectedTech?.id === id;
          const layerIdx = layoutConfig.layers.findIndex(layer => layer.includes(skill));

          return (
            <div
              key={id}
              ref={(el) => (nodeRefs.current[id] = el)}
              onPointerDown={(e) => handleNodePointerDown(e, id)}
              onMouseEnter={() => setHoveredId(id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{ willChange: 'transform, opacity' }}
              className={`tech-node-badge absolute pointer-events-auto flex items-center gap-2.5 px-4 py-2 md:px-5 md:py-2.5 rounded-2xl border transition-colors duration-150 backdrop-blur-xl cursor-grab ${
                isHovered || isSelected
                  ? 'bg-slate-900/95 border-cyan-400 text-white shadow-[0_0_25px_rgba(34,211,238,0.4)] ring-2 ring-cyan-400/50'
                  : layerIdx === 0
                  ? 'bg-slate-900/90 border-slate-700/80 text-white hover:border-purple-400/50'
                  : 'bg-slate-900/85 border-slate-700/60 text-slate-100 hover:border-cyan-400/40'
              }`}
            >
              {(getToolIconUrl(skill.name) || skill.iconUrl || skill.icon) && (
                <img
                  src={getToolIconUrl(skill.name) || skill.iconUrl || skill.icon}
                  alt={`${skill.name} icon`}
                  width="24"
                  height="24"
                  className="w-5 h-5 md:w-6 md:h-6 object-contain shrink-0 opacity-95 pointer-events-none"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              <span className="text-xs md:text-sm font-bold tracking-wider font-mono whitespace-nowrap pointer-events-none text-slate-100">
                {skill.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

NeuralSkillsCore.displayName = 'NeuralSkillsCore';
export default NeuralSkillsCore;
