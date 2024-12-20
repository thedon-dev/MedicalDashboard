import React, { useEffect, useState } from "react";
import UserActivityAndStatus from "../components/ReportsAndAnalytics/UserActivityAndStatus";
import axios from "axios";
import TransactionsTable from "../components/ReportsAndAnalytics/TransactionsTable";
import FinancialChart from "../components/ReportsAndAnalytics/FinancialSummary";
import FeedbackTable from "../components/ReportsAndAnalytics/FeedbackTable";

export const ReportingAndAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [usersStatus, setUsersStats] = useState([]);
  const [userTransactions, setUserTransactions] = useState([]);
  const [userFeedback, setUserFeedback] = useState([]);

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const responseStatus = await axios.get(
          "http://localhost:3000/useractivityandfinancialstatus"
        );
        const responseTransactions = await axios.get(
          "http://localhost:3000/transactions"
        );
        const responseFeedback = await axios.get(
          "http://localhost:3000/feedbacks"
        );
        setUsersStats(responseStatus.data);
        setUserTransactions(responseTransactions.data);
        setUserFeedback(responseFeedback.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div>
        <h3 className="text-xl font-bold">User Activity And Account Status</h3>
        {!loading ? (
          <div className="mt-5">
            <UserActivityAndStatus userData={usersStatus} />
          </div>
        ) : (
          <div className="bg-slate-50 rounded-lg mt-5 grid place-content-center py-20">
            <p className="text-lg font-semibold">loading...</p>
          </div>
        )}
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="mt-10">
          <h3 className="text-xl font-bold">Financial Chart</h3>
          {!loading ? (
            <FinancialChart transactions={userTransactions} />
          ) : (
            <div className="bg-slate-50 rounded-lg mt-5 grid place-content-center py-20">
              <p className="text-lg font-semibold">loading...</p>
            </div>
          )}
        </div>
        <div className="mt-10">
          <h3 className="text-xl font-bold">Transactions</h3>
          {!loading ? (
            <div>
              <TransactionsTable transactions={userTransactions} />
            </div>
          ) : (
            <div className="bg-slate-50 rounded-lg mt-5 grid place-content-center py-20">
              <p className="text-lg font-semibold">loading...</p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-10">
          <h3 className="text-xl font-bold">Feedbacks</h3>
          <h3></h3>
        {!loading ? (
          <div>
            <FeedbackTable feedback={userFeedback} />
          </div>
        ) : (
          <div className="bg-slate-50 rounded-lg mt-5 grid place-content-center py-20">
            <p className="text-lg font-semibold">loading...</p>
          </div>
        )}
      </div>
    </div>
  );
};
