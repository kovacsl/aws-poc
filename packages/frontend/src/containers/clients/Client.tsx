import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import LoaderButton from "../../components/LoaderButton";
import Spinner from 'react-bootstrap/Spinner';
import { API } from "aws-amplify";
import { onError } from "../../lib/errorLib";
import { ClientType } from "../../types/ClientType";
import "./Client.css";

import { useFormik } from 'formik';
import * as yup from 'yup';

export default function Client() {

    const { id } = useParams();
    const nav = useNavigate();
    const [client, setClient] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const DATABASE_URL = /^[^:/?#\s]+:\/\/(?:[^@/?#:\s]+(?::[^@/?#\s]+)?@)?(?:[^/?#\s]+)?(?:\/[^?#\s]+)?(?:[?][^#\s]+)?$/;

    const schema = yup.object().shape({
        clientName: yup.string().required('Client name is required').min(3, 'Client name must be at least 3 characters'),
        scopes: yup.string().required('Scopes is required').min(3, 'Scopes must be at least 3 characters'),
        databaseProvider: yup.string().required('Database provider is required').min(3, 'Database provider must be at least 3 characters'),
        daabaseUrl: yup.string()
            .matches(DATABASE_URL, 'Database URL must be a valid connection string.'),
    });

    const formik = useFormik({
        validationSchema: schema,
        onSubmit: handleSubmit,
        initialValues: {
            clientId: '',
            clientSecret: '',
            clientName: '',
            scopes: '',
            databaseProvider: '',
            databaseUrl: '',
        }
    });

    function loadClient() {
        return API.get("clients", `/clients/${id}`, {});
    }

    useEffect(() => {
        async function onLoad() {
            try {
                const client = await loadClient();

                formik.setFieldValue('clientId', client.clientId);
                formik.setFieldValue('clientSecret', client.clientSecret);
                formik.setFieldValue('clientName', client.clientName);
                formik.setFieldValue('scopes', client.scopes);
                formik.setFieldValue('databaseProvider', client.databaseProvider);
                formik.setFieldValue('databaseUrl', client.databaseUrl);

                setClient(client);
            } catch (e) {
                onError(e);
            }
        }

        onLoad();
    }, [id]);

    function saveClient(client: ClientType) {
        return API.put("clients", `/clients/${id}`, {
            body: client,
        });
    }

    async function handleSubmit(values: ClientType) {
        setIsLoading(true);

        try {
            await saveClient(values);
            nav("/");
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    function deleteClient() {
        return API.del("clients", `/clients/${id}`, {});
    }


    async function handleDelete(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const confirmed = window.confirm(
            "Are you sure you want to delete this patient?"
        );

        if (!confirmed) {
            return;
        }

        setIsDeleting(true);

        try {
            await deleteClient();
            nav("/");
        } catch (e) {
            onError(e);
            setIsDeleting(false);
        }
    }

    function handleCancel(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (formik.dirty) {
            const confirmed = window.confirm(
                "Are you sure you want to leave?"
            );

            if (!confirmed) {
                return;
            }
        }

        try {
            nav("/");
        } catch (e) {
            onError(e);
        }
    }


    return (
        <div className="Client">
            <h2 className="pb-3 mt-4 mb-3 border-bottom">Edit a client</h2>
            {(!client && <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>)}
            {(client &&
                <>
                    <Form noValidate onSubmit={formik.handleSubmit}>
                        <Form.Group controlId="clientId">
                            <Form.Label>Client ID</Form.Label>
                            <Form.Control
                                disabled
                                readOnly
                                value={formik.values.clientId}
                                type="text"
                                placeholder="Client ID"
                            />
                        </Form.Group>
                        <Form.Group controlId="clientSecret">
                            <Form.Label>Client ID</Form.Label>
                            <Form.Control
                                disabled
                                readOnly
                                value={formik.values.clientSecret}
                                type="text"
                                placeholder="Client Secret"
                            />
                        </Form.Group>
                        <Form.Group controlId="clientName">
                            <Form.Label>Client name</Form.Label>
                            <Form.Control
                                required
                                value={formik.values.clientName}
                                type="text"
                                placeholder="Client name"
                                onChange={formik.handleChange}
                                isInvalid={(formik.touched.clientName && !!formik.errors.clientName)}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.clientName}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="scopes">
                            <Form.Label>Scopes</Form.Label>
                            <Form.Control
                                required
                                value={formik.values.scopes}
                                type="text"
                                placeholder="Scopes"
                                onChange={formik.handleChange}
                                isInvalid={(formik.touched.scopes && !!formik.errors.scopes)}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.scopes}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="databaseProvider">
                            <Form.Label>Database provider</Form.Label>
                            <Form.Control
                                required
                                value={formik.values.databaseProvider}
                                type="text"
                                placeholder="Database provider"
                                onChange={formik.handleChange}
                                isInvalid={(formik.touched.databaseProvider && !!formik.errors.databaseProvider)}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.databaseProvider}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="databaseUrl">
                            <Form.Label>Database URL</Form.Label>
                            <Form.Control
                                required
                                value={formik.values.databaseUrl}
                                type="text"
                                placeholder="Database URL"
                                onChange={formik.handleChange}
                                isInvalid={(formik.touched.databaseUrl && !!formik.errors.databaseUrl)}
                            />
                            <Form.Control.Feedback type="invalid">
                                {formik.errors.databaseUrl}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Stack gap={1}>
                            <LoaderButton
                                size="lg"
                                type="submit"
                                variant="primary"
                                isLoading={isLoading}
                            >
                                Save
                            </LoaderButton>
                            <LoaderButton
                                size="lg"
                                variant="danger"
                                onClick={handleDelete}
                                isLoading={isDeleting}
                            >
                                Delete
                            </LoaderButton>
                            <LoaderButton
                                size="lg"
                                variant="link"
                                onClick={handleCancel}
                            >
                                Cancel
                            </LoaderButton>
                        </Stack>
                    </Form>
                </>
            )}
        </div>
    );
}
