import React from "react";
import { Pie } from "react-chartjs-2";

const FeedbackChart = ({ feedback }) => {
  const totalRatings = feedback.length;
  const groupedRatings = feedback.reduce((acc, item) => {
    acc[item.rating] = (acc[item.rating] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(groupedRatings),
    datasets: [
      {
        data: Object.values(groupedRatings),
        backgroundColor: [
          "#4CAF50",
          "#FFC107",
          "#F44336",
          "#2196F3",
          "#9C27B0",
        ],
      },
    ],
  };

  return (
    <div className="mt-6">
      <Pie data={data} />
    </div>
  );
};

export default FeedbackChart;
