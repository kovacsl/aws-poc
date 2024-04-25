import { Route, Routes } from "react-router-dom";
import Home from "./containers/Home.tsx";
import NotFound from "./containers/NotFound.tsx";
import Login from "./containers/Login.tsx";
import NewPatient from "./containers/NewPatient.tsx";
import AuthenticatedRoute from "./components/AuthenticatedRoute.tsx";
import Patient from "./containers/Patient.tsx";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute.tsx";


export default function Links() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Home />}
      />
      <Route
        path="/login"
        element={
          <UnauthenticatedRoute>
            <Login />
          </UnauthenticatedRoute>
        }
      />
      <Route
        path="/patients/new"
        element={
          <AuthenticatedRoute>
            <NewPatient />
          </AuthenticatedRoute>
        }
      />

      <Route
        path="/patients/:id"
        element={
          <AuthenticatedRoute>
            <Patient />
          </AuthenticatedRoute>
        }
      />

      {/* Finally, catch all unmatched routes */}
      <Route path="*" element={<NotFound />} />;
    </Routes>
  );
}