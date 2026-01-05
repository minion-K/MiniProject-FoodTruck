export function formatTime(date: Date) {
  const hour = String(date.getHours()).padStart(2, "0");
  
  return `${hour}:00`;
}