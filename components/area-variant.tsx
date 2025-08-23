import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import { CustomTooltip } from "@/components/custom-tooltip";

import { format } from "date-fns";
import { fr } from "date-fns/locale";

type Props = {
  data?: {
    date: Date;
    income: number;
    expenses: number;
    remaining: number;
  }[];
};

export const AreaVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <defs>
          <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
            <stop offset="2%" stopColor="#22c55e" stopOpacity={0.8} />
            <stop offset="98%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="2%" stopColor="#f43f5e" stopOpacity={0.8} />
            <stop offset="98%" stopColor="#f43f5e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey="date"
          tickFormatter={(value) => format(value, "MMM yyyy", { locale: fr })}
          style={{ fontSize: "12px" }}
          tickMargin={16}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="income"
          stackId="income"
          strokeWidth={2}
          stroke="#22c55e"
          fill="url(#income)"
          className="drop-shadow-sm"
        />
        <Area
          type="monotone"
          dataKey="expenses"
          stackId="expenses"
          strokeWidth={2}
          stroke="#f43f5e"
          fill="url(#expenses)"
          className="drop-shadow-sm"
        />
        <Line
          type="monotone"
          dataKey="remaining"
          stroke="#3B82F6"
          strokeWidth={2}
          dot={false}
          className="drop-shadow-sm"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
