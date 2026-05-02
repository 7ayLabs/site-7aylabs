/**
 * Theme-aware color palette for the Witness Circle scene.
 *
 * Token sources (`styles/tokens.css`):
 *   - `--color-accent-primary`   #178E77 (dark) / #126B5A (light)
 *   - `--color-accent-secondary` #00FFC6
 *   - `--color-accent-warm`      #F59E0B
 */
export interface ColorScheme {
  /** Validator base color (dim/idle state) */
  validatorBase: string;
  /** Validator peak color (during pulse) */
  validatorPeak: string;
  /** Signal arc gradient stops: start (validator side) → end (center side) */
  arcStart: string;
  arcEnd: string;
  /** Presence point center idle */
  presenceBase: string;
  /** Presence point at seal moment */
  presencePeak: string;
  /** Background bloom tint (used by post-processing) */
  bloomTint: string;
}

export const DARK_PALETTE: ColorScheme = {
  validatorBase: "#178E77",
  validatorPeak: "#00FFC6",
  arcStart: "#178E77",
  arcEnd: "#00FFC6",
  presenceBase: "#1ec1a4",
  presencePeak: "#ffffff",
  bloomTint: "#00FFC6",
};

/**
 * Light theme uses warmer accents to remain legible against the cream
 * background — phosphor green on cream is hostile and reads as toxic.
 */
export const LIGHT_PALETTE: ColorScheme = {
  validatorBase: "#126B5A",
  validatorPeak: "#F59E0B",
  arcStart: "#126B5A",
  arcEnd: "#F59E0B",
  presenceBase: "#178E77",
  presencePeak: "#0a4a3d",
  bloomTint: "#178E77",
};
