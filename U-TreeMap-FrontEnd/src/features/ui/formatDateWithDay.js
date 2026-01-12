export function formatDateWithDay(isoString) {
  const date = new Date(isoString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const dayName = days[date.getDay()];

  return `${year}/${month}/${day}(${dayName})`;
}
