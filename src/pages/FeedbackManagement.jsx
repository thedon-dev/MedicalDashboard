import React from 'react'
import FeedbacksManagement from '../components/Feedbacks/Feedbacks'
import IndividualFeedbacks from '../components/Feedbacks/IndividualFeedacks'

const FeedbackManagement = () => {
  return (
    <div>
      <FeedbacksManagement />

      <div>
        <IndividualFeedbacks />
      </div>
    </div>
  )
}

export default FeedbackManagement