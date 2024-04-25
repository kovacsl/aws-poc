import { useState } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { useNavigate } from "react-router-dom";
import LoaderButton from "../components/LoaderButton";
import "./NewPatient.css";

import { API } from "aws-amplify";
import { onError } from "../lib/errorLib";
import { PatientType, GenderNames } from "../types/PatientType";

import { useFormik } from 'formik';
import * as yup from 'yup';

export default function NewPatient() {
    const [isLoading, setIsLoading] = useState(false);

    const nav = useNavigate();

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

    function createPatient(patient: PatientType) {
        return API.post("patients", "/patients", {
            body: patient,
        });
    }

    async function onSubmit(values: PatientType) {
        setIsLoading(true);

        try {
            await createPatient(values);
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
        <div className="NewPatient">
            <h2 className="pb-3 mt-4 mb-3 border-bottom">Create a new patient</h2>
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
                        <option value={GenderNames.Male}>Female</option>
                        <option value={GenderNames.Male}>Other</option>
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
