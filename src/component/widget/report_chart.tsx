"use client";

import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

import { theme } from "@/const/theme";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type ReportChartProps = {
  categories: string[];
  series: { name: string; data: number[] }[];
  height?: number;
};

export function ReportChart({ categories, series, height = 260 }: ReportChartProps) {
  const options: ApexOptions = {
    chart: {
      toolbar: { show: false },
      fontFamily: theme.typography.sans,
      zoom: { enabled: false },
    },
    colors: [...theme.chart],
    dataLabels: { enabled: false },
    grid: { borderColor: "hsl(145 18% 86%)", strokeDashArray: 4 },
    stroke: { curve: "smooth", width: 2 },
    xaxis: {
      categories,
      labels: { style: { colors: "hsl(150 8% 43%)" } },
    },
    yaxis: { labels: { style: { colors: "hsl(150 8% 43%)" } } },
    legend: { position: "top", horizontalAlign: "left" },
    tooltip: { theme: "light" },
  };

  return <Chart height={height} options={options} series={series} type="area" />;
}
