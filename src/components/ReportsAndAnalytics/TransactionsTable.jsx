import React, { useState } from "react";

const TransactionsTable = ({ transactions }) => {
  const [dataPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentLogs = transactions.slice(indexOfFirstData, indexOfLastData);
  return (
    <>
      <div className="mt-5 bg-[#3AD1F0] rounded-lg overflow-hidden shadow-lg overflow-x-scroll lg:overflow-x-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-white">
              <th className="px-4 py-2 text-start">ID</th>
              <th className="px-4 py-2 text-start">User</th>
              <th className="px-4 py-2 text-start">Type</th>
              <th className="px-4 py-2 text-start">Amount</th>
              <th className="px-4 py-2 text-start">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentLogs.map((txn) => (
              <tr key={txn.id}>
                <td className="px-4 py-2">{txn.id}</td>
                <td className="px-4 py-2">{txn.user}</td>
                <td
                  className={`px-4 py-2 ${
                    txn.type === "credit" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {txn.type}
                </td>
                <td className="px-4 py-2">${txn.amount}</td>
                <td className="px-4 py-2">{txn.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        {Array.from(
          { length: Math.ceil(transactions.length / dataPerPage) },
          (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`mx-1 px-3 py-1 border ${
                currentPage === index + 1
                  ? "bg-[#3AD1F0] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
    </>
  );
};

export default TransactionsTable;
