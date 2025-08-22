import { formatCurrency } from "@/lib/utils";
import {
  Legend,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#22c55e", "#12c6ff", "#ff647f", "#ff9354"];

type Props = {
  data?: { name: string; value: number }[];
};

export const RadialVariant = ({ data }: Props) => {
  const sortedData = (data ?? [])
    .slice()
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

  // on fige les couleurs pour que la légende corresponde aux barres
  const coloredData = sortedData.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height={350}>
        <RadialBarChart
          cx="50%"
          cy="30%"
          barSize={10}
          innerRadius="90%"
          outerRadius="40%"
          data={coloredData}
        >
          <RadialBar
            label={{ position: "insideStart", fill: "#fff", fontSize: "12px" }}
            background
            dataKey="value"
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="right"
            iconType="circle"
            content={() => (
              <ul className="flex flex-col space-y-2">
                {coloredData.map((entry, index) => (
                  <li
                    key={`item-${index}`}
                    className="flex items-center space-x-2"
                  >
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: entry.fill }}
                    />
                    <div className="space-x-1">
                      <span className="text-sm text-muted-foreground">
                        {entry.name}
                      </span>
                      <span className="text-sm">
                        {formatCurrency(Math.abs(entry.value))}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
};
