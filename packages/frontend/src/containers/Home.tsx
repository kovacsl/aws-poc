import { useState, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { useAppContext } from "../lib/contextLib";
import { API } from "aws-amplify";
import { PatientType } from "../types/PatientType";
import { onError } from "../lib/errorLib";
import { BsPen, BsPersonFillAdd } from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";
import Table from 'react-bootstrap/Table';
import dayjs from 'dayjs';

import "./Home.css";


export default function Home() {
  const [patients, setPatients] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const patients = await loadPatients();
        setPatients(patients);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  function loadPatients() {
    return API.get("patients", "/patients", {});
  }

  function formatDate(str: undefined | string, frm: string = "YYYY-MM-DDTHH:mm:ssZ[Z]") {
    return !str ? "" : dayjs(str).format(frm);
  }

  function renderPatientsList(patients: PatientType[]) {
    return (
      <>
        <LinkContainer to="/patients/new">
          <ListGroup.Item action className="py-3 text-nowrap text-truncate">
            <BsPersonFillAdd size={17} />
            <span className="ms-2 fw-bold">Add a new patient</span>
          </ListGroup.Item>
        </LinkContainer>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email Address</th>
              <th>Birthdate</th>
              <th>Gender</th>
              <th>Created At</th>
              <th>Modified At</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(({ patientId, firstName, lastName, email, birthDate, gender, createdAt, modifiedAt }) => (
              <tr key={patientId}>
                <td>
                  <LinkContainer key={patientId} to={`/patients/${patientId}`}>
                    <ListGroup.Item action className="text-nowrap text-truncate">
                      <BsPen size={17} />
                    </ListGroup.Item>
                  </LinkContainer>
                </td>
                <td>{firstName}</td>
                <td>{lastName}</td>
                <td>{email}</td>
                <td>{formatDate(birthDate, "DD/MM/YYYY")}</td>
                <td>{gender}</td>
                <td>{formatDate(createdAt)}</td>
                <td>{formatDate(modifiedAt)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>HAP</h1>
        <p className="text-muted">A simple Haemonetics AWS POC</p>
      </div>
    );
  }

  function renderNotes() {
    return (
      <div className="patients">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Patients</h2>
        <ListGroup>{!isLoading && renderPatientsList(patients)}</ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}
