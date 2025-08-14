export function formatNumberWithCommas(num: number | string): string {
  const n = typeof num === "number" ? num : parseFloat(num);
  if (isNaN(n)) return "0";
  return n.toLocaleString("en-US");
}
