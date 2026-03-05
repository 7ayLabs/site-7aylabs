import type { ReactNode } from "react";

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

export interface AnimatedComponentProps extends BaseComponentProps {
  delay?: number;
}

export interface SectionProps extends BaseComponentProps {
  id?: string;
  as?: "section" | "div" | "article";
}

export interface NavItem {
  label: string;
  href: string;
  icon?: ReactNode;
}

export interface NavCategory {
  label: string;
  description: string;
  items: NavItem[];
}

export type PhaseStatus = "completed" | "in-progress" | "planned";

export interface RoadmapPhase {
  version: string;
  title: string;
  description: string;
  status: PhaseStatus;
  items: string[];
}
