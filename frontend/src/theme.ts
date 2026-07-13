export const colors = {
  bg: "#0a0a0b",
  card: "#17171a",
  card2: "#1e1e22",
  accent: "#e6402f",
  accent2: "#ff6b4a",
  gold: "#e8b64c",
  text: "#f2f2f0",
  sub: "#9a9a9e",
  line: "#28282c",
  white: "#ffffff",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 6,
  md: 12,
  lg: 16,
  pill: 999,
};

// gradient tuples used for placeholder posters / collection tiles
export const gradientFor = (seed: number): [string, string] => {
  const palettes: [string, string][] = [
    ["#3a2a1a", "#0a0a0a"],
    ["#1a4a3a", "#0a0a0a"],
    ["#26364a", "#0a0a0a"],
    ["#4a0f14", "#0a0a0a"],
    ["#2a2a5a", "#0a0a0a"],
    ["#3a3a20", "#0a0a0a"],
    ["#101820", "#0a0a0a"],
    ["#3a1a08", "#0a0a0a"],
  ];
  return palettes[Math.abs(seed) % palettes.length];
};
