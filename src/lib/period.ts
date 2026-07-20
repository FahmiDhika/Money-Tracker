export type PeriodType =
  | "day"
  | "week"
  | "2week"
  | "month"
  | "quarter"
  | "year";

export type PeriodRange = {
  start: Date;
  end: Date;
  label: string;
};

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function getPeriodRange(type: PeriodType, offset: number): PeriodRange {
  const now = new Date();

  switch (type) {
    case "day": {
      const date = new Date(now);
      date.setDate(date.getDate() + offset);
      const start = startOfDay(date);
      const end = endOfDay(date);
      const label =
        offset === 0
          ? "Today"
          : offset === -1
            ? "Yesterday"
            : offset === 1
              ? "Tomorrow"
              : `${date.getDate()} ${MONTH_NAMES[date.getMonth()]}`;
      return { start, end, label };
    }

    case "week": {
      const dayOfWeek = now.getDay();
      const currentWeekStart = startOfDay(
        new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek),
      );
      const start = new Date(currentWeekStart);
      start.setDate(start.getDate() + offset * 7);
      const end = endOfDay(
        new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6),
      );
      const label =
        offset === 0
          ? "This Week"
          : offset === -1
            ? "Last Week"
            : `${start.getDate()} ${MONTH_NAMES[start.getMonth()]} - ${end.getDate()} ${MONTH_NAMES[end.getMonth()]}`;
      return { start, end, label };
    }

    case "2week": {
      const currentBlock = now.getDate() <= 15 ? 0 : 1;
      const totalBlockIndex =
        now.getFullYear() * 24 + now.getMonth() * 2 + currentBlock + offset;
      const year = Math.floor(totalBlockIndex / 24);
      const remainder = totalBlockIndex % 24;
      const month = Math.floor(remainder / 2);
      const block = remainder % 2;

      const start = startOfDay(new Date(year, month, block === 0 ? 1 : 16));
      const end =
        block === 0
          ? endOfDay(new Date(year, month, 15))
          : endOfDay(new Date(year, month + 1, 0));

      const label =
        offset === 0
          ? "This Period"
          : offset === -1
            ? "Last Period"
            : `${block === 0 ? "1-15" : "16-" + end.getDate()} ${MONTH_NAMES[month]}/${year}`;

      return { start, end, label };
    }

    case "month": {
      const totalMonthIndex = now.getFullYear() * 12 + now.getMonth() + offset;
      const year = Math.floor(totalMonthIndex / 12);
      const month = ((totalMonthIndex % 12) + 12) % 12;

      const start = startOfDay(new Date(year, month, 1));
      const end = endOfDay(new Date(year, month + 1, 0));

      const label =
        offset === 0
          ? "This Month"
          : offset === -1
            ? "Last Month"
            : `${MONTH_NAMES[month]}/${year}`;

      return { start, end, label };
    }

    case "quarter": {
      const currentQuarter = Math.floor(now.getMonth() / 3);
      const totalQuarterIndex = now.getFullYear() * 4 + currentQuarter + offset;
      const year = Math.floor(totalQuarterIndex / 4);
      const quarter = ((totalQuarterIndex % 4) + 4) % 4;

      const start = startOfDay(new Date(year, quarter * 3, 1));
      const end = endOfDay(new Date(year, quarter * 3 + 3, 0));

      const label =
        offset === 0
          ? "This Quarter"
          : offset === -1
            ? "Last Quarter"
            : `Q${quarter + 1}/${year}`;

      return { start, end, label };
    }

    case "year": {
      const year = now.getFullYear() + offset;
      const start = startOfDay(new Date(year, 0, 1));
      const end = endOfDay(new Date(year, 11, 31));
      const label =
        offset === 0 ? "This Year" : offset === -1 ? "Last Year" : `${year}`;
      return { start, end, label };
    }
  }
}

export function getPeriodOffsetRange(type: PeriodType): {
  past: number;
  future: number;
} {
  switch (type) {
    case "day":
      return { past: 60, future: 7 };
    case "week":
      return { past: 26, future: 4 };
    case "2week":
      return { past: 24, future: 2 };
    case "month":
      return { past: 24, future: 12 };
    case "quarter":
      return { past: 10, future: 4 };
    case "year":
      return { past: 4, future: 2 };
  }
}

export function toDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
