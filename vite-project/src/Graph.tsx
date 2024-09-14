import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  DotProps,
} from "recharts";
import { Circle } from "./Circle";
import { LinePointItem } from "recharts/types/cartesian/Line";

const data = [
  { name: "Page A", uv: 22000, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 10000, pv: 1398, amt: 2210 },
  { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
  { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
];

// Функция для расчета Z-оценки
const calculateZScore = (x: number, mean: number, stdDev: number) => {
  return (x - mean) / stdDev;
};

const calculateMean = (data: number[]) => {
  return data.reduce((acc, item) => acc + item, 0) / data.length;
};

const calculateStdDev = (data: number[], mean: number) => {
  return Math.sqrt(
    data.reduce((acc, item) => acc + Math.pow(item - mean, 2), 0) / data.length
  );
};

// Функция для отрисовки точек с разными цветами в зависимости от Z-оценки
const renderDot = (args: DotProps & LinePointItem) => {
  if (args.payload.zScore > 1) {
    return <Circle color="red" cx={args.cx ?? 0} cy={args.cy ?? 0} />;
  }
  return <Circle color="blue" cx={args.cx ?? 0} cy={args.cy ?? 0} />;
};

data.sort((item1, item2) => {
  if (item1.pv > item2.pv) {
    return 1;
  } else if (item1.pv === item2.pv) {
    return 0;
  }
  return -1;
});

// Добавляем Z-оценку в данные
const getDataWithZScore = (
  field: Exclude<keyof (typeof data)[0], "name">,
  mean: number,
  stdDev: number
) =>
  data.map((item, index) => {
    const zScore = calculateZScore(item[field], mean, stdDev);
    const proc = ((index + 1) / data.length) * 100;
    return { ...item, proc, zScore };
  });

export const Chart = () => {
  const mean = calculateMean(data.map((item) => item.uv));
  const stdDev = calculateStdDev(
    data.map((item) => item.uv),
    mean
  );
  const zScoreData = getDataWithZScore("uv", mean, stdDev);

  return (
    <LineChart width={500} height={300} data={zScoreData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="pv" />
      <YAxis />
      <defs>
        <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="0">
          {zScoreData.map((item, index) => {
            const proc =
              index === 0 ? 0 : item.proc - zScoreData[index - 1].proc / 2;
            return (
              <>
                <stop
                  key={`stop-before-${index}`}
                  offset={`${proc}%`}
                  stopColor={item.zScore > 1 ? "red" : "blue"}
                />
              </>
            );
          })}
        </linearGradient>
      </defs>
      <Line
        type="monotone"
        dataKey="uv"
        stroke="url(#colorUv)"
        dot={renderDot}
      />
    </LineChart>
  );
};
