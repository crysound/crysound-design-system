/** Opt-in Motion-compatible presets supplied by the design specification. */
export const springButton = {
  whileTap: { scale: 0.92 },
  transition: { type: 'spring' as const, stiffness: 600, damping: 30 },
};
export const springPopover = {
  initial: { opacity: 0, scale: 0.95, y: 6 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 4 },
  transition: { type: 'spring' as const, stiffness: 320, damping: 28 },
};
export const springBadgeBounce = {
  initial: { scale: 0.8 },
  animate: { scale: 1 },
  transition: { type: 'spring' as const, stiffness: 380, damping: 18 },
};

/** Pass useReducedMotion() from the consuming application's Motion runtime. */
export function getSpringPreset(name: 'button' | 'popover' | 'badge', reducedMotion: boolean | null = false) {
  if (reducedMotion) {
    return { initial: false as const, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0 } };
  }
  return { button: springButton, popover: springPopover, badge: springBadgeBounce }[name];
}
