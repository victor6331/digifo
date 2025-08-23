"use client";

import { endOfMonth, startOfMonth } from "date-fns";
import { useEffect, useMemo, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type MonthRange = {
  from?: Date;
  to?: Date;
};

type Props = {
  value?: MonthRange;
  onChange?: (range: MonthRange) => void;
  minYear?: number;
  maxYear?: number;
  labels?: { start?: string; end?: string };
  className?: string;
};

const MONTH_LABELS_FR = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

export const MonthRangePicker = ({
  value,
  onChange,
  minYear,
  maxYear,
  labels,
  className,
}: Props) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const computedMinYear = minYear ?? currentYear - 5;
  const computedMaxYear = maxYear ?? currentYear + 5;

  const years = useMemo(() => {
    const arr: number[] = [];
    for (let y = computedMaxYear; y >= computedMinYear; y--) arr.push(y);
    return arr;
  }, [computedMinYear, computedMaxYear]);

  // Derive initial state from value (controlled) or default to current month
  const [startMonth, setStartMonth] = useState<number>(
    value?.from ? value.from.getMonth() : now.getMonth()
  );
  const [startYear, setStartYear] = useState<number>(
    value?.from ? value.from.getFullYear() : currentYear
  );
  const [endMonth, setEndMonth] = useState<number>(
    value?.to ? value.to.getMonth() : now.getMonth()
  );
  const [endYear, setEndYear] = useState<number>(
    value?.to ? value.to.getFullYear() : currentYear
  );

  // Keep internal state in sync when parent value changes
  useEffect(() => {
    if (value?.from) {
      setStartMonth(value.from.getMonth());
      setStartYear(value.from.getFullYear());
    }
    if (value?.to) {
      setEndMonth(value.to.getMonth());
      setEndYear(value.to.getFullYear());
    }
  }, [value?.from, value?.to]);

  // Emit changes to parent when any selector changes
  useEffect(() => {
    const start = startOfMonth(new Date(startYear, startMonth, 1));
    let end = endOfMonth(new Date(endYear, endMonth, 1));

    // Guard: ensure start <= end by adjusting end to start when invalid
    if (start.getTime() > end.getTime()) {
      end = endOfMonth(new Date(startYear, startMonth, 1));
      setEndMonth(startMonth);
      setEndYear(startYear);
    }

    onChange?.({ from: start, to: end });
  }, [startMonth, startYear, endMonth, endYear, onChange]);

  return (
    <div className={className}>
      <div className="p-4 md:p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Début */}
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              {labels?.start ?? "Début"}
            </p>
            <div className="flex gap-2">
              <Select
                value={String(startMonth)}
                onValueChange={(v) => setStartMonth(parseInt(v, 10))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Mois" />
                </SelectTrigger>
                <SelectContent>
                  {MONTH_LABELS_FR.map((label, idx) => (
                    <SelectItem key={idx} value={String(idx)}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={String(startYear)}
                onValueChange={(v) => setStartYear(parseInt(v, 10))}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Année" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Fin */}
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              {labels?.end ?? "Fin"}
            </p>
            <div className="flex gap-2">
              <Select
                value={String(endMonth)}
                onValueChange={(v) => setEndMonth(parseInt(v, 10))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Mois" />
                </SelectTrigger>
                <SelectContent>
                  {MONTH_LABELS_FR.map((label, idx) => (
                    <SelectItem key={idx} value={String(idx)}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={String(endYear)}
                onValueChange={(v) => setEndYear(parseInt(v, 10))}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Année" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export type { MonthRange };
