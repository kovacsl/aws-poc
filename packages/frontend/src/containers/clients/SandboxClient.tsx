import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { API } from "aws-amplify";
import { onError } from "../../lib/errorLib.ts";
import Spinner from 'react-bootstrap/Spinner';
import { ClientType } from "../../types/ClientType.ts";
import Button from 'react-bootstrap/Button';
import LoaderButton from "../../components/LoaderButton.tsx";

import "./SandboxClient.css";

export default function SandboxClient() {

    const { id } = useParams();

    const nav = useNavigate();

    const [client, setClient] = useState<ClientType | null>(null);

    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [token, setToken] = useState(null);

    function loadClient() {
        return API.get("clients", `/clients/${id}`, {});
    }

    function getToken(client: ClientType | null) {
        const requestBody = {
            body: {
                client_id: client?.clientId,
                client_secret: client?.clientSecret,
                scope: client?.scopes,
                grand_type: "client_credentials",
            }
        };

        return API.post("oauth", "/oauth/token", requestBody);
    }

    async function onLoad() {
        setIsLoading(true);
        setIsConnected(false);

        try {
            const client = await loadClient();

            setClient(client);

            const { access_token } = await getToken(client);

            setToken(access_token);

            sessionStorage.setItem('access_token', access_token);

            nav("patients")

            setIsConnected(true);
        } catch (e) {
            onError(e);
            setIsConnected(false);
        }

        setIsLoading(false);
    }


    useEffect(() => {
        onLoad();
    }, [id]);


    async function handleConnect() {
        await onLoad();
    }

    function handleDisconnect(event: React.MouseEvent<HTMLElement>) {
        event.preventDefault();

        const confirmed = window.confirm(
            "Are you sure you want to disconnect?"
        );

        if (!confirmed) {
            return;
        }

        sessionStorage.removeItem('access_token');
        setToken(null);
        setClient(null);

        try {
            nav("/");
        } catch (e) {
            onError(e);
        }
    }

    return (
        <div className="Sandbox">
            <h2 className="pb-3 mt-4 mb-3 border-bottom">Client sandbox</h2>
            {(!client && <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>)}
            {(client &&
                <>
                    <div className="client text-secondary">
                        <h4 className="pb-2 mt-4 mb-4">{client?.clientName}</h4>
                        <dl className="row">
                            <dt className="col-sm-3">Client ID</dt>
                            <dd className="col-sm-9">{client?.clientId}</dd>
                            <dt className="col-sm-3">Client secret</dt>
                            <dd className="col-sm-9">{client?.clientSecret}</dd>
                            <dt className="col-sm-3">Scopes</dt>
                            <dd className="col-sm-9">{client?.scopes}</dd>
                            <dt className="col-sm-3">Database provider</dt>
                            <dd className="col-sm-9">{client?.databaseProvider}</dd>
                            <dt className="col-sm-3">Database URL</dt>
                            <dd className="col-sm-9">{client?.databaseUrl}</dd>
                        </dl>
                    </div>
                    {(isConnected && <pre className="text-secondary p-3 mb-3 border token">{token}</pre>)}
                    {(isConnected && <Button variant="danger" onClick={handleDisconnect}>Disconnect & Exit</Button>)}
                    {(!isConnected && <LoaderButton
                        size="lg"
                        variant="primary"
                        onClick={handleConnect}
                        isLoading={isLoading}
                    >
                        Connect
                    </LoaderButton>)}
                    <Outlet />
                </>
            )}
        </div>
    )
}