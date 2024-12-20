import React from 'react'

const UserActivityAndStatus = ({ userData }) => {
  return (
    <div className="mt-6 rounded-lg bg-[#3AD1F0] overflow-hidden shadow-lg">
      <table className="w-full border-collapse border-gray-300">
        <thead>
          <tr className='text-white'>
            <th className="px-4 py-2 text-start">User ID</th>
            <th className="px-4 py-2 text-start">Name</th>
            <th className="px-4 py-2 text-start">Email</th>
            <th className="px-4 py-2 text-start">Status</th>
            <th className="px-4 py-2 text-start">Last Active</th>
          </tr>
        </thead>
        <tbody className='bg-white'>
          {userData.map((user) => (
            <tr key={user.id}>
              <td className="px-4 py-2">{user.id}</td>
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className={`px-4 py-2 ${user.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                {user.status}
              </td>
              <td className="px-4 py-2">{user.lastActive}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserActivityAndStatus

