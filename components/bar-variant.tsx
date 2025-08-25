import {
  Bar,
  BarChart,
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

export const BarVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey="date"
<<<<<<< HEAD
          tickFormatter={(value) => format(value, "MMM yyyy", { locale: fr })}
=======
          tickFormatter={(value) => format(value, "MMM yyyy")}
>>>>>>> Testerreur
          style={{ fontSize: "12px" }}
          tickMargin={16}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="income" fill="#22c55e" className="drop-shadow-sm" />
        <Bar dataKey="expenses" fill="#f43f5e" className="drop-shadow-sm" />
        <Line
          type="monotone"
          dataKey="remaining"
          stroke="#3B82F6"
          strokeWidth={2}
          dot={false}
          className="drop-shadow-sm"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
