import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { Separator } from "@/components/ui/separator";

import { formatCurrency } from "@/lib/utils";

export const CustomTooltip = ({ active, payload }: any) => {
  if (!active) return null;

  const date = payload[0].payload.date;

  const income = payload.find((p: any) => p.dataKey === "income")?.value ?? 0;
  const expenses =
    payload.find((p: any) => p.dataKey === "expenses")?.value ?? 0;
  const remaining =
    payload.find((p: any) => p.dataKey === "remaining")?.value ?? 0;

  return (
    <div className="rounded-sm bg-white border overflow-hidden">
      <div className="text-sm p-2 px-3 bg-muted text-muted-foreground">
        {format(date, "dd MMM yyyy", { locale: fr })}
      </div>
      <Separator />
      <div className="p-2 px-3 space-y-1">
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-2">
            <div className="size-1.5 bg-green-500 rounded-full" />
            <p className="text-sm text-muted-foreground">Revenus</p>
          </div>
          <p className="text-sm text-right font-medium">
            {formatCurrency(income)}
          </p>
        </div>
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-2">
            <div className="size-1.5 bg-rose-500 rounded-full" />
            <p className="text-sm text-muted-foreground">Dépenses</p>
          </div>
          <p className="text-sm text-right font-medium">
            {formatCurrency(expenses * -1)}
          </p>
        </div>
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-2">
            <div className="size-1.5 bg-blue-500 rounded-full" />
            <p className="text-sm text-muted-foreground">Solde</p>
          </div>
          <p className="text-sm text-right font-medium">
            {formatCurrency(remaining)}
          </p>
        </div>
      </div>
    </div>
  );
};
