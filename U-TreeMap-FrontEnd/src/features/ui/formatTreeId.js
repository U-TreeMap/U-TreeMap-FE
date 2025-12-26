export function formatTreeId(speciesId) {
  const num = Number(speciesId) || 0;
  return `No.${String(num).padStart(3, "0")}`;
}
