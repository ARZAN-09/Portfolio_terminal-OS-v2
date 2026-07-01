"use client";

import type { ComponentRegistry } from "@/lib/shell/types";
import { TechBars } from "./TechBars";
import { NeofetchArt } from "./NeofetchArt";

export const componentRegistry: ComponentRegistry = {
  techBars: TechBars as unknown as ComponentRegistry[string],
  neofetch: NeofetchArt as unknown as ComponentRegistry[string],
};
