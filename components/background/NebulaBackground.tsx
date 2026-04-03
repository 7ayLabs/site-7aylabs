"use client";

import { memo } from "react";

/**
 * Global nebula background — fixed, subtle, covers entire viewport.
 * Stays behind all content at all scroll positions.
 */
function NebulaBackgroundComponent() {
  return <div className="nebula-bg-global" aria-hidden="true" />;
}

const NebulaBackground = memo(NebulaBackgroundComponent);
NebulaBackground.displayName = "NebulaBackground";

export default NebulaBackground;
