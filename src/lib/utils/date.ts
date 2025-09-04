import { formatDistanceToNow, parseISO, format } from "date-fns";

const FORMAT_LONG = "EEEE, MMMM d, yyyy h:mm a zz";
const FORMAT_SHORT = "MMMM dd, yyyy zz";

const dateCache = new Map<string, Date>();

export const getDateDistance = (date: string | null | undefined) => {
  if (!date) return "";
  return formatDistanceToNow(parseISO(date), {
    addSuffix: true,
  });
};

export const normalizeDate = (
  date: string | Date | null | undefined,
): string => {
  if (!date) return "";
  return date instanceof Date ? date.toISOString() : date;
};

const getParsedDate = (dateString: string): Date => {
  if (dateCache.has(dateString)) {
    return dateCache.get(dateString)!;
  }

  const parsedDate = parseISO(dateString);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("Invalid date value provided.");
  }

  dateCache.set(dateString, parsedDate);
  return parsedDate;
};

export const formatDate = (
  date: string | Date | null | undefined,
  formatType: "long" | "short" = "long",
) => {
  if (!date) return "";

  // Ensure that the date is a valid Date string
  const dateString = date instanceof Date ? date.toISOString() : date;

  // Get parsed date from cache or parse it
  const parsedDate = getParsedDate(dateString);

  // Format the date based on the requested format
  return format(
    parsedDate,
    formatType === "short" ? FORMAT_SHORT : FORMAT_LONG,
  );
};
