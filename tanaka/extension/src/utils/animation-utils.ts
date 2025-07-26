export type AnimationDuration = string | number | boolean | undefined;

/**
 * Get the CSS animation duration value for animations.
 *
 * @param duration - The duration of the animation. Can be:
 *   - `number`: Duration in non-negative seconds (e.g., `2` → `"2s"`)
 *   - `string`: Valid (non-negative) CSS duration (e.g., `"100ms"`, `"0.5s"`). Returns "auto" for invalid numbers.
 *   - `"fast"`: Maps to `--tnk-animation-duration-fast`
 *   - `"base"`: Maps to `--tnk-animation-duration-base`
 *   - `"slow"`: Maps to `--tnk-animation-duration-slow`
 *   - `boolean`: If true, uses "--tnk-animation-duration-base"
 *   - `undefined`: Returns "auto"
 *   - invalid string: Returns "auto"
 *
 * @returns The CSS animation duration value or "auto" if invalid
 *
 * @example
 * getCSSAnimationDuration(2) // "2s"
 * getCSSAnimationDuration("500ms") // "500ms"
 * getCSSAnimationDuration("fast") // "var(--tnk-animation-duration-fast)"
 * getCSSAnimationDuration(true) // "var(--tnk-animation-duration-base)"
 * getCSSAnimationDuration("invalid") // "auto"
 */
export function getCSSAnimationDuration(duration: AnimationDuration = "auto"): string {
  const durationTimeRegex = /^\d+(\.\d+)?(s|ms)$/; // e.g. 0.1s, 1s, 100ms, etc.

  let cssDuration: string = "auto";

  if (duration === true) {
    cssDuration = "var(--tnk-animation-duration-base)";
  } else if (typeof duration === "number" && !isNaN(duration) && duration >= 0) {
    cssDuration = `${duration}s`;
  } else if (typeof duration === "string") {
    if (durationTimeRegex.test(duration)) {
      cssDuration = duration;
    } else if (duration === "fast") {
      cssDuration = "var(--tnk-animation-duration-fast)";
    } else if (duration === "base") {
      cssDuration = "var(--tnk-animation-duration-base)";
    } else if (duration === "slow") {
      cssDuration = "var(--tnk-animation-duration-slow)";
    }
  }

  return cssDuration;
}
