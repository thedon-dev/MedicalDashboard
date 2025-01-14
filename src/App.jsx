import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import LoginPage from "./pages/LoginPage";
import PayoutVerification from "./pages/PayoutVerification";
import HealthcareApproval from "./pages/HealthcareApproval";
import UserManagement from "./pages/UserManagement";
import FeedbackManagement from "./pages/FeedbackManagement";
import ProtectedRoute from "./utils/ProtectedRoute";
import FormRequest from "./pages/FormRequest";
import AuditLogs from "./pages/AuditLogs";
import { ReportingAndAnalytics } from "./pages/ReportingAndAnalytics";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/AdminProfilePage";
import UserProfile from "./pages/UserProfile";
import AdminProfilePage from "./pages/TexstingPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route
              path="/admin/usermanagement/patients/:id"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/usermanagement/doctors/:id"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/testing" element={<AdminProfilePage />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/healthcareapproval"
              element={
                <ProtectedRoute>
                  <HealthcareApproval />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/usermanagement"
              element={
                <ProtectedRoute>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/requests"
              element={
                <ProtectedRoute>
                  <FormRequest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/logs"
              element={
                <ProtectedRoute>
                  <AuditLogs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute>
                  <ReportingAndAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/paymentsverification"
              element={
                <ProtectedRoute>
                  <PayoutVerification />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/feedbacksmanagement"
              element={
                <ProtectedRoute>
                  <FeedbackManagement />
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
