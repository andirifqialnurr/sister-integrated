export const theme = {
  colors: {
    primary: "hsl(142 76% 30%)",
    primaryStrong: "hsl(142 72% 23%)",
    primarySoft: "hsl(142 52% 94%)",
    canvas: "hsl(144 25% 97%)",
    surface: "hsl(0 0% 100%)",
    border: "hsl(145 18% 86%)",
    text: "hsl(150 18% 15%)",
    muted: "hsl(150 8% 43%)",
    success: "hsl(142 71% 35%)",
    warning: "hsl(38 92% 42%)",
    danger: "hsl(0 72% 51%)",
    info: "hsl(199 89% 38%)",
  },
  chart: [
    "hsl(142 76% 30%)",
    "hsl(160 64% 38%)",
    "hsl(82 55% 43%)",
    "hsl(38 92% 42%)",
    "hsl(199 89% 38%)",
  ],
  typography: {
    sans: "Inter, ui-sans-serif, system-ui, sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, monospace",
  },
} as const;

export type Theme = typeof theme;
