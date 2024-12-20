import { Bar } from "react-chartjs-2";

const FinancialChart = ({ transactions }) => {
  const groupedData = transactions.reduce(
    (acc, txn) => {
      acc[txn.type] += txn.amount;
      return acc;
    },
    { credit: 0, debit: 0 }
  );

  const data = {
    labels: ["Credits", "Debits"],
    datasets: [
      {
        label: "Transaction Amounts",
        data: [groupedData.credit, groupedData.debit],
        backgroundColor: ["#4CAF50", "#F44336"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="mt-6 rounded-lg shadow-lg hover:shadow-2xl p-4">
      <Bar data={data} />
    </div>
  );
};


export default FinancialChart;