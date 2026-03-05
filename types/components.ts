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
  external?: boolean;
}

export interface NavCategory {
  label: string;
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

export type Theme = "light" | "dark";

export interface LinkCardItem {
  icon: ReactNode;
  title: string;
  href: string;
  description?: string;
}

export interface FeatureCardItem {
  title: string;
  description: string;
  illustration?: ReactNode;
  illustrationBg?: string;
  cta?: { label: string; href: string };
}
