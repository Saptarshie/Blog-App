import React from 'react';

// Performance-focused ThinkingAnimation
// Key ideas:
// - All motion uses transform (GPU-accelerated) and simple opacity/scale animations
// - Removed expensive filters/backdrop-blur which can cause jank
// - Orbiting particles are rotated by a parent group using `transform-origin`
// - Added prefers-reduced-motion support

export default function ThinkingAnimation() {
  return (
    <div className="ai-thinking" aria-live="polite" aria-busy="true">
      <svg
        className="ai-core"
        viewBox="0 0 120 120"
        width="240"
        height="240"
        role="img"
        aria-label="AI is thinking"
        focusable="false"
      >
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3cf" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#0af" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#08f" stopOpacity="0.05" />
          </radialGradient>
        </defs>

        {/* central core */}
        <circle cx="60" cy="60" r="28" fill="url(#glow)" className="core" />

        {/* simple lattice (minimal nodes) */}
        <g className="lattice" aria-hidden>
          {[[30, 40], [45, 28], [75, 32], [90, 50], [84, 78], [60, 88], [38, 80], [28, 60]].map(
            ([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="1.8" className="node" />
            )
          )}
          <polyline
            points="30,40 45,28 75,32 90,50 84,78 60,88 38,80 28,60 30,40"
            fill="none"
            className="wire"
          />
        </g>

        {/* orbit groups: rotate the group; particle positioned with translate on x axis */}
        <g className="orbit-group orbit-a" style={{ transformOrigin: '60px 60px' }}>
          <g className="particle-wrap">
            <circle className="particle particle-a" cx="60" cy="60" r="2.4" />
          </g>
        </g>

        <g className="orbit-group orbit-b" style={{ transformOrigin: '60px 60px' }}>
          <g className="particle-wrap">
            <circle className="particle particle-b" cx="60" cy="60" r="2.4" />
          </g>
        </g>
      </svg>

      <div className="ai-text" aria-hidden>
        <span className="dot dot1">●</span>
        <span className="dot dot2">●</span>
        <span className="dot dot3">●</span>
        <span className="label">AI is thinking</span>
      </div>

      <style>{`
        /* Container */
        .ai-thinking{
          display:inline-flex;
          gap:12px;
          align-items:center;
          user-select:none;
          -webkit-font-smoothing:antialiased;
        }

        /* SVG core sizing */
        .ai-core{
          display:block;
          will-change:transform, opacity;
          backface-visibility:hidden;
        }

        /* Core subtle breathing (use transform + opacity only) */
        .core{
          transform-origin:60px 60px;
          will-change:transform, opacity;
          animation: core-breathe 2800ms ease-in-out infinite;
        }

        @keyframes core-breathe{
          0%{ transform: scale(1); opacity:1; }
          50%{ transform: scale(1.04); opacity:0.95; }
          100%{ transform: scale(1); opacity:1; }
        }

        /* lattice appearance (static) */
        .lattice .node{ fill:#bfe; opacity:0.95; }
        .lattice .wire{ stroke:#8fd; stroke-width:0.8; opacity:0.6; vector-effect: non-scaling-stroke; }

        /* Orbit groups rotate the entire group (GPU friendly) */
        .orbit-group{
          transform-origin:60px 60px;
          will-change:transform;
        }

        .orbit-a{ animation: orbit-rotate-a 4200ms linear infinite; }
        .orbit-b{ animation: orbit-rotate-b 6400ms linear infinite reverse; }

        @keyframes orbit-rotate-a{ to{ transform: rotate(360deg); } }
        @keyframes orbit-rotate-b{ to{ transform: rotate(360deg); } }

        /* particle-wrap positions the particle using translateX (no layout thrash) */
        .particle-wrap{ transform: translate(60px, 60px); }
        .orbit-a .particle-wrap{ transform: translate(60px, 60px) translateX(-22px); }
        .orbit-b .particle-wrap{ transform: translate(60px, 60px) translateX(-30px); }

        /* particles: small pulse and fade using opacity/scale */
        .particle{
          transform-origin: center;
          will-change:transform, opacity;
          fill: #9ff;
          opacity:0.95;
          animation: particle-pulse 1600ms ease-in-out infinite;
        }
        .particle-b{ animation-duration:2000ms; }

        @keyframes particle-pulse{
          0%{ transform: scale(1); opacity:0.95; }
          50%{ transform: scale(1.45); opacity:0.6; }
          100%{ transform: scale(1); opacity:0.95; }
        }

        /* text and dots (use transforms) */
        .ai-text{ display:flex; gap:6px; align-items:center; font-family:Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue'; color:#bfe; }
        .ai-text .label{ font-size:14px; opacity:0.95; }
        .ai-text .dot{ font-size:12px; line-height:1; transform-origin:center; will-change:transform, opacity; animation: dot-bounce 900ms ease-in-out infinite; opacity:0.9; }
        .ai-text .dot2{ animation-delay:150ms; }
        .ai-text .dot3{ animation-delay:300ms; }

        @keyframes dot-bounce{
          0%{ transform: translateY(0) scale(1); opacity:0.9 }
          50%{ transform: translateY(-6px) scale(1.1); opacity:1 }
          100%{ transform: translateY(0) scale(1); opacity:0.9 }
        }

        /* Accessibility: respect reduced motion */
        @media (prefers-reduced-motion: reduce){
          .core, .orbit-group, .particle, .dot{ animation: none !important; }
        }

        /* Performance tips for host page (document-level) */
        /* Avoid heavy CSS like backdrop-filter or large box-shadow on this element to reduce compositing cost.
           If you do need glow, prefer SVG gradients or subtle outer glows with pseudo-elements kept small. */
      `}</style>
    </div>
  );
}
