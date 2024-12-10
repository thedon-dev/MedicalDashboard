import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ActionStatsWithChart = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weeklyStats, setWeeklyStats] = useState({});
  const [monthlyStats, setMonthlyStats] = useState({});

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get("http://localhost:3000/auditLogs");
        setLogs(response.data);
        setLoading(false);

        calculateStats(response.data);
      } catch (error) {
        console.error("Error fetching audit logs:", error);
      }
    };

    fetchLogs();
  }, []);

  const calculateStats = (logs) => {
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    // Filter logs for the last week and month
    const weeklyLogs = logs.filter(
      (log) => new Date(log.timestamp) >= oneWeekAgo
    );
    const monthlyLogs = logs.filter(
      (log) => new Date(log.timestamp) >= oneMonthAgo
    );

    // Count actions
    const weeklyCounts = weeklyLogs.reduce(
      (acc, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1;
        return acc;
      },
      { Approved: 5, Credited: 3, Suspended: 9 }
    );

    const monthlyCounts = monthlyLogs.reduce(
      (acc, log) => {
        acc[log.action] = (acc[log.action] || 0) + 1;
        return acc;
      },
      { Approved: 17, Credited: 25, Suspended: 15 }
    );

    setWeeklyStats(weeklyCounts);
    setMonthlyStats(monthlyCounts);
  };

  if (loading) {
    return <p>Loading stats...</p>;
  }

  // Chart data for weekly stats
  const weeklyData = {
    labels: ["Approved", "Credited", "Suspended"],
    datasets: [
      {
        label: "Last Week",
        data: [
          weeklyStats.Approved || 0,
          weeklyStats.Credited || 0,
          weeklyStats.Suspended || 0,
        ],
        backgroundColor: ["#4caf50", "#2196f3", "#f44336"], // Colors for bars
      },
    ],
  };

  // Chart data for monthly stats
  const monthlyData = {
    labels: ["Approved", "Credited", "Suspended"],
    datasets: [
      {
        label: "Last Month",
        data: [
          monthlyStats.Approved || 0,
          monthlyStats.Credited || 0,
          monthlyStats.Suspended || 0,
        ],
        backgroundColor: ["#4caf50", "#2196f3", "#f44336"], // Colors for bars
      },
    ],
  };

  return (
    <div className="py-5">
      <h1 className="text-2xl font-bold mb-5">Stats</h1>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="mb-10 shadow-lg hover:shadow-2xl p-5 rounded-lg">
          <h2 className="font-semibold mb-3 text-center">Last Week</h2>
          <Bar
            data={weeklyData}
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
            }}
          />
        </div>

        {/* Monthly Stats Chart */}
        <div className="mb-10 shadow-lg hover:shadow-2xl p-5 rounded-lg">
          <h2 className="font-semibold mb-3 text-center">Last Month</h2>
          <Bar
            data={monthlyData}
            options={{
              responsive: true,
              plugins: { legend: { position: "top" } },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ActionStatsWithChart;
