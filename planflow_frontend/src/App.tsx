import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { SignUp } from "./components/forms/SignUp";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./context/AuthProvider";
import { SignIn } from "./components/forms/SignIn";
import Navbar from "./components/shared/Navbar";
import Dashboard from "./components/pages/Dashboard";
import { CreateProject } from "./components/forms/CreateProject";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </AuthProvider>
  );
}

function Layout() {
  const location = useLocation();

  // List of routes where Navbar should not appear
  const noNavbarRoutes = ["/sign-in", "/sign-up"];

  return (
    <>
      {!noNavbarRoutes.includes(location.pathname) && <Navbar />}
      <div className="flex flex-col items-center h-screen max-w-3xl mx-auto">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-project"
            element={
              <ProtectedRoute>
                <CreateProject />
              </ProtectedRoute>
            }
          />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
