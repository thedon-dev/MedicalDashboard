import React, { useEffect, useState } from "react";
import axios from "axios";
import ActionStatsWithChart from "../components/ActivityStats";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;
  const liveUrl = "https://meddatabase.onrender.com"
  const localUrl = "http://localhost:3000"

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(`${localUrl}/auditLogs`);
        setLogs(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching audit logs:", error);
      }
    };

    fetchLogs();
  }, []);

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <p>Loading audit logs...</p>;
  }

  return (
    <div className="p-5">
      <ActionStatsWithChart />
      <h1 className="text-2xl font-bold mb-5">Audit Logs</h1>
      <div className="rounded-lg overflow-hidden">
        <table className="bg-[#3AD1F0] w-full border-collapse border border-gray-300">
          <thead>
            <tr className="text-white">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Admin</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
              <th className="border border-gray-300 px-4 py-2">Entity</th>
              <th className="border border-gray-300 px-4 py-2">Timestamp</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {currentLogs.map((log) => (
              <tr key={log.id}>
                <td className="border border-gray-300 px-4 py-2">{log.id}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {log.admin}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {log.action}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {log.entity}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        {Array.from(
          { length: Math.ceil(logs.length / logsPerPage) },
          (_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`mx-1 px-3 py-1 border ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
