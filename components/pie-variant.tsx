import { formatPercentage } from "@/lib/utils";

import { CategoryTooltip } from "@/components/category-tooltip";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = ["#1A9E4B", "#12c6ff", "#ff647f", "#ff9354"];

type Props = {
  data?: {
    name: string;
    value: number;
  }[];
};

export const PieVariant = ({ data = [] }: Props) => {
  const sortedData = [...data].sort(
    (a, b) => Math.abs(b.value) - Math.abs(a.value)
  );
  const totalAbs = sortedData.reduce((sum, item) => sum + Math.abs(item.value), 0);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="right"
          iconType="circle"
          content={({ payload }: any) => {
            return (
              <ul className="flex flex-col space-y-2">
                {payload.map((entry: any, index: number) => (
                  <li
                    key={`item-${index}`}
                    className="flex items-center space-x-2"
                  >
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <div className="space-x-1">
                      <span className="text-sm text-muted-foreground">
                        {entry.value}
                      </span>
                      <span className="text-sm">
                        {formatPercentage(
                          totalAbs
                            ? (Math.abs(entry.payload.value) / totalAbs) * 100
                            : 0
                        )}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            );
          }}
        />
        <Tooltip content={<CategoryTooltip />} />
        <Pie
          data={sortedData}
          cx="50%"
          cy="50%"
          outerRadius={90}
          innerRadius={60}
          paddingAngle={2}
          fill="#1A9E4B"
          dataKey="value"
          labelLine={false}
        >
          {sortedData.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};
