"use client";

import { Chart, ChartLoading } from "@/components/chart";
import { SpendingPie, SpendingPieLoading } from "@/components/spending-pie";

import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { format, parse } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export const DataCharts = () => {
  const router = useRouter();
  const params = useSearchParams();
  const { data, isLoading } = useGetSummary();

  const fromParam = params.get("from");
  const toParam = params.get("to");

  const rangeValue = useMemo(
    () => ({
      from: fromParam ? parse(fromParam, "yyyy-MM-dd", new Date()) : undefined,
      to: toParam ? parse(toParam, "yyyy-MM-dd", new Date()) : undefined,
    }),
    [fromParam, toParam]
  );

  const onRangeChange = useCallback(
    (range: { from: Date; to: Date }) => {
      if (!range.from || !range.to) return;
      const search = new URLSearchParams(params.toString());
      search.set("from", format(range.from, "yyyy-MM-dd"));
      search.set("to", format(range.to, "yyyy-MM-dd"));
      router.push(`?${search.toString()}`, { scroll: false });
    },
    [params, router]
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
        <div className="col-span-1 lg:col-span-3 xl:col-span-4">
          <ChartLoading />
        </div>
        <div className="col-span-1 lg:col-span-3 xl:col-span-2">
          <SpendingPieLoading />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
      <div className="col-span-1 lg:col-span-3 xl:col-span-4">
        <Chart data={data?.months} />
      </div>
      <div className="col-span-1 lg:col-span-3 xl:col-span-2">
        <SpendingPie data={data?.categories} />
      </div>
    </div>
  );
};
