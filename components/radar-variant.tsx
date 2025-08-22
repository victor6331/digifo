import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { CategoryTooltip } from "@/components/category-tooltip";

type Props = {
  data?: {
    name: string;
    value: number;
  }[];
};

export const RadarVariant = ({ data = [] }: Props) => {
  const COLORS = ["#22c55e", "#12c6ff", "#ff647f", "#ff9354"];
  const sortedData = [...data].sort(
    (a, b) => Math.abs(b.value) - Math.abs(a.value)
  );

  return (
    <div className="flex flex-col">
      <div className="w-full h-[350px]">
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart cx="50%" cy="50%" outerRadius="60%" data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name" style={{ fontSize: "12px" }} />
            <Tooltip content={<CategoryTooltip />} />
            <Radar
              dataKey="value"
              stroke="#22c55e"
              fill="#22c55e"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
