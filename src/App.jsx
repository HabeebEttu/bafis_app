import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from "../src/pages/home/LandingPage"
import Login from './pages/auth/Login';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './middleware/ProtectedRoutes';
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<></>} />
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute></ProtectedRoute>}
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
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
