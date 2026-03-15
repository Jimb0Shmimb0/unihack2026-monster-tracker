"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Nav from "@/components/Nav";

// ─── Flavor data with 3D coordinates ─────────────────────────────────────────
// Axes: X = Fruity ← 0 → Earthy/Coffee
//       Y = Light  ← 0 → Intense/Bold
//       Z = Sweet  ← 0 → Sharp/Citrus
const MONSTERS = [
  {
    id: 1, name: "Monster Original", variant: "Green", category: "original",
    accentColor: "#39d353",
    image: "https://productimages.coles.com.au/productimages/2/2787136.jpg",
    notes: ["Herbal", "Citrus Zest", "Tart Apple", "Earthy Finish"],
    pos: [0.55, 0.80, 0.40],
    desc: "The O.G. — herbal citrus tart with a punchy, earthy backbone.",
  },
  {
    id: 2, name: "Monster Ultra White", variant: "Ultra White", category: "ultra",
    accentColor: "#e8e8e8",
    image: "https://productimages.coles.com.au/productimages/2/2787147.jpg",
    notes: ["Crisp Citrus", "White Grape", "Light Floral", "Clean Finish"],
    pos: [0.30, 0.15, 0.55],
    desc: "Delicate and effervescent — white grape and citrus blossom.",
  },
  {
    id: 3, name: "Monster Ultra Paradise", variant: "Ultra Paradise", category: "ultra",
    accentColor: "#00e5a0",
    image: "https://productimages.coles.com.au/productimages/3/3535285.jpg",
    notes: ["Kiwi", "Tropical Mist", "Cucumber Cool", "Minty Lift"],
    pos: [0.20, 0.20, 0.30],
    desc: "A tropical breeze — kiwi, cucumber, and a whisper of mint.",
  },
  {
    id: 5, name: "Monster Ultra Fiesta", variant: "Ultra Fiesta Mango", category: "ultra",
    accentColor: "#ffe033",
    image: "https://productimages.coles.com.au/productimages/4/4402516.jpg",
    notes: ["Ripe Mango", "Papaya", "Lime Edge", "Sun-Dried Sweet"],
    pos: [0.15, 0.25, 0.70],
    desc: "Sunshine in a can — ripe mango, papaya with a lime kick.",
  },
  {
    id: 7, name: "Monster Juiced Mango Loco", variant: "Mango Loco", category: "juice",
    accentColor: "#ff6b1a",
    image: "https://productimages.coles.com.au/productimages/3/3290778.jpg",
    notes: ["Wild Mango", "Passionfruit", "Orange Pulp", "Nectar Sweet"],
    pos: [0.10, 0.55, 0.80],
    desc: "Tropical madness — wild mango pulp and passionfruit nectar.",
  },
  {
    id: 8, name: "Monster Pipeline Punch", variant: "Pipeline Punch", category: "juice",
    accentColor: "#ff9933",
    image: "https://productimages.coles.com.au/productimages/3/3511469.jpg",
    notes: ["Guava", "Orange", "Pineapple", "Passion Cream"],
    pos: [0.05, 0.65, 0.85],
    desc: "Hawaiian-wave juice — guava, orange, and pineapple cream.",
  },
  {
    id: 15, name: "Monster Java Mean Bean", variant: "Mean Bean", category: "java",
    accentColor: "#8B4513",
    image: "https://productimages.coles.com.au/productimages/7/7071539.jpg",
    notes: ["Dark Roast", "Vanilla Cream", "Caramel", "Mild Cocoa"],
    pos: [0.90, 0.70, 0.60],
    desc: "Coffee shop in a can — dark roast with caramel vanilla.",
  },
  {
    id: 16, name: "Monster Java Loca Mocha", variant: "Loca Mocha", category: "java",
    accentColor: "#3a1a0a",
    image: "https://productimages.coles.com.au/productimages/7/7071540.jpg",
    notes: ["Espresso", "Dark Chocolate", "Hazelnut", "Rich Cream"],
    pos: [0.92, 0.85, 0.50],
    desc: "Bold mocha madness — espresso, dark choc, and hazelnut.",
  },
  {
    id: 17, name: "Monster Ultra Gold", variant: "Ultra Gold", category: "ultra",
    accentColor: "#ffd700",
    image: "https://productimages.coles.com.au/productimages/5/5155220.jpg",
    notes: ["Golden Pineapple", "Yuzu", "Honey Dew", "Crisp Finish"],
    pos: [0.22, 0.18, 0.62],
    desc: "Golden citrus — pineapple and yuzu with a honeydew tail.",
  },
  {
    id: 18, name: "Monster Ultra Violet", variant: "Ultra Violet", category: "ultra",
    accentColor: "#8b5cf6",
    image: "https://productimages.coles.com.au/productimages/8/8593020.jpg",
    notes: ["Grape Soda", "Lavender", "Black Currant", "Floral Berry"],
    pos: [0.25, 0.28, 0.45],
    desc: "Dreamy grape and lavender — floral, dark berry vibes.",
  },
  {
    id: 19, name: "Monster Ultra Ruby Red", variant: "Ultra Ruby Red", category: "ultra",
    accentColor: "#dc143c",
    image: "https://productimages.coles.com.au/productimages/9/9965141.jpg",
    notes: ["Ruby Grapefruit", "Blood Orange", "Hibiscus", "Tart Berry"],
    pos: [0.28, 0.22, 0.25],
    desc: "Ruby-red citrus punch — grapefruit, hibiscus, blood orange.",
  },
  {
    id: 20, name: "Monster Aussie Lemonade", variant: "Aussie Style Lemonade", category: "juice",
    accentColor: "#b8e04a",
    image: "https://snackje.com/cdn/shop/files/Monster-Juiced-Aussie-Lemonade-500ml.png",
    notes: ["Cloudy Lemon", "Sherbet", "Green Apple", "Sunny Zest"],
    pos: [0.18, 0.45, 0.15],
    desc: "G'day sunshine — cloudy lemonade with sherbet and green apple.",
  },
  {
    id: 21, name: "Monster Juiced Rio Punch", variant: "Rio Punch", category: "juice",
    accentColor: "#ff3030",
    image: "https://www.bestwaywholesale.co.uk/img/products/1000/0/5056784900420.jpg",
    notes: ["Acai", "Dragon Fruit", "Cherry Burst", "Tropical Berry"],
    pos: [0.12, 0.60, 0.72],
    desc: "Rio carnival energy — acai, dragon fruit, and cherry burst.",
  },
  {
    id: 22, name: "Monster x Lando Norris", variant: "Limited Edition", category: "ultra",
    accentColor: "#ff6900",
    image: "https://cdn0.woolworths.media/content/wowproductimages/large/6057776.jpg",
    notes: ["Tangerine", "Ginger Bite", "Citrus Speed", "Electric Orange"],
    pos: [0.32, 0.35, 0.20],
    desc: "McLaren pace — tangerine and ginger with electric citrus fire.",
  },
  {
    id: 23, name: "Monster Ultra Vice Guava", variant: "Ultra Vice Guava", category: "ultra",
    accentColor: "#ff69b4",
    image: "https://productimages.coles.com.au/productimages/1/1308012.jpg",
    notes: ["Pink Guava", "Lychee", "Rose Water", "Candy Floss"],
    pos: [0.08, 0.10, 0.65],
    desc: "Pastel paradise — pink guava, lychee, and rose-water candy.",
  },
  {
    id: 24, name: "Monster Ultra Strawberry Dreams", variant: "Ultra Strawberry Dreams", category: "ultra",
    accentColor: "#ff8fa3",
    image: "https://productimages.coles.com.au/productimages/7/7717127.jpg",
    notes: ["Ripe Strawberry", "Cream Soda", "Vanilla", "Soft Berry"],
    pos: [0.12, 0.12, 0.75],
    desc: "Summer dream — ripe strawberry with cream soda and vanilla.",
  },
  {
    id: 25, name: "Monster Ultra Peachy Keen", variant: "Ultra Peachy Keen", category: "ultra",
    accentColor: "#ffb347",
    image: "https://productimages.coles.com.au/productimages/6/6413422.jpg",
    notes: ["White Peach", "Apricot", "Honey Nectar", "Soft Floral"],
    pos: [0.18, 0.08, 0.70],
    desc: "Orchard bliss — white peach, apricot, and light honey nectar.",
  },
];

const CATEGORY_LABELS = {
  original: "Original",
  ultra: "Ultra (Sugar-Free)",
  juice: "Juice",
  java: "Java Coffee",
};

// ─── 3D math helpers ──────────────────────────────────────────────────────────
function rotateX(point, angle) {
  const [x, y, z] = point;
  return [x, y * Math.cos(angle) - z * Math.sin(angle), y * Math.sin(angle) + z * Math.cos(angle)];
}
function rotateY(point, angle) {
  const [x, y, z] = point;
  return [x * Math.cos(angle) + z * Math.sin(angle), y, -x * Math.sin(angle) + z * Math.cos(angle)];
}
function project(point, fov = 3.5) {
  const [x, y, z] = point;
  const scale = fov / (fov + z);
  return [x * scale, y * scale, scale];
}

// ─── Axis grid component ──────────────────────────────────────────────────────
function AxisGrid({ rotX, rotY, size = 300, zoom = 1 }) {
  const lines = [];
  const corners = [
    [0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0],
    [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1],
  ];
  const edges = [
    [0,1],[2,3],[4,5],[6,7],
    [0,2],[1,3],[4,6],[5,7],
    [0,4],[1,5],[2,6],[3,7],
  ];

  function transform(p) {
    const centered = [p[0] - 0.5, p[1] - 0.5, p[2] - 0.5];
    const r1 = rotateX(centered, rotX);
    const r2 = rotateY(r1, rotY);
    const [px, py] = project(r2);
    return [px * size * zoom + size / 2, py * size * zoom + size / 2];
  }

  edges.forEach(([a, b], i) => {
    const [ax, ay] = transform(corners[a]);
    const [bx, by] = transform(corners[b]);
    lines.push(
      <line key={i} x1={ax} y1={ay} x2={bx} y2={by}
        stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" />
    );
  });

  // Axis labels
  const axisLabels = [
    { point: [1.15, 0.5, 0.5], label: "Earthy / Coffee →", color: "#a16207" },
    { point: [-0.15, 0.5, 0.5], label: "← Fruity", color: "#16a34a" },
    { point: [0.5, -0.15, 0.5], label: "← Light", color: "#94a3b8" },
    { point: [0.5, 1.15, 0.5], label: "Bold →", color: "#ef4444" },
    { point: [0.5, 0.5, 1.15], label: "Sweet →", color: "#ec4899" },
    { point: [0.5, 0.5, -0.15], label: "← Sharp/Citrus", color: "#22d3ee" },
  ];

  // Three dotted axis lines through the cube centre
  const axisPairs = [
    { a: [-0.1, 0.5, 0.5], b: [1.1, 0.5, 0.5], color: "#a16207" },  // X: Fruity–Earthy
    { a: [0.5, -0.1, 0.5], b: [0.5, 1.1, 0.5], color: "#94a3b8" },  // Y: Light–Bold
    { a: [0.5, 0.5, -0.1], b: [0.5, 0.5, 1.1], color: "#ec4899" },  // Z: Citrus–Sweet
  ];

  const axisLines = axisPairs.map(({ a, b, color }, i) => {
    const [ax, ay] = transform(a);
    const [bx, by] = transform(b);
    return (
      <line key={`axis-${i}`} x1={ax} y1={ay} x2={bx} y2={by}
        stroke={color} strokeWidth="1.2" strokeDasharray="5 5" opacity="0.5"
        strokeLinecap="round" />
    );
  });

  return (
    <svg width={size} height={size} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
      {lines}
      {axisLines}
      {axisLabels.map(({ point, label, color }, i) => {
        const centered = [point[0] - 0.5, point[1] - 0.5, point[2] - 0.5];
        const r1 = rotateX(centered, rotX);
        const r2 = rotateY(r1, rotY);
        const [px, py] = project(r2);
        const sx = px * size * zoom + size / 2;
        const sy = py * size * zoom + size / 2;
        return (
          <text key={i} x={sx} y={sy} fill={color} fontSize="11" fontFamily="'Courier New', monospace"
            textAnchor="middle" dominantBaseline="middle" opacity="0.92"
            style={{ pointerEvents: "none" }}>
            {label}
          </text>
        );
      })}
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function MonsterFlavorMap() {
  const [rotX, setRotX] = useState(-0.4);
  const [rotY, setRotY] = useState(0.5);
  const [dragging, setDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState(null);
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [filterCat, setFilterCat] = useState("all");
  const [autoRotate, setAutoRotate] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [favourites, setFavourites] = useState(new Set());
  const animRef = useRef();
  const containerRef = useRef();
  const pinchRef = useRef(null);

  const SIZE = 520;
  const DOT_SIZE = 38;
  const ZOOM_MIN = 0.35;
  const ZOOM_MAX = 3.5;

  // Auto-rotate
  useEffect(() => {
    if (!autoRotate || dragging) return;
    const tick = () => {
      setRotY(y => y + 0.003);
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [autoRotate, dragging]);

  const onMouseDown = useCallback((e) => {
    setDragging(true);
    setLastMouse([e.clientX, e.clientY]);
    setAutoRotate(false);
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!dragging || !lastMouse) return;
    const dx = e.clientX - lastMouse[0];
    const dy = e.clientY - lastMouse[1];
    setRotY(r => r + dx * 0.008);
    setRotX(r => r + dy * 0.008);
    setLastMouse([e.clientX, e.clientY]);
  }, [dragging, lastMouse]);

  const onMouseUp = useCallback(() => setDragging(false), []);

  // Scroll-wheel zoom
  const onWheel = useCallback((e) => {
    e.preventDefault();
    setAutoRotate(false);
    setZoom(z => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z * (1 - e.deltaY * 0.001))));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  // Touch support
  const onTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchRef.current = Math.hypot(dx, dy);
      return;
    }
    const t = e.touches[0];
    setDragging(true);
    setLastMouse([t.clientX, t.clientY]);
    setAutoRotate(false);
  }, []);
  const onTouchMove = useCallback((e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      if (pinchRef.current !== null) {
        const ratio = dist / pinchRef.current;
        setZoom(z => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z * ratio)));
      }
      pinchRef.current = dist;
      return;
    }
    if (!dragging || !lastMouse) return;
    const t = e.touches[0];
    const dx = t.clientX - lastMouse[0];
    const dy = t.clientY - lastMouse[1];
    setRotY(r => r + dx * 0.008);
    setRotX(r => r + dy * 0.008);
    setLastMouse([t.clientX, t.clientY]);
  }, [dragging, lastMouse]);

  // Transform and project all points
  const transformed = MONSTERS.map(m => {
    const centered = [m.pos[0] - 0.5, m.pos[1] - 0.5, m.pos[2] - 0.5];
    const r1 = rotateX(centered, rotX);
    const r2 = rotateY(r1, rotY);
    const [px, py, scale] = project(r2);
    return {
      ...m,
      sx: px * SIZE * zoom + SIZE / 2,
      sy: py * SIZE * zoom + SIZE / 2,
      scale: scale * zoom,
      depth: r2[2],
    };
  }).sort((a, b) => a.depth - b.depth);

  // Compute the user's flavour profile node (average of favourites)
  const favMonsters = MONSTERS.filter(m => favourites.has(m.id));
  const profilePos = favMonsters.length > 0
    ? favMonsters.reduce((acc, m) => [acc[0] + m.pos[0], acc[1] + m.pos[1], acc[2] + m.pos[2]], [0, 0, 0])
        .map(v => v / favMonsters.length)
    : null;

  const profileNode = profilePos ? (() => {
    const centered = [profilePos[0] - 0.5, profilePos[1] - 0.5, profilePos[2] - 0.5];
    const r1 = rotateX(centered, rotX);
    const r2 = rotateY(r1, rotY);
    const [px, py, scale] = project(r2);
    return {
      sx: px * SIZE * zoom + SIZE / 2,
      sy: py * SIZE * zoom + SIZE / 2,
      scale: scale * zoom,
      depth: r2[2],
    };
  })() : null;

  // Toggle favourite
  const toggleFavourite = useCallback((id) => {
    setFavourites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const filtered = filterCat === "all" ? transformed : transformed.filter(m => m.category === filterCat);

  const sel = selected ? MONSTERS.find(m => m.id === selected) : null;

  return (
    <>
    <Nav />
    <div style={{
      minHeight: "100vh",
      background: "#080808",
      color: "#fff",
      fontFamily: "var(--font-grotesk), sans-serif",
      padding: "40px 0 80px",
      userSelect: "none",
    }}>

      {/* Page header */}
      <div style={{
        padding: "0 40px 32px",
        borderBottom: "1px solid #1a1a1a",
        marginBottom: 32,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 8,
      }}>
        <div>
          <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10, letterSpacing: "0.15em", color: "#39d353", fontWeight: 400, marginBottom: 6, textTransform: "uppercase" }}>
            // FLAVOUR TOPOLOGY
          </p>
          <div style={{
            fontSize: "clamp(20px, 3vw, 28px)",
            fontFamily: "var(--font-grotesk), sans-serif",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            color: "#fff",
            lineHeight: 1,
          }}>
            Flavour Map
          </div>
        </div>
        <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10, color: "#444", letterSpacing: "0.08em", paddingBottom: 2 }}>
          {MONSTERS.length} VARIETIES · DRAG TO ROTATE · SCROLL TO ZOOM
        </div>
      </div>

      {/* Controls bar */}
      <div style={{ padding: "0 40px", marginBottom: 24, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10, letterSpacing: "0.15em", color: "#39d353", marginRight: 8 }}>// FILTER</p>
        {[["all", "ALL", "#39d353"], ["original", "ORIGINAL", "#39d353"], ["ultra", "ULTRA", "#e8e8e8"], ["juice", "JUICE", "#ff6b1a"], ["java", "JAVA", "#8B4513"]].map(([cat, label, color]) => (
          <button key={cat} onClick={() => setFilterCat(cat)} style={{
            background: filterCat === cat ? color : "transparent",
            color: filterCat === cat ? "#000" : color,
            border: `1px solid ${filterCat === cat ? color : color + "66"}`,
            borderRadius: 2,
            padding: "5px 12px",
            fontSize: 10,
            letterSpacing: "0.15em",
            cursor: "pointer",
            fontFamily: "var(--font-mono), monospace",
            transition: "all 0.15s",
            fontWeight: filterCat === cat ? 700 : 400,
          }}>{label}</button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => setAutoRotate(r => !r)} style={{
            background: "transparent",
            color: autoRotate ? "#39d353" : "#444",
            border: `1px solid ${autoRotate ? "#39d35344" : "#2a2a2a"}`,
            borderRadius: 2,
            padding: "5px 12px",
            fontSize: 10,
            letterSpacing: "0.15em",
            cursor: "pointer",
            fontFamily: "var(--font-mono), monospace",
            transition: "all 0.15s",
          }}>{autoRotate ? "⏸ PAUSE" : "▶ ROTATE"}</button>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <button onClick={() => setZoom(z => Math.max(ZOOM_MIN, z * 0.8))} style={{
              background: "#141414", border: "1px solid #2a2a2a", color: "#fff",
              width: 32, height: 32, borderRadius: 2, fontSize: 16, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-mono), monospace",
            }}>−</button>
            <button onClick={() => setZoom(1)} style={{
              background: "#141414", color: "#888", border: "1px solid #2a2a2a",
              borderRadius: 2, padding: "0 8px", height: 32, fontSize: 10, cursor: "pointer",
              fontFamily: "var(--font-mono), monospace", letterSpacing: "0.1em", minWidth: 48,
            }}>{Math.round(zoom * 100)}%</button>
            <button onClick={() => setZoom(z => Math.min(ZOOM_MAX, z * 1.25))} style={{
              background: "#141414", border: "1px solid #2a2a2a", color: "#fff",
              width: 32, height: 32, borderRadius: 2, fontSize: 16, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-mono), monospace",
            }}>+</button>
          </div>
        </div>
      </div>

      {/* 3D Map + Info panel */}
      <div style={{ padding: "0 40px", display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div
          ref={containerRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={() => setDragging(false)}
          style={{
            position: "relative",
            width: SIZE,
            height: SIZE,
            cursor: dragging ? "grabbing" : "grab",
            flexShrink: 0,
            background: "#0d0d0d",
            border: "1px solid #1c1c1c",
            borderRadius: 2,
          }}
        >
          {/* Axis grid */}
          <AxisGrid rotX={rotX} rotY={rotY} size={SIZE} zoom={zoom} />

          {/* Centre-lines: coloured spokes from each dot to the cube centre */}
          <svg width={SIZE} height={SIZE} style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}>
            <defs>
              {transformed.map(m => (
                <linearGradient key={`lg-${m.id}`} id={`lg-${m.id}`}
                  gradientUnits="userSpaceOnUse"
                  x1={SIZE / 2} y1={SIZE / 2} x2={m.sx} y2={m.sy}>
                  <stop offset="0%" stopColor={m.accentColor} stopOpacity="0" />
                  <stop offset="100%" stopColor={m.accentColor} stopOpacity="0.7" />
                </linearGradient>
              ))}
            </defs>
            {transformed.map(m => {
              const inFilter = filterCat === "all" || m.category === filterCat;
              const isSelected = selected === m.id;
              const isHovered = hovered === m.id;
              return (
                <line
                  key={`spoke-${m.id}`}
                  x1={SIZE / 2} y1={SIZE / 2}
                  x2={m.sx} y2={m.sy}
                  stroke={`url(#lg-${m.id})`}
                  strokeWidth={isSelected ? 2 : isHovered ? 1.5 : 0.9}
                  opacity={inFilter ? (isSelected || isHovered ? 1 : 0.45) : 0.07}
                  strokeLinecap="round"
                />
              );
            })}
            <circle cx={SIZE / 2} cy={SIZE / 2} r={3} fill="#ffffff" opacity="0.2" />


          </svg>

          {/* Flavor nodes */}
          {filtered.map(m => {
            const isSelected = selected === m.id;
            const isHovered = hovered === m.id;
            const dotSize = DOT_SIZE * m.scale * (isSelected ? 1.3 : isHovered ? 1.15 : 1);
            const opacity = filterCat !== "all" && m.category !== filterCat ? 0.12 : 1;

            return (
              <div
                key={m.id}
                onClick={() => setSelected(selected === m.id ? null : m.id)}
                onMouseEnter={() => setHovered(m.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  position: "absolute",
                  left: m.sx - dotSize / 2,
                  top: m.sy - dotSize / 2,
                  width: dotSize,
                  height: dotSize,
                  borderRadius: "50%",
                  border: `${isSelected ? 2.5 : 1.5}px solid ${m.accentColor}`,
                  background: isSelected
                    ? `radial-gradient(circle, ${m.accentColor}55, ${m.accentColor}22)`
                    : `radial-gradient(circle, ${m.accentColor}33, ${m.accentColor}11)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "width 0.15s, height 0.15s, left 0.05s, top 0.05s",
                  zIndex: Math.round(m.depth * 100) + 100,
                  opacity,
                  boxShadow: isSelected
                    ? `0 0 16px ${m.accentColor}88, 0 0 32px ${m.accentColor}33`
                    : isHovered
                      ? `0 0 10px ${m.accentColor}66`
                      : `0 0 6px ${m.accentColor}33`,
                }}
              >
                <img
                  src={m.image}
                  alt={m.name}
                  style={{ width: "75%", height: "75%", objectFit: "contain", borderRadius: "50%", pointerEvents: "none" }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
                {(isHovered || isSelected) && (
                  <div style={{
                    position: "absolute",
                    bottom: "110%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#0d0d0d",
                    border: `1px solid ${m.accentColor}66`,
                    borderRadius: 2,
                    padding: "3px 8px",
                    fontSize: 10,
                    whiteSpace: "nowrap",
                    color: m.accentColor,
                    letterSpacing: "0.06em",
                    fontFamily: "var(--font-mono), monospace",
                    pointerEvents: "none",
                    zIndex: 999,
                  }}>
                    {m.variant}
                  </div>
                )}
              </div>
            );
          })}

          {!dragging && (
            <div style={{
              position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)",
              fontSize: 9, color: "#2a2a2a", letterSpacing: "0.1em", pointerEvents: "none",
              fontFamily: "var(--font-mono), monospace",
            }}>
              DRAG TO ROTATE
            </div>
          )}

          {/* Profile node */}
          {profileNode && (() => {
            const size = 44 * profileNode.scale;
            return (
              <div style={{
                position: "absolute",
                left: profileNode.sx - size / 2,
                top: profileNode.sy - size / 2,
                width: size,
                height: size,
                zIndex: Math.round(profileNode.depth * 100) + 200,
                pointerEvents: "none",
              }}>
                {/* Pulsing rings */}
                <div style={{
                  position: "absolute", inset: -8,
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.15)",
                  animation: "profilePulse 2s ease-in-out infinite",
                }} />
                <div style={{
                  position: "absolute", inset: -16,
                  borderRadius: "50%",
                  border: "1px solid rgba(255,255,255,0.07)",
                  animation: "profilePulse 2s ease-in-out infinite 0.4s",
                }} />
                {/* Core */}
                <div style={{
                  width: "100%", height: "100%",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(255,255,255,0.9), rgba(255,255,255,0.3))",
                  border: "2px solid #fff",
                  boxShadow: "0 0 20px rgba(255,255,255,0.6), 0 0 40px rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: size * 0.4,
                  lineHeight: 1,
                }}>
                  ★
                </div>
                {/* Label */}
                <div style={{
                  position: "absolute",
                  top: "110%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  marginTop: 4,
                  background: "#0d0d0d",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 2,
                  padding: "3px 8px",
                  fontSize: 9,
                  whiteSpace: "nowrap",
                  color: "#fff",
                  letterSpacing: "0.1em",
                  fontFamily: "var(--font-mono), monospace",
                }}>
                  YOUR PROFILE
                </div>
              </div>
            );
          })()}
        </div>

        {/* Info panel */}
        <div style={{ flex: "1 1 240px", minWidth: 220 }}>
          {sel ? (
            <div style={{
              background: "#0d0d0d",
              border: `1px solid ${sel.accentColor}44`,
              borderRadius: 2,
              padding: 20,
              animation: "fadeUp 0.2s ease both",
            }}>
              <img src={sel.image} alt={sel.name}
                style={{ width: "100%", height: 140, objectFit: "contain", marginBottom: 16 }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10, letterSpacing: "0.15em", color: sel.accentColor, marginBottom: 6 }}>
                // {CATEGORY_LABELS[sel.category]?.toUpperCase()}
              </p>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#ccc", marginBottom: 8, lineHeight: 1.2, fontFamily: "var(--font-grotesk), sans-serif" }}>
                {sel.name}
              </div>
              <div style={{ fontSize: 12, color: "#555", marginBottom: 16, lineHeight: 1.6, fontFamily: "var(--font-mono), monospace" }}>
                {sel.desc}
              </div>
              <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10, letterSpacing: "0.15em", color: "#333", marginBottom: 8 }}>
                // FLAVOUR NOTES
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 16 }}>
                {sel.notes.map(n => (
                  <span key={n} style={{
                    background: `${sel.accentColor}11`,
                    border: `1px solid ${sel.accentColor}44`,
                    borderRadius: 2,
                    padding: "3px 8px",
                    fontSize: 10,
                    color: sel.accentColor,
                    fontFamily: "var(--font-mono), monospace",
                    letterSpacing: "0.06em",
                  }}>{n}</span>
                ))}
              </div>
              <button onClick={() => setSelected(null)} style={{
                background: "transparent",
                border: "1px solid #2a2a2a",
                color: "#444",
                borderRadius: 2,
                padding: "6px 14px",
                fontSize: 10,
                cursor: "pointer",
                fontFamily: "var(--font-mono), monospace",
                letterSpacing: "0.12em",
                transition: "border-color 0.2s, color 0.2s",
              }}>[ CLOSE ]</button>
            </div>
          ) : (
            <div style={{ background: "#0d0d0d", border: "1px solid #1c1c1c", borderRadius: 2, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10, letterSpacing: "0.15em", color: "#39d353" }}>
                  // MY PROFILE
                </p>
                {favourites.size > 0 && (
                  <button onClick={() => setFavourites(new Set())} style={{
                    background: "transparent", border: "1px solid #2a2a2a", color: "#444",
                    borderRadius: 2, padding: "3px 10px", fontSize: 10, cursor: "pointer",
                    fontFamily: "var(--font-mono), monospace", letterSpacing: "0.1em",
                  }}>[ CLEAR ]</button>
                )}
              </div>

              {favourites.size === 0 && (
                <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: 11, color: "#2a2a2a", lineHeight: 1.8, letterSpacing: "0.05em", marginBottom: 16 }}>
                  _ star your favourites<br />to plot your profile
                </p>
              )}

              {favourites.size > 0 && (() => {
                const avgPos = favMonsters.reduce((acc, m) => [acc[0] + m.pos[0], acc[1] + m.pos[1], acc[2] + m.pos[2]], [0,0,0]).map(v => v / favMonsters.length);
                const allNotes = [...new Set(favMonsters.flatMap(m => m.notes))].slice(0, 6);
                const dominantCat = Object.entries(
                  favMonsters.reduce((acc, m) => { acc[m.category] = (acc[m.category] || 0) + 1; return acc; }, {})
                ).sort((a, b) => b[1] - a[1])[0][0];
                return (
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: 9, color: "#333", letterSpacing: "0.15em", marginBottom: 6 }}>// COORDINATES</p>
                    <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
                      {[["X", avgPos[0], "#a16207"], ["Y", avgPos[1], "#ef4444"], ["Z", avgPos[2], "#ec4899"]].map(([axis, val, color]) => (
                        <div key={axis}>
                          <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 9, color, fontWeight: 700 }}>{axis} </span>
                          <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 13, color: "#888", fontWeight: 700 }}>{val.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: 9, color: "#333", letterSpacing: "0.15em", marginBottom: 6 }}>// DOMINANT</p>
                    <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: 11, color: "#888", marginBottom: 14 }}>{CATEGORY_LABELS[dominantCat]}</p>
                    <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: 9, color: "#333", letterSpacing: "0.15em", marginBottom: 6 }}>// TOP NOTES</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {allNotes.map(n => (
                        <span key={n} style={{
                          background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: 2, padding: "2px 8px", fontSize: 10, color: "#666",
                          fontFamily: "var(--font-mono), monospace", letterSpacing: "0.06em",
                        }}>{n}</span>
                      ))}
                    </div>
                  </div>
                );
              })()}

              <div style={{ borderTop: "1px solid #141414", paddingTop: 14, display: "flex", flexDirection: "column", gap: 6, maxHeight: 320, overflowY: "auto" }}>
                {MONSTERS.map(m => {
                  const isFav = favourites.has(m.id);
                  return (
                    <div key={m.id} onClick={() => toggleFavourite(m.id)} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "7px 10px", cursor: "pointer", borderRadius: 2,
                      border: `1px solid ${isFav ? m.accentColor + "55" : "#141414"}`,
                      background: isFav ? "#111" : "transparent",
                      transition: "all 0.15s",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 5, height: 5, background: m.accentColor, flexShrink: 0 }} />
                        <span style={{ fontSize: 11, fontWeight: 500, color: isFav ? "#ccc" : "#444", fontFamily: "var(--font-grotesk), sans-serif" }}>
                          {m.name}
                        </span>
                      </div>
                      <span style={{ fontSize: 13, color: isFav ? m.accentColor : "#2a2a2a", transition: "color 0.15s", flexShrink: 0 }}>★</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom count */}
      <div style={{ padding: "20px 40px 0", fontFamily: "var(--font-mono), monospace", fontSize: 10, color: "#2a2a2a", letterSpacing: "0.15em" }}>
        {filtered.length} / {MONSTERS.length} VARIETIES DISPLAYED
      </div>

      {/* Legend + axes — moved to bottom */}
      <div style={{ padding: "48px 40px 0", width: "100%" }}>
        <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 32, display: "flex", gap: 48, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10, letterSpacing: "0.15em", color: "#39d353", marginBottom: 16 }}>
              // LEGEND
            </p>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {Object.entries(CATEGORY_LABELS).map(([cat, label]) => {
                const sample = MONSTERS.find(m => m.category === cat);
                return (
                  <div key={cat} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 6, height: 6, background: sample?.accentColor || "#fff", flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "#888", fontFamily: "var(--font-grotesk), sans-serif", fontWeight: 500 }}>{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10, letterSpacing: "0.15em", color: "#333", marginBottom: 16 }}>
              // AXES
            </p>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
              {[
                ["X", "Fruity ↔ Earthy/Coffee", "#a16207"],
                ["Y", "Light ↔ Bold/Intense", "#ef4444"],
                ["Z", "Sharp/Citrus ↔ Sweet", "#ec4899"],
              ].map(([axis, desc, color]) => (
                <div key={axis} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 11, color, fontWeight: 700, fontFamily: "var(--font-mono), monospace" }}>{axis}</span>
                  <span style={{ fontSize: 11, color: "#444", fontFamily: "var(--font-mono), monospace" }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        @keyframes profilePulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(1.15); }
        }
      `}</style>
    </div>
    </>
  );
}
