import React from "react";
import FeedbacksManagement from "../components/Feedbacks/Feedbacks";
import IndividualFeedbacks from "../components/Feedbacks/IndividualFeedacks";

const FeedbackManagement = () => {
  return (
    <div>
      <div className="border">
        <FeedbacksManagement />
      </div>

      <div className="border">
        <IndividualFeedbacks />
      </div>
    </div>
  );
};

export default FeedbackManagement;
