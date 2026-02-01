import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from "../src/pages/home/LandingPage"
import Login from './pages/auth/Login';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './middleware/ProtectedRoutes';
import AdminDashboard from './pages/admin/AdminDashboard';
import { FlockProvider } from './context/FlockContext';
import ForgotPassword from './pages/auth/ForgotPassword';
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FlockProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword/>} />
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/poultry/*"
              element={
                <ProtectedRoute
                  allowedRoles={["admin", "management", "poultry_manager"]}
                ></ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </FlockProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
