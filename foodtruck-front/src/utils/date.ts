export function formatTime(date: Date) {
  const hour = String(date.getHours()).padStart(2, "0");

  return `${hour}:00`;
}

export const ONE_HOUR = 1000 * 60 * 60;

export function toKstString(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hour = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const sec = String(d.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${min}:${sec}`;
}

export const formatPickupRange = (pickupTime: string | Date) => {
  const start = new Date(pickupTime);
  const end = new Date(start.getTime() + ONE_HOUR);

  return `${formatTime(start)} - ${formatTime(end)}`;
};

type DateFormatType = "full" | "date" | "time";

export function formatDateTime(
  date: string | Date,
  type: DateFormatType = "full"
) {
  const d = typeof date === "string" ? new Date(date) : date;

  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");

  const weekday = ["일", "월", "화", "수", "목", "금", "토"][d.getDay()];
  const rawHour = d.getHours();
  const min = d.getMinutes().toString().padStart(2, "0");

  const period = rawHour < 12 ? "오전" : "오후";
  let hour = rawHour % 12;
  if(hour === 0) hour = 12;

  const timeStr = `${period} ${hour}:${min}`;

  if(type === "date") {
    return `${year}.${month}.${day} (${weekday})`;
  }

  if(type === "time") {
    return timeStr;
  }

  return `${year}. ${month}.${day} (${weekday}) ${timeStr}`
}

export function DateAndHour(date: string, hour: string) {
  return `${date}T${hour}:00`;
}