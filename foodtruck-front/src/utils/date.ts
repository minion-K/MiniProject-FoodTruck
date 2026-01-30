export function formatTime(date: Date) {
  const hour = String(date.getHours()).padStart(2, "0");

  return `${hour}:00`;
}

export const ONE_HOUR = 1000 * 60 * 60;

export function toKstString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:00:00`;
}

export const formatPickupRange = (pickupTime: string | Date) => {
  const start = new Date(pickupTime);
  const end = new Date(start.getTime() + ONE_HOUR);

  return `${formatTime(start)} - ${formatTime(end)}`;
};
