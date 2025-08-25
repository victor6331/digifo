import { clsx, type ClassValue } from "clsx";
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  format,
  isSameDay,
  isSameMonth,
  parse,
  subMonths,
} from "date-fns";
import { fr } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertAmountFromMiliunits(amount: number) {
  return amount / 1000;
}

export function convertAmountToMiliunits(amount: number) {
  return Math.round(amount * 1000);
}

export function formatCurrency(value: number) {
  return Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);
}

export function calculatePercentageChange(current: number, previous: number) {
  if (previous === 0) {
    return previous === current ? 0 : 100;
  }

  return ((current - previous) / previous) * 100;
}

export function fillMissingDays(
  activeDays: {
    date: Date;
    income: number;
    expenses: number;
  }[],
  startDate: Date,
  endDate: Date
) {
  if (activeDays.length === 0) {
    return [];
  }

  const allDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const transactionByDay = allDays.map((day) => {
    const found = activeDays.find((d) => isSameDay(d.date, day));

    if (found) {
      return found;
    } else {
      return {
        date: day,
        income: 0,
        expenses: 0,
      };
    }
  });

  return transactionByDay;
}

export function fillMissingMonths(
  activeMonths: {
    date: Date;
    income: number;
    expenses: number;
  }[],
  startDate: Date,
  endDate: Date
) {
  // Coerce input to Date to avoid runtime errors when DB returns strings
  const toDate = (d: Date | string | number): Date =>
    d instanceof Date ? d : new Date(d);

  // Key helper using UTC for DB-aggregated dates to avoid tz drift
  const ymKeyUTC = (raw: Date | string | number) => {
    const d = toDate(raw);
    const y = d.getUTCFullYear();
    const m = d.getUTCMonth() + 1;
    return `${y}-${String(m).padStart(2, "0")}`;
  };

  // Key helper for local month starts used on the X-axis
  const ymKeyLocal = (raw: Date | string | number) => {
    const d = toDate(raw);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    return `${y}-${String(m).padStart(2, "0")}`;
  };

  const byKey = new Map<string, { date: Date; income: number; expenses: number }>();
  for (const m of activeMonths) {
    const key = ymKeyUTC(m.date as unknown as Date | string | number);
    if (!byKey.has(key)) {
      // store as Date to normalize downstream
      const dateObj = toDate(m.date as unknown as Date | string | number);
      byKey.set(key, { ...m, date: dateObj });
    }
  }

  const allMonths = eachMonthOfInterval({ start: startDate, end: endDate });
  if (allMonths.length === 0) return [];

  const result = allMonths.map((monthStart) => {
    const key = ymKeyLocal(monthStart);
    const found = byKey.get(key);
    return found ? { ...found, date: monthStart } : { date: monthStart, income: 0, expenses: 0 };
  });

  return result;
}

type Period = {
  from: string | Date | undefined;
  to: string | Date | undefined;
};

export function formatDateRange(period?: Period) {
  const defaultTo = new Date();
  const defaultFrom = subMonths(defaultTo, 6);

  if (!period?.from) {
    return `${format(defaultFrom, "LLL dd", { locale: fr })} - ${format(
      defaultTo,
      "LLL yyyy",
      { locale: fr }
    )}`;
  }

  const fromDate =
    typeof period.from === "string"
      ? parse(period.from, "yyyy-MM-dd", new Date())
      : (period.from as Date);

  if (period.to) {
    const toDate =
      typeof period.to === "string"
        ? parse(period.to, "yyyy-MM-dd", new Date())
        : (period.to as Date);
    return `${format(fromDate, "LLL dd", { locale: fr })} - ${format(
      toDate,
      "LLL yyyy",
      { locale: fr }
    )}`;
  }

  return format(fromDate, "LLL dd, y", { locale: fr });
}

export function formatPercentage(
  value: number,
  options: { addPrefix?: boolean } = {
    addPrefix: false,
  }
) {
  const result = new Intl.NumberFormat("fr-FR", {
    style: "percent",
  }).format(value / 100);

  if (options.addPrefix && value > 0) {
    return `+${result}`;
  }

  return result;
}
