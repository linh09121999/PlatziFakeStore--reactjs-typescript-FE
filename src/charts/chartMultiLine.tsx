import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    // 👈 import type
} from "chart.js";
import type { ChartOptions, ChartData} from "chart.js";
import { Line } from "react-chartjs-2";
import { useGlobal } from "../context/GlobalContext";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

type LineChartProps = {
    label: string[];
    hours: string[];
    dataDetail: number[][]; // mỗi phần tử = 1 line
    title?: string;
    border: string[]; // màu line
    background: string[]; // màu fill
    donvi: string;
    currentIndex: number;
    stepSize?: number,
    maxValue?: number,
    minValue?: number,
    borderDash?: number[][]
};

const ChartMultiLine: React.FC<LineChartProps> = ({
    label,
    hours,
    dataDetail,
    title,
    border,
    background,
    donvi,
    currentIndex,
    stepSize,
    maxValue,
    minValue,
    borderDash
}) => {
    const { isMobile } = useGlobal()

    const datasets = dataDetail.map((arr, idx) => ({
        label: label[idx],
        data: arr,
        borderColor: border[idx],
        backgroundColor: background[idx],
        borderDash: borderDash?.[idx] ?? [],
        tension: 0.4,
        fill: true,
        // chỉ chấm tại currentIndex
        pointRadius: arr.map((_, i) => (i === currentIndex ? 5 : 0)),
        pointHoverRadius: arr.map((_, i) => (i === currentIndex ? 7 : 4)),
        pointBackgroundColor: arr.map((_, i) =>
            i === currentIndex ? "#fff" : border[idx]
        ),
    }));

    const data: ChartData<"line"> = {
        labels: hours,
        datasets,
    };

    const options: ChartOptions<"line"> = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: "bottom",
                labels: {
                    color: "black",
                    font: { size: isMobile ? 12 : 16 },
                    padding: isMobile ? 6 : 20,
                    boxHeight: isMobile ? 6 : 10,
                },
            },
            title: {
                display: !!title,
                text: title ?? "",
                align: 'start',
                font: { size: isMobile ? 12 : 16 },
                color: "black",
                padding: {
                    top: 10,
                    bottom: 25
                }
            },
        },
        scales: {
            y: {
                max: maxValue,
                min: minValue,
                beginAtZero: true,
                ticks: {
                    color: "rgba(0,0,0,0.7)",
                    font: { size: isMobile ? 12 : 16 },
                    callback: (value) => `${value} ${donvi}`,
                    stepSize: stepSize,
                },
                grid: { color: "rgba(0,0,0,0.2)" },
            },
            x: {
                ticks: {
                    color: "rgba(0,0,0,0.7)",
                    font: { size: isMobile ? 12 : 16 },
                },
                grid: { color: "rgba(0,0,0,0.2)" },
            },
        },
    };

    return (
        <Line
            className="w-full min-x-[340px]"
            data={data}
            options={options}
        />
    );
};

export default ChartMultiLine;
