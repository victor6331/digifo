"use client";

import { Chart, ChartLoading } from "@/components/chart";
import { MonthRangePicker } from "@/components/month-range-picker";
import { SpendingPie, SpendingPieLoading } from "@/components/spending-pie";

import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const DataCharts = () => {
  const router = useRouter();
  const params = useSearchParams();
  const { data, isLoading } = useGetSummary();

  const onRangeChange = useCallback(
    (range: { from: Date; to: Date }) => {
      if (!range.from || !range.to) return;
      const search = new URLSearchParams(params.toString());
      search.set("from", range.from.toISOString().slice(0, 10));
      search.set("to", range.to.toISOString().slice(0, 10));
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
      {/* Sélecteur de plage de mois */}
      <MonthRangePicker onChange={onRangeChange} />
      <div className="col-span-1 lg:col-span-3 xl:col-span-4">
        <Chart data={data?.months} />
      </div>
      <div className="col-span-1 lg:col-span-3 xl:col-span-2">
        <SpendingPie data={data?.categories} />
      </div>
    </div>
  );
};
