import React, { useEffect, useState } from "react";
import axios from "axios";

const IndividualFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/providersfeedback"
        );
        setFeedbacks(response.data);
        setFilteredFeedbacks(response.data);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };

    fetchFeedbacks();
  }, []);

  const handleFilterChange = (providerType) => {
    setFilter(providerType);
    if (providerType === "all") {
      setFilteredFeedbacks(feedbacks);
    } else {
      setFilteredFeedbacks(
        feedbacks.filter((feedback) => feedback.providerType === providerType)
      );
    }
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4 text-[#3AD1F0]">
        Feedback and Comments
      </h1>
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => handleFilterChange("all")}
          className={`px-4 py-2 rounded ${
            filter === "all" ? "bg-[#3AD1F0] text-white" : "bg-gray-200"
          }`}
        >
          All
        </button>
        <button
          onClick={() => handleFilterChange("doctor")}
          className={`px-4 py-2 rounded ${
            filter === "doctor" ? "bg-[#3AD1F0] text-white" : "bg-gray-200"
          }`}
        >
          Doctors
        </button>
        <button
          onClick={() => handleFilterChange("pharmacy")}
          className={`px-4 py-2 rounded ${
            filter === "pharmacy" ? "bg-[#3AD1F0] text-white" : "bg-gray-200"
          }`}
        >
          Pharmacy
        </button>
      </div>
      <div className="overflow-hidden rounded-lg overflow-x-scroll lg:overflow-x-hidden">
        <table className="text-nowrap w-full border border-gray-300">
          <thead className="bg-[#3AD1F0] text-white">
            <tr>
              <th className="px-4 py-2">Provider Type</th>
              <th className="px-4 py-2">Feedback</th>
              <th className="px-4 py-2">Rating</th>
              <th className="px-4 py-2">Resolved</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeedbacks.map((feedback) => (
              <tr key={feedback.id} className="text-center border-b">
                <td className="px-4 py-2 capitalize">
                  {feedback.providerType}
                </td>
                <td className="px-4 py-2">{feedback.feedbackText}</td>
                <td className="px-4 py-2">{feedback.rating || "N/A"}</td>
                <td className="px-4 py-2">
                  {feedback.resolved ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IndividualFeedbacks;
