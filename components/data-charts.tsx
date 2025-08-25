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
  
  // Aggregate daily points into monthly totals (client-side only)
  const monthlyData = (data?.days || []).reduce(
    (
      acc: { date: Date; income: number; expenses: number }[],
      curr: { date: string | Date; income: number; expenses: number }
    ) => {
      const d = new Date(curr.date);
      const monthKey = `${d.getFullYear()}-${d.getMonth()}`; // unique key per month
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
      const existing = acc.find(
        (item) => `${item.date.getFullYear()}-${item.date.getMonth()}` === monthKey
      );

      if (existing) {
        existing.income += curr.income;
        existing.expenses += curr.expenses;
      } else {
        acc.push({ date: monthStart, income: curr.income, expenses: curr.expenses });
      }
      return acc;
    },
    [] as { date: Date; income: number; expenses: number }[]
  ).sort((a, b) => a.date.getTime() - b.date.getTime());

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
<<<<<<< HEAD
        <Chart data={data?.months} />
=======
        <Chart data={monthlyData} />
>>>>>>> Testerreur
      </div>
      <div className="col-span-1 lg:col-span-3 xl:col-span-2">
        <SpendingPie data={data?.categories} />
      </div>
    </div>
  );
};
