import React, { useRef, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";

interface GooeyNavItem {
  label: string;
  href: string;
}

export interface GooeyNavProps {
  items: GooeyNavItem[];
  animationTime?: number;
  particleCount?: number;
  particleDistances?: [number, number];
  particleR?: number;
  timeVariance?: number;
  initialActiveIndex?: number;
}

export const GooeyNav: React.FC<GooeyNavProps> = ({
  items,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  initialActiveIndex = 0,
}) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const filterRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(initialActiveIndex);
  const location = useLocation();

  const noise = (n = 1) => n / 2 - Math.random() * n;

  const getXY = (
    distance: number,
    pointIndex: number,
    totalPoints: number
  ): [number, number] => {
    const angle =
      ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticle = (
    i: number,
    t: number,
    d: [number, number],
    r: number
  ) => {
    const rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10,
    };
  };

  const makeParticles = (element: HTMLElement) => {
    const d: [number, number] = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty("--time", `${bubbleTime}ms`);

    const existingParticles = element.querySelectorAll(".particle");
    existingParticles.forEach(p => p.remove());
    
    element.classList.remove("active");

    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      
      setTimeout(() => {
        const particle = document.createElement("span");
        const point = document.createElement("span");
        particle.classList.add("particle");
        particle.style.setProperty("--start-x", `${p.start[0]}px`);
        particle.style.setProperty("--start-y", `${p.start[1]}px`);
        particle.style.setProperty("--end-x", `${p.end[0]}px`);
        particle.style.setProperty("--end-y", `${p.end[1]}px`);
        particle.style.setProperty("--time", `${p.time}ms`);
        particle.style.setProperty("--scale", `${p.scale}`);
        particle.style.setProperty("--rotate", `${p.rotate}deg`);
        point.classList.add("point");
        particle.appendChild(point);
        element.appendChild(particle);
        
        if (i === particleCount - 1) {
            requestAnimationFrame(() => {
                element.classList.add("active");
            });
        }

        setTimeout(() => {
          try {
            if (particle.parentElement === element) {
                 element.removeChild(particle);
            }
          } catch { /* particle may already be removed */ }
        }, t);
      }, i * 10);
    }
  };

  const updateEffectPosition = (element: HTMLElement) => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();
    const styles = {
      left: `${pos.left - containerRect.left}px`,
      top: `${pos.top - containerRect.top}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`,
    };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.innerText = element.innerText;
  };

  const handleClick = (e: React.MouseEvent<HTMLLIElement> | React.KeyboardEvent<HTMLLIElement>, index: number) => {
    const liEl = e.currentTarget;
    // Always allow navigation, even if clicking the active tab
    if (activeIndex !== index) {
      setActiveIndex(index);
      updateEffectPosition(liEl);

      if (textRef.current) {
        textRef.current.classList.remove("active");
        void textRef.current.offsetWidth;
        textRef.current.classList.add("active");
      }
      if (filterRef.current) {
        makeParticles(filterRef.current);
      }
    }

    // Navigate to the selected page
    navigate(items[index].href);
  };

  // const handleLinkKeyDown = (
  //   e: React.KeyboardEvent<HTMLAnchorElement>,
  //   index: number
  // ) => {
  //   if (e.key === "Enter" || e.key === " ") {
  //     e.preventDefault();
  //     const liEl = e.currentTarget.parentElement as HTMLLIElement;
  //     if (liEl) {
  //       handleClick(
  //         { currentTarget: liEl } as unknown as React.KeyboardEvent<HTMLLIElement>,
  //         index
  //       );
  //     }
  //   }
  // };

  useEffect(() => {
    if (!navRef.current || !containerRef.current || !textRef.current || !filterRef.current) return;
    
    const listItems = navRef.current.querySelectorAll("li");
    if (listItems.length === 0) return;

    const activeLi = listItems[activeIndex] as HTMLElement;
    if (activeLi) {
      updateEffectPosition(activeLi);
      if(textRef.current && !textRef.current.classList.contains("active")){
          textRef.current.classList.add("active");
      }
      if (filterRef.current && filterRef.current.children.length === 0) {
        makeParticles(filterRef.current);
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      if (navRef.current) {
        const currentActiveLi = navRef.current.querySelectorAll("li")[
          activeIndex
        ] as HTMLElement;
        if (currentActiveLi) {
          updateEffectPosition(currentActiveLi);
        }
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => {
        if (containerRef.current) {
            resizeObserver.unobserve(containerRef.current);
        }
    };
  }, [activeIndex, items]);

  // Sync active tab with current route
  useEffect(() => {
    const currentPath = location.pathname;
    const idx = items.findIndex((it) => currentPath === it.href || currentPath.startsWith(it.href + "/"));
    const nextIndex = idx >= 0 ? idx : 0;
    if (nextIndex !== activeIndex) {
      setActiveIndex(nextIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, items]);

  return (
    <>
      <style>
        {`
          .gooey-nav-container {
            --nav-bg: #ffffff;
            --nav-border: #e5e7eb;
            --nav-text: #6b7280;
            --nav-text-shadow: 0 1px 2px hsl(0deg 0% 0% / 0.05);

            --bubble-bg: linear-gradient(135deg, #1e40af, #3b82f6, #60a5fa);
            --active-text: #1e40af;
            --particle-color: #1e40af;

            --filter-backdrop-bg: #ffffff;
            --filter-blend-mode: normal;

            --linear-ease: cubic-bezier(0.4, 0, 0.2, 1);
          }
          html.dark .gooey-nav-container {
            --nav-bg: #1f2937;
            --nav-border: #374151;
            --nav-text: #9ca3af;
            --nav-text-shadow: 0 1px 2px hsl(0deg 0% 100% / 0.05);

            --bubble-bg: linear-gradient(135deg, #1e40af, #3b82f6, #60a5fa);
            --active-text: #60a5fa;
            --particle-color: #60a5fa;

            --filter-backdrop-bg: #1f2937;
            --filter-blend-mode: normal;
          }

          .gooey-nav-container ul {
            background: var(--nav-bg);
            border: 1px solid var(--nav-border);
            border-radius: 9999px;
          }
          .gooey-nav-container ul li {
            color: var(--nav-text);
            text-shadow: var(--nav-text-shadow);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-weight: 500;
          }
          .gooey-nav-container ul li:hover {
            color: #1e40af;
            transform: translateY(-1px);
          }
          .gooey-nav-container ul li.active {
            color: var(--active-text);
            text-shadow: none;
          }
          .gooey-nav-container ul li::after {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: 9999px;
            background: transparent;
            border: 2px solid transparent;
            background-image: linear-gradient(white, white), var(--bubble-bg);
            background-origin: border-box;
            background-clip: content-box, border-box;
            opacity: 0;
            transform: scale(0.7);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            z-index: -1;
            box-shadow: 0 4px 12px rgba(30, 64, 175, 0.2);
          }
          .gooey-nav-container ul li.active::after {
            opacity: 1;
            transform: scale(1);
            box-shadow: 0 6px 20px rgba(30, 64, 175, 0.3);
          }

          .gooey-nav-container .effect {
            position: absolute;
            opacity: 1;
            pointer-events: none;
            display: grid;
            place-items: center;
            z-index: 1;
            overflow: hidden;
            border-radius: 9999px;
          }
          .gooey-nav-container .effect.text {
            color: var(--active-text);
            transition: color 0.3s ease;
          }
          .gooey-nav-container .effect.text.active {
            color: var(--active-text);
          }
          .gooey-nav-container .effect.filter {
            filter: blur(4px) contrast(80);
            mix-blend-mode: var(--filter-blend-mode);
            isolation: isolate;
          }
          .gooey-nav-container .effect.filter::before {
            content: "";
            position: absolute;
            inset: -20px;
            z-index: -2;
            background: var(--filter-backdrop-bg);
          }
          .gooey-nav-container .effect.filter::after {
            content: "";
            position: absolute;
            inset: 0;
            background: transparent;
            border: 2px solid transparent;
            background-image: linear-gradient(white, white), var(--bubble-bg);
            background-origin: border-box;
            background-clip: content-box, border-box;
            transform: scale(0);
            opacity: 0;
            z-index: -1;
            border-radius: 9999px;
          }
          .gooey-nav-container .effect.active::after {
            animation: gooey-pill 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
          }
          @keyframes gooey-pill {
            0% {
              transform: scale(0.7);
              opacity: 0;
            }
            50% {
              transform: scale(1.05);
              opacity: 0.8;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          .gooey-nav-container .particle,
          .gooey-nav-container .point {
            display: block;
            opacity: 0;
            width: 12px;
            height: 12px;
            border-radius: 9999px;
            transform-origin: center;
          }
          .gooey-nav-container .particle {
            position: absolute;
            top: calc(50% - 6px);
            left: calc(50% - 6px);
            animation: gooey-particle calc(var(--time)) ease 1 -350ms;
          }
          .gooey-nav-container .point {
            background: var(--particle-color);
            opacity: 1;
            animation: gooey-point calc(var(--time)) ease 1 -350ms;
          }
          @keyframes gooey-particle { 0% { transform: rotate(0deg) translate(var(--start-x), var(--start-y)); opacity: 1; animation-timing-function: cubic-bezier(.55,0,1,.45); } 70% { transform: rotate(calc(var(--rotate)*.5)) translate(calc(var(--end-x)*1.2), calc(var(--end-y)*1.2)); opacity: 1; animation-timing-function: ease; } 85% { transform: rotate(calc(var(--rotate)*.66)) translate(var(--end-x), var(--end-y)); opacity: 1; } 100% { transform: rotate(calc(var(--rotate)*1.2)) translate(calc(var(--end-x)*.5), calc(var(--end-y)*.5)); opacity: 1; } }
          @keyframes gooey-point { 0% { transform: scale(0); opacity: 0; animation-timing-function: cubic-bezier(.55,0,1,.45); } 25% { transform: scale(calc(var(--scale)*.25)); } 38% { opacity: 1; } 65% { transform: scale(var(--scale)); opacity: 1; animation-timing-function: ease; } 85% { transform: scale(var(--scale)); opacity: 1; } 100% { transform: scale(0); opacity: 0; } }
        `}
      </style>
      <div className="gooey-nav-container relative overflow-hidden" ref={containerRef} style={{ isolation: 'isolate', clipPath: 'inset(0)' }}>
        <nav
          className="flex relative"
          style={{ transform: "translate3d(0,0,0.01px)" }}
        >
          <ul
            ref={navRef}
            className={cn("flex gap-x-2 sm:gap-x-4 list-none p-0 px-2 sm:px-4 m-0 relative z-[3]")}
            role="menubar"
            aria-label="Main navigation"
          >
            {items.map((item, index) => (
              <li
                key={index}
                className={cn(`py-2 px-3 sm:py-3 sm:px-5 rounded-full relative cursor-pointer`,
                           activeIndex === index ? "active" : "")}
                onClick={(e) => handleClick(e, index)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleClick(e, index);
                    }
                }}
                role="menuitem"
                aria-current={activeIndex === index ? "page" : undefined}
                tabIndex={0}
              >
                <span 
                  className="outline-none no-underline cursor-pointer"
                  style={{ color: "inherit" }}
                  tabIndex={-1}
                >
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </nav>
        <span className="effect filter" ref={filterRef} />
        <span className="effect text" ref={textRef} />
      </div>
    </>
  );
};