export interface ThemeDef {
  id: string;
  name: string;
  blurb: string;
}

/** All switchable terminal themes. `id` matches the [data-theme="..."] CSS selector. */
export const THEMES: ThemeDef[] = [
  { id: "portfolioos", name: "PortfolioOS", blurb: "Default — neon green on void black" },
  { id: "matrix", name: "Matrix", blurb: "Wake up, Neo… pure green rain" },
  { id: "amber", name: "Amber CRT", blurb: "1980s phosphor glow" },
  { id: "nord", name: "Nord", blurb: "Arctic, frosty blues" },
  { id: "dracula", name: "Dracula", blurb: "Dark fangs & pastel pop" },
  { id: "gruvbox", name: "Gruvbox", blurb: "Retro groove, earthy" },
  { id: "catppuccin", name: "Cappuccin", blurb: "Smooth pastel mocha" },
  { id: "tokyonight", name: "Tokyo Night", blurb: "Neon city nights" },
  { id: "onedark", name: "One Dark", blurb: "Atom's calm classic" },
];

export const DEFAULT_THEME = "portfolioos";

export function themeById(id: string): ThemeDef | undefined {
  return THEMES.find((t) => t.id === id);
}
