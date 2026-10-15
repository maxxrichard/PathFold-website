"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "section" | "article";
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });
  const [forced, setForced] = useState(false);

  // Elements already scrolled past (e.g. after an anchor jump) must not stay hidden.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.getBoundingClientRect().bottom < 0) setForced(true);
  }, []);

  const show = reduce || inView || forced;
  const Component = motion[as];
  return (
    <Component
      ref={ref as never}
      className={cn(className)}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      animate={show ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: forced ? 0 : delay }}
    >
      {children}
    </Component>
  );
}
