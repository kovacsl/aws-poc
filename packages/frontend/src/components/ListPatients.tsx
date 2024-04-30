import { Link } from "react-router-dom";
import ListGroup from "react-bootstrap/ListGroup";
import { BsPersonFillAdd } from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';

import dayjs from 'dayjs';

import { PatientType } from "../types/PatientType";

import "./ListPatients.css";

interface Props {
  patients: PatientType[];
  isLoading: boolean;
}

export default function ListPatientsComponent(props: Props) {
  const { patients, isLoading } = props;

  function formatDate(str: undefined | string, frm: string = "YYYY-MM-DDTHH:mm:ssZ[Z]") {
    return !str ? "" : dayjs(str).format(frm);
  }

  return (
    <>
      <div className="Patients">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Patients</h2>
        {(isLoading && <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>)}
        {(!isLoading && <ListGroup>
          <LinkContainer to="new">
            <ListGroup.Item action className="py-3 text-nowrap text-truncate">
              <BsPersonFillAdd size={17} />
              <span className="ms-2 fw-bold">Add a new patient</span>
            </ListGroup.Item>
          </LinkContainer>
          <ListGroup.Item>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>First name</th>
                  <th>Last Name</th>
                  <th>Email address</th>
                  <th>Birthdate</th>
                  <th>Gender</th>
                </tr>
              </thead>
              <tbody>
                {patients.map(({ patientId, firstName, lastName, email, birthDate, gender }) => (
                  <tr key={patientId}>
                    <td><Link className="btn btn-link" role="link" to={`${patientId}`}>Edit</Link></td>
                    <td>{firstName}</td>
                    <td>{lastName}</td>
                    <td>{email}</td>
                    <td>{formatDate(birthDate, "DD/MM/YYYY")}</td>
                    <td>{gender}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </ListGroup.Item>
        </ListGroup>
        )}
      </div>
    </>
  )
}
