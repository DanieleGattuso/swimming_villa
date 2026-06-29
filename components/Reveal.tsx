'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/**
 * Scroll reveal that ENHANCES an already-rendered element (no visibility
 * gating): the element is in the DOM and animates from a small offset when it
 * enters the viewport. Falls back to an instant appear under reduced motion.
 * Use `index` to stagger siblings.
 */
export default function Reveal({
  children,
  className,
  y = 24,
  delay = 0,
  index = 0,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  delay?: number;
  index?: number;
  as?: 'div' | 'li' | 'section' | 'article';
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0.2 : 0.7, ease: EASE_OUT_EXPO, delay: delay + index * 0.08 },
    },
  };

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
    >
      {children}
    </MotionTag>
  );
}
