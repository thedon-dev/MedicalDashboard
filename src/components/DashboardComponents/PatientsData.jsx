import React, { useEffect, useState } from "react";
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
import { url } from "../../config";
import axios from "axios";

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

  const [doughnutLoading, setDoughnutLoading] = useState(true);
  const [illnessesData, setIllnessesData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4CAF50",
          "#FFA726",
          "#7E57C2",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4CAF50",
          "#FFA726",
          "#7E57C2",
        ],
      },
    ],
  });

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

  useEffect(() => {
    const fetchAilmentsData = async () => {
      try {
        const response = await axios.get(`${url}/api/admin/top-ailments`);
        const ailments = response.data?.data;
        console.log('ailment: ', response.data)
        if (ailments.length > 0) {
          const labels = ailments.map((item) => item.diagnosis);
          const data = ailments.map((item) => item.count);
          setIllnessesData((prevState) => ({
            ...prevState,
            labels,
            datasets: [
              {
                ...prevState.datasets[0],
                data,
              },
            ],
          }));
        }
        
      } catch (error) {
        console.error("Error fetching ailments data:", error);
      } finally {
        setDoughnutLoading(false);
      }
    };

    fetchAilmentsData();
  }, []);

  return (
    <div className="grid lg:grid-cols-5 gap-5">
      <div className="lg:col-span-3">
        <h1 className="text-2xl font-bold mb-4">Patients per day</h1>
        <div className=" rounded-lg p-5">
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
        <div className="max-w-lg mx-auto w-[95%] rounded-lg p-5">
          {doughnutLoading ? (
            <p>Loading...</p>
          ) : illnessesData.labels.length === 0 ? (
            <p>No data found</p>
          ) : (
            <Doughnut data={illnessesData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientsData;
