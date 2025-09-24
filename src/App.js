
// App.js
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UsersPage from "./pages/UsersPage";
import SuggestionsPage from "./pages/SuggestionsPage";
import RevenuePage from "./pages/RevenuePage";
import TextGeneratorPage from "./pages/TextGeneratorPage";
import ImageGeneratorPage from "./pages/ImageGeneratorPage";

// ✅ Private Route Wrapper
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      {/* Default route → Login */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/users"
        element={
          <PrivateRoute>
            <UsersPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/suggestions"
        element={
          <PrivateRoute>
            <SuggestionsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/revenue"
        element={
          <PrivateRoute>
            <RevenuePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/tools/text-generator"
        element={
          <PrivateRoute>
            <TextGeneratorPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/tools/image-generator"
        element={
          <PrivateRoute>
            <ImageGeneratorPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
