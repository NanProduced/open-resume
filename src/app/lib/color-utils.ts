export const hexToHsl = (hex: string): [number, number, number] => {
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return [h * 360, s * 100, l * 100];
};

export const hslToHex = (h: number, s: number, l: number): string => {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

export const clampColorInRange = (
  targetHex: string,
  baseHex: string,
  rangePercent: number = 20
): string => {
  const [baseH, baseS, baseL] = hexToHsl(baseHex);
  const [targetH, targetS, targetL] = hexToHsl(targetHex);

  const sRange = rangePercent;
  const lRange = rangePercent;

  const clampedS = Math.max(
    Math.min(targetS, baseS + sRange),
    baseS - sRange
  );
  const clampedL = Math.max(
    Math.min(targetL, baseL + lRange),
    baseL - lRange
  );

  return hslToHex(targetH, clampedS, clampedL);
};

export const isColorInRange = (
  targetHex: string,
  baseHex: string,
  rangePercent: number = 20
): boolean => {
  const [baseH, baseS, baseL] = hexToHsl(baseHex);
  const [targetH, targetS, targetL] = hexToHsl(targetHex);

  const sRange = rangePercent;
  const lRange = rangePercent;

  return (
    targetS >= baseS - sRange &&
    targetS <= baseS + sRange &&
    targetL >= baseL - lRange &&
    targetL <= baseL + lRange
  );
};
