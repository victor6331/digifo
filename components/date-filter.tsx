"use client";

import { MonthRangePicker } from "@/components/month-range-picker";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { formatDateRange } from "@/lib/utils";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { ChevronDown } from "lucide-react";
import qs from "query-string";
import { useState } from "react";
import { DateRange } from "react-day-picker";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const DateFilter = () => {
  const router = useRouter();
  const pathname = usePathname();

  const params = useSearchParams();
  const accountId = params.get("accountId");
  const from = params.get("from") || "";
  const to = params.get("to") || "";

  const defaultTo = endOfMonth(new Date());
  const defaultFrom = startOfMonth(new Date());

  const paramState = {
    from: from ? new Date(from) : defaultFrom,
    to: to ? new Date(to) : defaultTo,
  };

  const [date, setDate] = useState<DateRange | undefined>(paramState);

  const pushToUrl = (dateRange: DateRange | undefined) => {
    const fromDate = dateRange?.from
      ? startOfMonth(dateRange.from)
      : defaultFrom;
    const toDate = dateRange?.to ? endOfMonth(dateRange.to) : defaultTo;

    const query = {
      from: format(fromDate, "yyyy-MM-dd"),
      to: format(toDate, "yyyy-MM-dd"),
      accountId,
    };

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query,
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  };

  const onReset = () => {
    setDate(undefined);
    pushToUrl(undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={false}
          size="sm"
          variant="outline"
          className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-white/10 hover:bg-white/20 hover:text-white border-none focus:ring-offset-0 focus:ring-transaprent outline-none text-white focus:bg-white/30 transition data-[placeholder]:text-white"
        >
          <span>
            {date?.from && date?.to
              ? formatDateRange({ from: date.from, to: date.to })
              : formatDateRange()}{" "}
            {/* Affiche la période par défaut */}
          </span>
          <ChevronDown className="ml-2 size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="lg:w-auto w-full p-0" align="start">
        <MonthRangePicker value={date} onChange={setDate} />
        <div className="p-4 w-full flex items-center gap-x-2">
          <PopoverClose asChild>
            <Button
              onClick={onReset}
              disabled={!date?.from || !date?.to}
              className="flex-1"
              variant="outline"
            >
              Réinitialiser
            </Button>
          </PopoverClose>
          <PopoverClose asChild>
            <Button
              onClick={() => pushToUrl(date)}
              disabled={!date?.from || !date?.to}
              className="flex-1"
            >
              Appliquer
            </Button>
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  );
};
