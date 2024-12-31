import React, { useEffect, useState } from "react";
import CountUp from "react-countup";

// ProgressBar Component
const ProgressBar = ({ data }) => {
  const [transformedData, setTransformedData] = useState([]);
  const [totalRequests, setTotalRequests] = useState(0);

  useEffect(() => {
    if (data && typeof data === "object") {
      // Transform object into an array
      const transformed = Object.keys(data).map((key) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize name
        requests: data[key],
      }));

      setTransformedData(transformed);

      // Calculate total requests
      const total = Object.values(data).reduce((sum, count) => sum + count, 0);
      setTotalRequests(total);
    }
  }, [data]);

  return (
    <div className="mb-10 w-full">
      <div className="lg:flex w-full gap-10">
        {transformedData.map((channel, index) => {
          const percentage = totalRequests
            ? ((channel.requests / totalRequests) * 100).toFixed(1)
            : 0;

          return (
            <div key={index} className="mb-4 w-full">
              {/* Channel Name and Request Count */}
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-700 text-sm font-semibold">
                  {channel.name}
                </span>
                <span className="text-gray-500 flex">
                  <CountUp
                    start={0}
                    end={channel.requests}
                    duration={2}
                    separator=","
                  />
                  (
                  <CountUp
                    start={0}
                    end={percentage}
                    duration={2}
                    separator=","
                  />
                  %)
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#3AD1F0] h-2 rounded-full"
                  style={{
                    width: `${percentage}%`,
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


// TotalRequest Component
const TotalRequest = ({ providers, data, progressBar }) => {
  return (
    <>
      <h1 className="text-lg font-semibold mb-4">Requests Received</h1>
      <div className="grid lg:grid-cols-5 mb-5 gap-5">
        {/* Total Requests Card */}
        <div className="bg-[#3AD1F0] flex items-center p-3 justify-between col-span-1 rounded-lg text-white">
          <h1 className="text-xl">Total Request</h1>
          <p className="text-2xl font-bold my-auto">
            <CountUp
              start={0}
              end={data[0].requests}
              duration={2}
              separator=","
            />
          </p>
        </div>

        {/* Approved Requests Card */}
        <div className="bg-green-500 flex items-center p-3 justify-between col-span-1 rounded-lg text-white">
          <h1 className="text-xl">Approved</h1>
          <p className="text-2xl font-bold my-auto">
            <CountUp
              start={0}
              end={data[1].requests}
              duration={2}
              separator=","
            />
          </p>
        </div>

        {/* Pending Requests Card */}
        <div className="bg-yellow-500 flex items-center p-3 justify-between col-span-1 rounded-lg text-white">
          <h1 className="text-xl">Pending</h1>
          <p className="text-2xl font-bold my-auto">
            <CountUp
              start={0}
              end={data[2].requests}
              duration={2}
              separator=","
            />
          </p>
        </div>

        {/* Rejected Requests Card */}
        <div className="bg-red-700 flex items-center p-3 justify-between col-span-1 rounded-lg text-white">
          <h1 className="text-xl">Rejected</h1>
          <p className="text-2xl font-bold my-auto">
            {/* Ensure data is loaded before rendering */}
            {data && data[3] ? (
              <CountUp
                start={0}
                end={data[3].requests}
                duration={2}
                separator=","
              />
            ) : (
              <>
              <span>...</span>
              </>
            )}
          </p>
        </div>

      </div>

      {/* ProgressBar Component */}
      <div className="mt-10">
        <ProgressBar data={progressBar} />
      </div>
    </>
  );
};

export default TotalRequest;
