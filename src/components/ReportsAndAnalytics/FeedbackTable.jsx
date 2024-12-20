import React from 'react'

const FeedbackTable = ({ feedback }) => {
    return (
      <div className="mt-5 bg-[#3AD1F0] rounded-lg shadow-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className='text-white'>
              <th className="text-start px-4 py-2">Provider</th>
              <th className="text-start px-4 py-2">Rating</th>
              <th className="text-start px-4 py-2">Comments</th>
              <th className="text-start px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody className='bg-white'>
            {feedback.map((item) => (
              <tr key={item.id}>
                <td className="text-start px-4 py-2">{item.provider}</td>
                <td className="text-start px-4 py-2">{item.rating}</td>
                <td className="text-start px-4 py-2">{item.comments}</td>
                <td className="text-start px-4 py-2">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  

export default FeedbackTable