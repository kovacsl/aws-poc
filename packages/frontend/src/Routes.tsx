import { Route, Routes } from "react-router-dom";
import Home from "./containers/Home.tsx";
import NotFound from "./containers/NotFound.tsx";
import Login from "./containers/Login.tsx";
import NewPatient from "./containers/patients/NewPatient.tsx";
import AuthenticatedRoute from "./components/AuthenticatedRoute.tsx";
import Patient from "./containers/patients/Patient.tsx";
import ListPatients from "./containers/patients/ListPatients.tsx";
import SandboxClient from "./containers/clients/SandboxClient.tsx";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute.tsx";
import NewClient from "./containers/clients/NewClient.tsx";
import Client from "./containers/clients/Client.tsx";


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
        path="/clients/new"
        element={
          <AuthenticatedRoute>
            <NewClient />
          </AuthenticatedRoute>
        }
      />

      <Route
        path="/clients/:id"
        element={
          <AuthenticatedRoute>
            <Client />
          </AuthenticatedRoute>
        }
      />

      <Route
        path="/clients/:id/sandbox"
        element={
          <AuthenticatedRoute>
            <SandboxClient />
          </AuthenticatedRoute>
        }
      >
        <Route
          path="patients"
          element={
            <AuthenticatedRoute>
              <ListPatients />
            </AuthenticatedRoute>
          } />
        <Route
          path="patients/new"
          element={
            <AuthenticatedRoute>
              <NewPatient />
            </AuthenticatedRoute>
          } />
        <Route
          path="patients/:patientId"
          element={
            <AuthenticatedRoute>
              <Patient />
            </AuthenticatedRoute>
          } />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Finally, catch all unmatched routes */}
      <Route path="*" element={<NotFound />} />;
    </Routes>
  );
}