import { useState, useEffect } from "react";
import { useAppContext } from "../lib/contextLib";
import { API } from "aws-amplify";
import { onError } from "../lib/errorLib";
import ListClients from "../components/ListClients"
import Spinner from 'react-bootstrap/Spinner';

import "./Home.css";


export default function Home() {
  const [clients, setClients] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      setIsLoading(true);

      try {
        const clients = await loadClients();
        setClients(clients);
      } catch (e) {
        onError(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [isAuthenticated]);

  function loadClients() {
    return API.get("clients", "/clients", {});
  }


  function renderLander() {
    return (
      <div className="lander">
        <h1>HAP</h1>
        <p className="text-muted">A simple Haemonetics AWS POC</p>
      </div>
    );
  }

  function renderClients() {
    return (
      <>
        {isLoading ? <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner> : <ListClients clients={clients} />}
      </>
    )
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderClients() : renderLander()}
    </div>
  );
}
