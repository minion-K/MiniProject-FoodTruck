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
  const hour = d.getHours().toString().padStart(2, "0");
  const min = d.getMinutes().toString().padStart(2, "0");

  if(type === "date") {
    return `${year}.${month}.${day} (${weekday})`;
  }

  if(type === "time") {
    return `${hour}:${min}`
  }

  return `${year}. ${month.toString().padStart(2, "0")}. 
    ${day.toString().padStart(2, "0")} (${weekday}) ${hour}:${min}`
}

export function DateAndHour(date: string, hour: string) {
  return `${date}T${hour}:00`;
}