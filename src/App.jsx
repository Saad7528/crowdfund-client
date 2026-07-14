import React, { useContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './providers/AuthProvider';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import CampaignDetails from './pages/CampaignDetails';
import Login from './pages/Login';
import Register from './pages/Register';

// Dashboard Pages
import SupporterHome from './pages/dashboard/SupporterHome';
import CreatorHome from './pages/dashboard/CreatorHome';
import AdminHome from './pages/dashboard/AdminHome';
import MyContributions from './pages/dashboard/MyContributions';
import PurchaseCredit from './pages/dashboard/PurchaseCredit';
import PaymentHistory from './pages/dashboard/PaymentHistory';
import Reports from './pages/dashboard/Reports';
import AddCampaign from './pages/dashboard/AddCampaign';
import MyCampaigns from './pages/dashboard/MyCampaigns';
import Withdrawals from './pages/dashboard/Withdrawals';
import ManageUsers from './pages/dashboard/ManageUsers';
import ManageCampaigns from './pages/dashboard/ManageCampaigns';
import WithdrawalRequests from './pages/dashboard/WithdrawalRequests';

// Route Guards
import PrivateRoute from './routes/PrivateRoute';
import RoleRoute from './routes/RoleRoute';

// Dashboard Index Redirect Handler
const DashboardIndex = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'Supporter') {
        navigate('/dashboard/supporter-home', { replace: true });
      } else if (user.role === 'Creator') {
        navigate('/dashboard/creator-home', { replace: true });
      } else if (user.role === 'Admin') {
        navigate('/dashboard/admin-home', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="spinner-container">
      <div className="modern-spinner"></div>
      <p className="loading-text">Redirecting to console...</p>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Layout */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="explore" element={<Explore />} />
            <Route path="campaigns/:id" element={<CampaignDetails />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* Protected Dashboard Layout */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            {/* Direct lander helper */}
            <Route index element={<DashboardIndex />} />

            {/* Supporter Routes */}
            <Route 
              path="supporter-home" 
              element={
                <RoleRoute allowedRoles={['Supporter']}>
                  <SupporterHome />
                </RoleRoute>
              } 
            />
            <Route 
              path="my-contributions" 
              element={
                <RoleRoute allowedRoles={['Supporter']}>
                  <MyContributions />
                </RoleRoute>
              } 
            />
            <Route 
              path="purchase-credit" 
              element={
                <RoleRoute allowedRoles={['Supporter']}>
                  <PurchaseCredit />
                </RoleRoute>
              } 
            />

            {/* Creator Routes */}
            <Route 
              path="creator-home" 
              element={
                <RoleRoute allowedRoles={['Creator']}>
                  <CreatorHome />
                </RoleRoute>
              } 
            />
            <Route 
              path="add-campaign" 
              element={
                <RoleRoute allowedRoles={['Creator']}>
                  <AddCampaign />
                </RoleRoute>
              } 
            />
            <Route 
              path="my-campaigns" 
              element={
                <RoleRoute allowedRoles={['Creator']}>
                  <MyCampaigns />
                </RoleRoute>
              } 
            />
            <Route 
              path="withdrawals" 
              element={
                <RoleRoute allowedRoles={['Creator']}>
                  <Withdrawals />
                </RoleRoute>
              } 
            />

            {/* Admin Routes */}
            <Route 
              path="admin-home" 
              element={
                <RoleRoute allowedRoles={['Admin']}>
                  <AdminHome />
                </RoleRoute>
              } 
            />
            <Route 
              path="manage-users" 
              element={
                <RoleRoute allowedRoles={['Admin']}>
                  <ManageUsers />
                </RoleRoute>
              } 
            />
            <Route 
              path="manage-campaigns" 
              element={
                <RoleRoute allowedRoles={['Admin']}>
                  <ManageCampaigns />
                </RoleRoute>
              } 
            />
            <Route 
              path="withdrawal-requests" 
              element={
                <RoleRoute allowedRoles={['Admin']}>
                  <WithdrawalRequests />
                </RoleRoute>
              } 
            />

            {/* Shared Route Access (Mapped dynamically by role) */}
            <Route 
              path="payments" 
              element={
                <RoleRoute allowedRoles={['Supporter', 'Creator']}>
                  <PaymentHistory />
                </RoleRoute>
              } 
            />
            <Route 
              path="reports" 
              element={
                <RoleRoute allowedRoles={['Supporter', 'Admin']}>
                  <Reports />
                </RoleRoute>
              } 
            />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
