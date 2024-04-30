import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import LoaderButton from "../../components/LoaderButton";
import Spinner from 'react-bootstrap/Spinner';
import { onError } from "../../lib/errorLib";
import { PatientType, GenderNames } from "../../types/PatientType";
import "./Patient.css";
import config from "../../config.ts";

import { useFormik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';

export default function Patient() {

    const { patientId } = useParams();
    const nav = useNavigate();
    const [patient, setPatient] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const schema = yup.object().shape({
        firstName: yup.string().required('First name is required').min(3, 'First name must be at least 3 characters'),
        lastName: yup.string().required('Last name is required').min(3, 'Last name must be at least 3 characters'),
        email: yup.string().email().required('Email adddress is required'),
        birthDate: yup.date().required('Birthdate is required'),
        gender: yup.mixed<GenderNames>().oneOf(Object.values(GenderNames)).required('Gender is required'),
    });


    const formik = useFormik({
        validationSchema: schema,
        onSubmit: onSubmit,
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            gender: undefined,
            birthDate: '',
        }
    });

    async function loadPatient() {
        const token = sessionStorage.getItem('access_token');

        const response = await fetch(`${config.apiGateway.URL}/patients/${patientId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        return response.json();
    }

    useEffect(() => {
        async function onLoad() {
            try {
                const patient = await loadPatient();

                formik.setFieldValue('firstName', patient?.firstName);
                formik.setFieldValue('lastName', patient?.lastName);
                formik.setFieldValue('email', patient?.email);
                formik.setFieldValue('birthDate', dayjs(patient?.birthDate).format("YYYY-MM-DD"));
                formik.setFieldValue('gender', patient?.gender as GenderNames);

                setPatient(patient);
            } catch (e) {
                onError(e);
            }
        }

        onLoad();
    }, [patientId]);

    function savePatient(patient: PatientType) {
        const token = sessionStorage.getItem('access_token');

        return fetch(`${config.apiGateway.URL}/patients/${patientId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(patient),
        });
    }

    async function onSubmit(values: PatientType) {
        setIsLoading(true);

        try {
            await savePatient(values);
            nav(-1);
        } catch (e) {
            onError(e);
            setIsLoading(false);
        }
    }

    function deletePatient() {
        const token = sessionStorage.getItem('access_token');
        return fetch(`${config.apiGateway.URL}/patients/${patientId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
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
            await deletePatient();
            nav(-1);
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
            nav(-1);
        } catch (e) {
            onError(e);
        }
    }


    return (
        <div className="Patient">
            <h2 className="pb-3 mt-4 mb-3 border-bottom">Edit a patient</h2>
            {(!patient && <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>)}
            {(patient &&
                <Form noValidate onSubmit={formik.handleSubmit}>
                    <Form.Group controlId="firstName">
                        <Form.Label>First name</Form.Label>
                        <Form.Control
                            required
                            value={formik.values.firstName}
                            type="text"
                            placeholder="First name"
                            onChange={formik.handleChange}
                            isInvalid={(formik.touched.firstName && !!formik.errors.firstName)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.firstName}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="lastName">
                        <Form.Label>Last name</Form.Label>
                        <Form.Control
                            required
                            value={formik.values.lastName}
                            type="text"
                            placeholder="Last name"
                            onChange={formik.handleChange}
                            isInvalid={(formik.touched.lastName && !!formik.errors.lastName)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.lastName}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            required
                            value={formik.values.email}
                            type="email"
                            placeholder="Email address"
                            onChange={formik.handleChange}
                            isInvalid={(formik.touched.email && !!formik.errors.email)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.email}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="birthDate">
                        <Form.Label>Birthdate</Form.Label>
                        <Form.Control
                            required
                            value={formik.values.birthDate}
                            type="date"
                            onChange={formik.handleChange}
                            isInvalid={(formik.touched.birthDate && !!formik.errors.birthDate)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.birthDate}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="gender">
                        <Form.Label>Gender</Form.Label>
                        <Form.Select aria-label="Gender select"
                            required
                            value={formik.values.gender}
                            onChange={formik.handleChange}
                            isInvalid={(formik.touched.gender && !!formik.errors.gender)}
                        >
                            <option>Open this select menu</option>
                            <option value={GenderNames.Male}>Male</option>
                            <option value={GenderNames.Female}>Female</option>
                            <option value={GenderNames.Other}>Other</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {formik.errors.gender}
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
            )}
        </div>
    );
}
