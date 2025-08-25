import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import ProjectsPage from "./pages/ProjectsPage";
import Navbar from "./components/Navbar";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import UsersPage from "./pages/UsersPage";
import DashboardPage from "./pages/DashboardPage";
import DeadLinesPage from "./pages/DeadLinespage";

const App = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/login" && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/deadlines"
          element={
            <ProtectedRoute>
              <DeadLinesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project-details/:id"
          element={
            <ProtectedRoute>
              <ProjectDetailsPage />
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  );
};

export default App;
