import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function roundLongDecimals(string?: string, decimals?: number) {
  if (!string || !decimals) {
    return "-";
  }

  if (string === "0") {
    return "0";
  }

  // if stringToNumber doesn't have decimals, don't add them
  if (!string.includes(".")) {
    return string;
  }

  const stringToNumber = Number(string);
  return stringToNumber.toFixed(decimals);
}

export function truncateHash(hash: string, startLength: number = 6, endLength: number = 4) {
  return `${hash.slice(0, startLength)}...${hash.slice(-endLength)}`;
}

// Format a number string with thousand separators
export function formatNumberStringWithThousandSeparators(value: string) {
  if (value === "") {
    return "";
  }

  return Number(value).toLocaleString();
}

export function formatCurrencyValue(value: string) {
  const num = parseFloat(value);

  if (isNaN(num)) return value;

  const absNum = Math.abs(num);
  const sign = num < 0 ? "-" : "";

  const formatWithSuffix = (n: number, divisor: number, suffix: string) => {
    const divided = n / divisor;
    const floored = Math.floor(divided * 10) / 10;
    const hasRemainder = divided !== floored;
    const formatted = floored.toFixed(1).replace(/\.0$/, "");
    return `${sign}$${formatted}${suffix}${hasRemainder ? "+" : ""}`;
  };

  // Billions
  if (absNum >= 1_000_000_000) {
    return formatWithSuffix(absNum, 1_000_000_000, "B");
  }

  // Millions
  if (absNum >= 1_000_000) {
    return formatWithSuffix(absNum, 1_000_000, "M");
  }

  // Thousands
  if (absNum >= 1_000) {
    return formatWithSuffix(absNum, 1_000, "K");
  }

  // Less than 1000
  return `${sign}$${absNum.toFixed(2).replace(/\.00$/, "")}`;
}