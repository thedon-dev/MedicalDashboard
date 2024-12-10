import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import LoginPage from "./pages/LoginPage";
import PayoutVerification from "./pages/PayoutVerification";
import HealthcareApproval from "./pages/HealthcareApproval";
import UserManagement from "./pages/UserManagement";
import WalletManagement from "./pages/WalletManagement";
import FeedbackManagement from "./pages/FeedbackManagement";
import ProtectedRoute from "./utils/ProtectedRoute";
import FormRequest from "./pages/FormRequest";
import AuditLogs from "./pages/AuditLogs";
import { ReportingAndAnalytics } from "./pages/ReportingAndAnalytics";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AdminLayout />}>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <PayoutVerification />
                </ProtectedRoute>
              }
            />
            <Route
              path="/healthcareapproval"
              element={
                <ProtectedRoute>
                  <HealthcareApproval />
                </ProtectedRoute>
              }
            />
            <Route
              path="/usermanagement"
              element={
                <ProtectedRoute>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/requests"
              element={
                <ProtectedRoute>
                  <FormRequest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/logs"
              element={
                <ProtectedRoute>
                  <AuditLogs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <ReportingAndAnalytics />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
