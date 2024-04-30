import { Link } from "react-router-dom";
import ListGroup from "react-bootstrap/ListGroup";
import { BsPersonFillAdd } from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";

import "./ListClients.css";
import { ClientType } from "../types/ClientType";


interface Props {
  clients: ClientType[];
}

export default function ListClients(props: Props) {
  const { clients } = props;

  return (
    <>
      <div className="Clients">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Clients</h2>
        <ListGroup>
          <LinkContainer to="/clients/new">
            <ListGroup.Item action className="py-3 text-nowrap text-truncate">
              <BsPersonFillAdd size={17} />
              <span className="ms-2 fw-bold">Add a new client</span>
            </ListGroup.Item>
          </LinkContainer>
          {clients.map(({ clientId, clientSecret, clientName, scopes, databaseProvider, databaseUrl }) => (
            <ListGroup.Item key={clientId}>
              <dl className="row">
                <dt className="col-sm-3">Client name</dt>
                <dd className="col-sm-9">{clientName}</dd>
                <dt className="col-sm-3">Client ID</dt>
                <dd className="col-sm-9">{clientId}</dd>
                <dt className="col-sm-3">Client secret</dt>
                <dd className="col-sm-9">{clientSecret}</dd>
                <dt className="col-sm-3">Scope</dt>
                <dd className="col-sm-9">{scopes}</dd>
                <dt className="col-sm-3">Database provider</dt>
                <dd className="col-sm-9">{databaseProvider}</dd>
                <dt className="col-sm-3">Database URL</dt>
                <dd className="col-sm-9">{databaseUrl}</dd>
              </dl>
              <Link className="btn btn-primary" role="link" to={`/clients/${clientId}/sandbox`}>Sandbox</Link>
              <Link className="btn btn-link" role="link" to={`/clients/${clientId}`}>Edit</Link>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </>
  )
}
