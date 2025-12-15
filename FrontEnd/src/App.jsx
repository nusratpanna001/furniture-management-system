import React, { Suspense } from "react";
import AppRoutes from "./routes";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import Topbar from "./components/layout/Topbar";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">

        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <LoadingSpinner size="lg" />
            </div>
          }
        >
          <AppRoutes />
        </Suspense>
      </div>
    </AuthProvider>
  );
}

export default App;
