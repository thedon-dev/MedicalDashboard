import React, { useEffect, useState } from "react";
import UserActivityAndStatus from "../components/ReportsAndAnalytics/UserActivityAndStatus";
import axios from "axios";
import TransactionsTable from "../components/ReportsAndAnalytics/TransactionsTable";
import FinancialChart from "../components/ReportsAndAnalytics/FinancialSummary";
import FeedbackTable from "../components/ReportsAndAnalytics/FeedbackTable";
import FeedbackChart from "../components/ReportsAndAnalytics/FeedbackChart";

export const ReportingAndAnalytics = () => {
  const liveUrl = "https://meddatabase.onrender.com";
  const localUrl = "http://localhost:3000";
  const [loading, setLoading] = useState(true);
  const [usersStatus, setUsersStats] = useState([]);
  const [userTransactions, setUserTransactions] = useState([]);
  const [userFeedback, setUserFeedback] = useState([]);
  const [credits, setCredits] = useState([]);
  const [debits, setDebits] = useState([]);
  const [filterTransactionData, setFilterTransactionData] = useState("All");
  const filterStates = ["All", "Credits", "Debits"];
  const [currentFilter, setCurrentFilter] = useState(userTransactions);

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const responseStatus = await axios.get(
          `${liveUrl}/useractivityandaccountstatus`
        );
        setUsersStats(responseStatus.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }

      try {
        const responseTransactions = await axios.get(
          `${liveUrl}/transactions`
        );
        setUserTransactions(responseTransactions.data);

        const credits = responseTransactions.data.filter(
          (credit) => credit.type === "credit"
        );
        setCredits(credits);

        const debits = responseTransactions.data.filter(
          (debit) => debit.type === "debit"
        );
        setDebits(debits);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }

      try {
        const responseFeedback = await axios.get(`${liveUrl}/feedbacks`);
        setUserFeedback(responseFeedback.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (filterTransactionData === "All") {
      setCurrentFilter(userTransactions);
    } else if (filterTransactionData === "Credits") {
      setCurrentFilter(credits);
    } else if (filterTransactionData === "Debits") {
      setCurrentFilter(debits);
    }
  }, [filterTransactionData, userTransactions, credits, debits]);

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
      <div className="lg:grid lg:grid-cols-2 gap-8">
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
          <div className="lg:flex gap-5 lg:justify-between">
            <h3 className="text-xl font-bold">Transactions</h3>
            <div className="grid grid-cols-3 gap-2 lg:gap-5 w-full lg:w-[50%] mt-5 lg:mt-0">
              {filterStates.map((state, index) => (
                <button
                  key={index}
                  className={`${
                    filterTransactionData === state
                      ? "bg-[#3AD1F0] text-white"
                      : ""
                  } rounded py-2 lg:py-0`}
                  onClick={() => setFilterTransactionData(state)}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>
          {!loading ? (
            <div>
              <TransactionsTable transactions={currentFilter} />
            </div>
          ) : (
            <div className="bg-slate-50 rounded-lg mt-5 grid place-content-center py-20">
              <p className="text-lg font-semibold">loading...</p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-10 lg:grid lg:grid-cols-5 gap-10">
        <div className="col-span-3">
          <h3 className="text-xl font-bold">Feedbacks</h3>
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
        <div className="lg:col-span-2 mt-10 lg:mt-0">
          <h3 className="text-xl font-bold">Feedback Summary</h3>
          <div className="grid place-content-center">
            <FeedbackChart feedback={userFeedback} />
          </div>
        </div>
      </div>
    </div>
  );
};
