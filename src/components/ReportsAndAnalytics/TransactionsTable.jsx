import React from 'react'

const TransactionsTable = ({ transactions }) => {
  return (
    <div className="mt-5 bg-[#3AD1F0] rounded-lg overflow-hidden shadow-lg">
      <table className="w-full border-collapse">
        <thead>
          <tr className='text-white'>
            <th className="px-4 py-2 text-start">ID</th>
            <th className="px-4 py-2 text-start">User</th>
            <th className="px-4 py-2 text-start">Type</th>
            <th className="px-4 py-2 text-start">Amount</th>
            <th className="px-4 py-2 text-start">Date</th>
          </tr>
        </thead>
        <tbody className='bg-white'>
          {transactions.map((txn) => (
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
              <td className="px-4 py-2">
                ${txn.amount}
              </td>
              <td className="px-4 py-2">{txn.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable
