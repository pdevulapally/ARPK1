'use client';
import dynamic from 'next/dynamic';

const MotionDiv = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.div })), {
  ssr: false,
});

const MotionSection = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.section })), {
  ssr: false,
});

export { MotionDiv, MotionSection };
