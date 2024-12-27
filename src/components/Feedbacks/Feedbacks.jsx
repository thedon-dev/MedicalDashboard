import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";

const FeedbacksManagement = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [chartData, setChartData] = useState(null);

  const localUrl = "http://localhost:3000";
  const liveUrl = "https://meddatabase-1.onrender.com";

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get(`${localUrl}/mainfeedbackss`);
        setFeedback(response.data);
        console.log(feedback);

        const categories = {
          Complaints: 0,
          Compliments: 0,
          Suggestions: 0,
        };

        response.data.forEach((item) => {
          if (categories[item.type] !== undefined) {
            categories[item.type]++;
          }
        });

        setChartData({
          labels: Object.keys(categories),
          datasets: [
            {
              label: "Feedback Categories",
              data: Object.values(categories),
              backgroundColor: ["#3AD1F0", "#6BE5F5", "#A2F0FA"],
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const handleApproval = async (id) => {
    try {
      await axios.patch(`${liveUrl}/healthcareapprovals/${id}`, {
        status: "Approved",
      });
      const updatedProviders = providers.map((provider) =>
        provider.id === id ? { ...provider, status: "Approved" } : provider
      );
      setProviders(updatedProviders);
      setMessage("Provider approved successfully!");
      setSelectedProvider(null);
    } catch (error) {
      console.error("Error handling approval:", error);
    } finally {
      window.location.reload();
    }
  };

  const handleResolveFeedback = async (id) => {
    try {
      await axios.patch(`${localUrl}/healthcareapprovals/${id}`, {
        resolved: true,
      });
      const updatedFeedback = feedback.map((feed) =>
        feed.id === id ? { ...feed, resolved: true } : feed
      );
      setFeedback(updatedFeedback);
    } catch (error) {}
    alert(`Feedback with ID ${id} marked as resolved.`);
  };

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-bold text-[#3AD1F0] mb-6">
        Feedback Management
      </h1>

      {loading ? (
        <p>Loading feedback...</p>
      ) : (
        <>
          <div className="mb-8 lg:grid grid-cols-2">
            <div>
              {chartData && (
                <Bar
                  data={chartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: "top" },
                      title: { display: true, text: "Feedback Overview" },
                    },
                  }}
                />
              )}
            </div>
          </div>
          <div className="rounded-lg overflow-hidden overflow-x-scroll lg:overflow-x-hidden">
            <table className="text-nowrap w-full bg-white rounded-lg shadow-md">
              <thead className="bg-[#3AD1F0] text-white">
                <tr>
                  <th className="py-2 px-4">ID</th>
                  <th className="py-2 px-4">User</th>
                  <th className="py-2 px-4">Type</th>
                  <th className="py-2 px-4">Comment</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {feedback.map((item) => (
                  <tr key={item.id} className="text-center border-b">
                    <td className="py-2 px-4">{item.id}</td>
                    <td className="py-2 px-4">{item.user}</td>
                    <td className="py-2 px-4">{item.type}</td>
                    <td className="py-2 px-4">{item.comment}</td>
                    <td className="py-2 px-4">
                      {item.resolved && (
                        <div>
                          <button
                            onClick={() => setSelectedFeedback(item)}
                            className="bg-[#3AD1F0] text-white px-4 py-1 rounded mr-2"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleResolveFeedback(item.id)}
                            className="bg-red-500 text-white px-4 py-1 rounded"
                          >
                            Resolve
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-[#3AD1F0]">
              Feedback Details
            </h2>
            <p>
              <strong>User:</strong> {selectedFeedback.user}
            </p>
            <p>
              <strong>Type:</strong> {selectedFeedback.type}
            </p>
            <p>
              <strong>Comment:</strong> {selectedFeedback.comment}
            </p>
            <button
              onClick={() => setSelectedFeedback(null)}
              className="bg-gray-500 text-white px-4 py-1 rounded mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbacksManagement;
