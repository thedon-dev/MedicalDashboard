import React, { useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

const PatientsData = () => {
  const [view, setView] = useState("Monthly"); // Default view

  // Example data for monthly, weekly, and daily applications
  const [dataSets, setDataSets] = useState({
    Monthly: [50, 70, 80, 65, 90, 100, 110, 95, 85, 120, 130, 150],
    Weekly: [10, 20, 15, 25],
    Daily: [5, 8, 7, 6, 10, 9, 12],
  });

  const labels = {
    Monthly: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    Weekly: ["Week 1", "Week 2", "Week 3", "Week 4"],
    Daily: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  };

  const chartData = {
    labels: labels[view],
    datasets: [
      {
        label: `${view} Applications`,
        data: dataSets[view],
        backgroundColor: "#3AD1F0",
        borderRadius: 20, 
      },
    ],
  };

  const illnessesData = {
    labels: ["Flu", "Diabetes", "COVID-19", "Hypertension", "Asthma"],
    datasets: [
      {
        data: [120, 80, 60, 90, 50],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4CAF50",
          "#FFA726",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4CAF50",
          "#FFA726",
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.raw} applications`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10,
        },
        grid: {
          borderDash: [5, 5],
        },
      },
    },
  };

  return (
    <div className="grid lg:grid-cols-5 gap-5">
      <div className="lg:col-span-3">
        <h1 className="text-2xl font-bold mb-4">Patients per day</h1>
        <div className=" rounded-lg hover:shadow-2xl shadow p-5">
          <div className="flex justify-center gap-4 mb-4">
            {["Monthly", "Weekly", "Daily"].map((type) => (
              <button
                key={type}
                onClick={() => setView(type)}
                className={`px-4 py-2 rounded ${
                  view === type
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="w-full max-w-4xl mx-auto">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
      <div className="w-full lg:col-span-2">
        <h2 className="text-xl font-bold mb-4 text-start">Top Ailment</h2>
        <div className="max-w-lg mx-auto w-[95%] rounded-lg hover:shadow-2xl shadow p-5">
          <Doughnut data={illnessesData} />
        </div>
      </div>
    </div>
  );
};

export default PatientsData;
