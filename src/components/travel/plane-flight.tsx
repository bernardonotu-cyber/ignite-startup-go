import { useEffect, useState } from "react";
import { Plane } from "lucide-react";

/**
 * Decorative plane that glides across the hero on a loop, trailing a soft
 * dashed vapour line. Purely presentational — ignores clicks and AT.
 */
export function HeroPlane() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
      <div className="fly-hero absolute left-0 top-[22%]">
        <div className="relative flex items-center">
          <svg
            width="260"
            height="24"
            viewBox="0 0 260 24"
            fill="none"
            className="vapour -mr-1 h-6 w-[clamp(120px,22vw,260px)]"
            preserveAspectRatio="none"
          >
            <path
              d="M0 16 C 60 10, 140 20, 260 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="1 10"
            />
          </svg>
          <Plane className="h-7 w-7 rotate-45 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] md:h-9 md:w-9" fill="currentColor" />
        </div>
      </div>
    </div>
  );
}

/**
 * A second plane that drifts slowly as the user scrolls — parallax feel,
 * flying "above" the Explore / Moments sections.
 */
export function ScrollPlane() {
  const [y, setY] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setY(window.scrollY));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Wrap progress across a 4000px cycle so the plane re-enters repeatedly.
  const progress = (y % 4000) / 4000;
  const x = -12 + progress * 124; // vw: off-left -> off-right
  const driftY = 8 - progress * 4; // gentle climb
  const tilt = -6 + progress * 10; // slight bank as it flies

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[3] hidden md:block"
      style={{ transform: `translate3d(${x}vw, ${driftY}vh, 0)` }}
    >
      <div className="flex items-center" style={{ transform: `rotate(${tilt}deg)` }}>
        <svg
          width="140"
          height="16"
          viewBox="0 0 140 16"
          fill="none"
          className="vapour -mr-0.5 h-4 w-28 text-muted-foreground/50"
          preserveAspectRatio="none"
        >
          <path
            d="M0 10 C 40 6, 80 13, 140 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="1 8"
          />
        </svg>
        <Plane className="h-5 w-5 rotate-45 text-muted-foreground/60" fill="currentColor" />
      </div>
    </div>
  );
}
