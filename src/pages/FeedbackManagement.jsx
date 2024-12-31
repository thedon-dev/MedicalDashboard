import React from "react";
import FeedbacksManagement from "../components/Feedbacks/Feedbacks";
import IndividualFeedbacks from "../components/Feedbacks/IndividualFeedacks";

const FeedbackManagement = () => {
  return (
    <div>
      <div className="">
        <FeedbacksManagement />
      </div>

      <div className="mt-10">
        <IndividualFeedbacks />
      </div>
    </div>
  );
};

export default FeedbackManagement;
