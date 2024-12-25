import React, { useState } from "react";

const FeedbackTable = ({ feedback }) => {
  const [dataPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentLogs = feedback.slice(indexOfFirstData, indexOfLastData);
  return (
    <>
      <div className="mt-5  rounded-lg shadow-lg overflow-hidden overflow-x-scroll lg:overflow-x-hidden">
        <table className="w-full border-collapse bg-[#3AD1F0]">
          <thead>
            <tr className="text-white">
              <th className="text-start px-4 py-2">User</th>
              <th className="text-start px-4 py-2">Provider</th>
              <th className="text-start px-4 py-2">Rating</th>
              <th className="text-start px-4 py-2">Comments</th>
              <th className="text-start px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentLogs.map((item) => (
              <tr key={item.id}>
                <td className="text-start px-4 py-2">{item.user}</td>
                <td className="text-start px-4 py-2">{item.provider}</td>
                <td className="text-start px-4 py-2">{item.rating}</td>
                <td className="text-start px-4 py-2">{item.comments}</td>
                <td className="text-start text-nowrap px-4 py-2">
                  {item.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        {Array.from(
          { length: Math.ceil(feedback.length / dataPerPage) },
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

export default FeedbackTable;
