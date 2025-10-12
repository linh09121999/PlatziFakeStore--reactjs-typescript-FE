import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

type GaugeProps = {
  value?: number;
  min: number;
  max: number;
  donvi: string;
  backgroundColor: string[],
  vsFromLastWeek: number
};

const ChartGauge: React.FC<GaugeProps> = ({ value, min, max, donvi, backgroundColor, vsFromLastWeek }) => {
  const safeValue = value ?? min; // fallback nếu value = undefined
  const percent = (safeValue - min) / (max - min); // 0 -> 1
  const angle = Math.min(Math.max(percent, 0), 1) * 270; // tính độ quét
  const rest = 270 - angle;

  const data = {
    datasets: [
      {
        data: [angle - 0.5, 1, rest - 0.5], // phần đã điền & phần còn lại
        backgroundColor: backgroundColor,
        borderWidth: [0, 4, 0],
        borderColor: backgroundColor,
        cutout: "75%", // tạo gauge rỗng ở giữa
        rotation: -90, // bắt đầu từ -135 độ
        circumference: 180, // quét 270 độ
      },
    ],
  };

  const options = {
    responsive: true,           // ✅ tự fit container
    maintainAspectRatio: false, // ✅ cho phép chart cao theo container
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
  };


  return (
    <div className="flex flex-col mx-auto items-center relative xl:w-70 lg:w-52 md:ư-50">
      <Doughnut data={data} options={options} />

      {/* Hiển thị value + đơn vị ở giữa */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-0  text-center">
        <p className="sm:text-3xl font-bold max-sm:text-2xl">{safeValue}{donvi}</p>
        <div className="text-sm">
          <span className={`${vsFromLastWeek >= 0 ? "text-green-600 bg-green-600/20" : "text-red-600 bg-red-600/20"} font-bold w-fit rounded-full px-2 font-bold`}>{vsFromLastWeek >= 0 ? "+" : ""}{vsFromLastWeek}%</span> from last week
        </div>
      </div>
    </div >
  );
};

export default ChartGauge;
