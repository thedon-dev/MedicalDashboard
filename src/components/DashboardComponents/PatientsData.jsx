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
  const [view, setView] = useState("Monthly"); 
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState({
    patientsPerDay: 0,
    patientsPerWeek: 0,
    patientsPerMonth: 0,
  });

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

  const dayData = {
    labels: ["Per Day", "Per Week", "Per Month"], 
    datasets: [
      {
        label: "Patients",
        data: [chartData.patientsPerDay, chartData.patientsPerWeek, chartData.patientsPerMonth],
        backgroundColor: [
          "rgba(75, 192, 192, 0.5)", 
          "rgba(54, 162, 235, 0.5)", 
          "rgba(255, 99, 132, 0.5)",
        ],
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
        position: "top",
      },
      title: {
        display: true,
        text: "Patients Statistics",
      },
    },
  };

  useEffect(() => {
    const fetchAilmentsData = async () => {
      try {
        const response = await axios.get(`${url}/api/admin/top-ailments`);
        const ailments = response.data?.data;
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

    const fetchDayData = async () => {
      try {
        const response = await axios.get(`${url}/api/admin/patient-stats`);
        if (response.data.success) {
          setChartData({
            patientsPerDay: response.data.data.patientsPerDay,
            patientsPerWeek: response.data.data.patientsPerWeek,
            patientsPerMonth: response.data.data.patientsPerMonth,
          });
        } else {
          console.error("Error fetching data:", response.data.message);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDayData();
  }, []);

  return (
    <div className="grid lg:grid-cols-5 gap-5">
      <div className="lg:col-span-3">
        <h1 className="text-2xl font-bold mb-4">Patients per day</h1>
        <div className=" rounded-lg p-5">
          <div className="w-full max-w-4xl mx-auto">
            <Bar data={dayData} options={chartOptions} />
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
