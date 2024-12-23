import { Button } from "@/components/ui/button";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SignUp } from "./components/forms/SignUp";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./context/AuthProvider";
import { SignIn } from "./components/forms/SignIn";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col items-center justify-center h-screen max-w-3xl mx-auto">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Button>Click me</Button>
                </ProtectedRoute>
              }
            />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/sign-in" element={<SignIn />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
