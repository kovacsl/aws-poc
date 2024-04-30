import { useState } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { useNavigate } from "react-router-dom";
import LoaderButton from "../../components/LoaderButton";
import "./NewClient.css";

import { API } from "aws-amplify";
import { onError } from "../../lib/errorLib";
import { ClientType } from "../../types/ClientType";

import { useFormik } from 'formik';
import * as yup from 'yup';

export default function NewClient() {
    const [isLoading, setIsLoading] = useState(false);

    const nav = useNavigate();

    const DATABASE_URL = /^[^:/?#\s]+:\/\/(?:[^@/?#:\s]+(?::[^@/?#\s]+)?@)?(?:[^/?#\s]+)?(?:\/[^?#\s]+)?(?:[?][^#\s]+)?$/;

    const schema = yup.object().shape({
        clientName: yup.string().required('Client name is required').min(3, 'Client name must be at least 3 characters'),
        scopes: yup.string().required('Scopes is required').min(3, 'Scopes must be at least 3 characters'),
        databaseProvider: yup.string().required('Database provider is required').min(3, 'Database provider must be at least 3 characters'),
        databaseUrl: yup.string()
            .matches(DATABASE_URL, 'Database URL must be a valid connection string.'),
    });

    const formik = useFormik({
        validationSchema: schema,
        onSubmit: handleSubmit,
        initialValues: {
            clientName: '',
            databaseProvider: '',
            databaseUrl: '',
            scopes: '',
        }
    });

    function createClient(client: ClientType) {
        return API.post("clients", "/clients", {
            body: client,
        });
    }

    async function handleSubmit(values: ClientType) {
        setIsLoading(true);

        try {
            await createClient(values);
            nav("/");
        } catch (e) {
            onError(e);
            setIsLoading(false);
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
        <div className="NewClient">
            <h2 className="pb-3 mt-4 mb-3 border-bottom">Create a new client</h2>
            <Form noValidate onSubmit={formik.handleSubmit}>
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
                    <Form.Label>Scope</Form.Label>
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
                        Create
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
        </div>
    );
}
