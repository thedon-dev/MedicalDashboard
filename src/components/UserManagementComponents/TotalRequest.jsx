import React from "react";
import CountUp from "react-countup";

const ProgressBar = ({ data }) => {
  const totalRequests = data.reduce(
    (sum, channel) => sum + channel.requests,
    0
  );

  return (
    <div className="mb-10 w-full">
      <div className="lg:flex w-full gap-10">
        {data.map((channel, index) => {
          const percentage = ((channel.requests / totalRequests) * 100).toFixed(
            1
          );

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

// Example usage
const totalRequest = ({ providers, data, progressBar }) => {
  return (
    <>
      <h1 className="text-lg font-semibold mb-4">Requests Received</h1>
      <div className="grid lg:grid-cols-5 mb-5 gap-5">
        <div className="bg-[#3AD1F0] flex items-center p-3 justify-between col-span-1 rounded-lg text-white">
          <h1 className="text-xl">Total Request</h1>
          <p className="text-2xl font-bold my-auto">
            <CountUp
              start={0}
              end={providers.length}
              duration={2}
              separator=","
            />
          </p>
        </div>
        <div className="bg-green-500 flex items-center p-3 justify-between col-span-1 rounded-lg text-white">
          <h1 className="text-xl">Approved</h1>
          <p className="text-2xl font-bold my-auto">
            <CountUp
              start={0}
              end={data["Approved"]}
              duration={2}
              separator=","
            />
          </p>
        </div>
        <div className="bg-yellow-500 flex items-center p-3 justify-between col-span-1 rounded-lg text-white">
          <h1 className="text-xl">Pending</h1>
          <p className="text-2xl font-bold my-auto">
            <CountUp
              start={0}
              end={data["Pending"]}
              duration={2}
              separator=","
            />
          </p>
        </div>
        <div className="bg-red-700 flex items-center p-3 justify-between col-span-1 rounded-lg text-white">
          <h1 className="text-xl">Rejected</h1>
          <p className="text-2xl font-bold my-auto">
            <CountUp
              start={0}
              end={data["Rejected"]}
              duration={2}
              separator=","
            />
          </p>
        </div>
      </div>
      <div className="mt-10">
        <ProgressBar data={progressBar} />
      </div>
    </>
  );
};

export default totalRequest;
