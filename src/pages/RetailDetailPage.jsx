import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const RequestDetail = () => {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const liveUrl = "https://meddatabase.onrender.com"
  const localUrl = "http://localhost:3000/contactRequests"
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const response = await axios.get(`${liveUrl}/${id}`);
        setRequest(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching request details:", error);
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  const handleAction = async (action) => {
    try {
      await axios.patch(`${baseUrl}/${id}`, { status: action });
      navigate("/requests");
    } catch (error) {
      console.error("Error handling request action:", error);
    }
  };

  const handleFeedback = async () => {
    try {
      await axios.patch(`${baseUrl}/${id}`, { status: "Feedback Sent", feedback });
      navigate("/requests");
    } catch (error) {
      console.error("Error sending feedback:", error);
    }
  };

  if (loading) {
    return <div>Loading request details...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Request Details</h1>
      <p><strong>ID:</strong> {request.id}</p>
      <p><strong>Name:</strong> {request.name}</p>
      <p><strong>Email:</strong> {request.email}</p>
      <p><strong>Type:</strong> {request.type}</p>
      <p><strong>Message:</strong> {request.message}</p>
      <p><strong>Status:</strong> {request.status}</p>

      <div className="mt-4">
        <button
          onClick={() => handleAction("Accepted")}
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
        >
          Accept
        </button>
        <button
          onClick={() => handleAction("Rejected")}
          className="bg-red-500 text-white px-4 py-2 rounded mr-2"
        >
          Reject
        </button>
        <div className="mt-2">
          <textarea
            placeholder="Enter feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
          <button
            onClick={handleFeedback}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          >
            Send Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestDetail;
