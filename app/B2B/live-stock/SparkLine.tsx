"use client";

import { LineChart, Line, ResponsiveContainer } from "recharts";

export function SparkLine({
  data,
  color = "#10b981",
}: {
  data: { v: number }[];
  color?: string;
}) {
  return (
    <div className="h-8 w-28">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
