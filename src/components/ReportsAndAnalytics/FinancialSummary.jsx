import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { url } from "../../config";

const FinancialChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const response = await axios.get(`${url}/api/admin/676e9a195a2f8b6f664c2919/total-money-flow`);
        const { success, data, message } = response.data;

        if (success) {
          const { totalInflow, totalOutflow } = data;

          setChartData({
            labels: ["Total Inflow", "Total Outflow"],
            datasets: [
              {
                label: "Financial Flow",
                data: [totalInflow, totalOutflow],
                backgroundColor: ["#4CAF50", "#F44336"],
                borderWidth: 1,
              },
            ],
          });
        } else {
          throw new Error(message || "Failed to fetch data");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="mt-6 rounded-lg shadow-lg hover:shadow-2xl p-4">
      {chartData ? <Bar data={chartData} /> : <div>No data available</div>}
    </div>
  );
};

export default FinancialChart;
