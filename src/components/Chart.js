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
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const defaultOptions = {
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
};

const Chart = ({ data, options }) => {
  return (
    <Line
      options={{ ...defaultOptions, ...options }}
      data={data}
    />
  );
};

export default Chart;
