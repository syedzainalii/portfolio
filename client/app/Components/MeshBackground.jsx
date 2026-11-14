"use client";

import { useEffect, useRef } from "react";

const DESKTOP_STEP = 34;
const MOBILE_STEP = 52;
const HOT = ["", "56,189,248", "52,211,153", "250,204,21", "251,146,60", "239,68,68"];
const HOT_ALPHA = [0, 0.55, 0.65, 0.75, 0.85, 0.92];
const HOT_WIDTH = [1, 1, 1, 1.2, 1.4, 1.6];

export default function MeshBackground({ dark, reduce }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let step = DESKTOP_STEP;
    let raf = 0;
    let lastFrame = 0;
    let inView = false;
    let X;
    let Y;
    let F;
    const staticOnly =
      reduce || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
    const mouse = { x: 0, y: 0, tx: 0, ty: 0, active: false };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      lastFrame = 0;
    };

    const draw = (t) => {
      if (!w || !X) return;
      if (!mouse.active && !staticOnly) {
        mouse.tx = w * (0.5 + 0.32 * Math.sin(t / 2600));
        mouse.ty = h * (0.5 + 0.28 * Math.sin(t / 1900 + 1));
      }
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;

      const sigma2 = 2 * 170 * 170;
      const push = 42;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const bx = (c - 1) * step;
          const by = (r - 1) * step;
          const dx = bx - mouse.x;
          const dy = by - mouse.y;
          const d2 = dx * dx + dy * dy;
          const f = Math.exp(-d2 / sigma2);
          const d = Math.sqrt(d2) || 1;
          X[i] = bx + (dx / d) * f * push;
          Y[i] = by + (dy / d) * f * push;
          F[i] = f;
        }
      }

      ctx.clearRect(0, 0, w, h);
      const paths = HOT.map(() => new Path2D());
      const edge = (a, b) => {
        const value = (F[a] + F[b]) / 2;
        const bucket = value < 0.04 ? 0 : Math.min(5, 1 + Math.floor((value - 0.04) / 0.16));
        paths[bucket].moveTo(X[a], Y[a]);
        paths[bucket].lineTo(X[b], Y[b]);
      };

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          if (c < cols - 1) edge(i, i + 1);
          if (r < rows - 1) edge(i, i + cols);
        }
      }

      paths.forEach((path, index) => {
        ctx.lineWidth = HOT_WIDTH[index];
        ctx.strokeStyle =
          index === 0
            ? dark
              ? "rgba(255,255,255,0.09)"
              : "rgba(0,0,0,0.09)"
            : `rgba(${HOT[index]},${HOT_ALPHA[index]})`;
        ctx.stroke(path);
      });
    };

    const start = () => {
      if (raf || staticOnly || !inView || document.hidden || !w) return;
      const frame = (time) => {
        if (!inView || document.hidden) {
          stop();
          return;
        }
        if (time - lastFrame >= 1000 / 30) {
          draw(time);
          lastFrame = time;
        }
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    };

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      w = bounds.width;
      h = bounds.height;
      if (w < 640) {
        canvas.style.display = "none";
        stop();
        return;
      }
      canvas.style.display = "";

      const lowWork = w < 1024 || window.matchMedia("(pointer: coarse)").matches;
      step = lowWork ? MOBILE_STEP : DESKTOP_STEP;
      const dpr = Math.min(window.devicePixelRatio || 1, lowWork ? 1.5 : 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / step) + 3;
      rows = Math.ceil(h / step) + 3;
      X = new Float32Array(cols * rows);
      Y = new Float32Array(cols * rows);
      F = new Float32Array(cols * rows);
      if (!mouse.active) {
        mouse.x = mouse.tx = w * 0.7;
        mouse.y = mouse.ty = h * 0.45;
      }

      if (staticOnly) draw(0);
      else start();
    };

    const onMove = (event) => {
      if (event.pointerType === "touch") return;
      const bounds = host.getBoundingClientRect();
      mouse.tx = event.clientX - bounds.left;
      mouse.ty = event.clientY - bounds.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };
    const onVisibilityChange = () => {
      if (document.hidden) stop();
      else start();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });
    intersectionObserver.observe(host);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);
    resize();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [dark, reduce]);

  return <canvas ref={canvasRef} aria-hidden className="hero-mesh-canvas pointer-events-none absolute inset-0 h-full w-full" />;
}
