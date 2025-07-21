import { format, isToday, isYesterday,  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  parseISO, } from "date-fns";
export function getLastSeen(timestamp) {

  if (!timestamp) return "Last seen unknown";

  const date = typeof timestamp === "string" ? parseISO(timestamp) : new Date(timestamp);
  const now = new Date();

  const minutesAgo = differenceInMinutes(now, date);
  const hoursAgo = differenceInHours(now, date);


  if (minutesAgo < 1) {
    return "Last seen: Just now";
  } else if (minutesAgo < 60) {
    return `Last seen: ${minutesAgo} minute${minutesAgo > 1 ? "s" : ""} ago`;
  } else if (isToday(date)) {
    return `Last seen: ${hoursAgo} hour${hoursAgo > 1 ? "s" : ""} ago`;
  } else if (isYesterday(date)) {
    return `Last seen: Yesterday`;
  } else {
    return `Last seen: ${format(date, "MMM d")}`;
  }

}