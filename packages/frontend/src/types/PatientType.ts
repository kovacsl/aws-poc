export interface PatientType {
    patientId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    gender?: GenderNames;
    birthDate?: string;
    createdAt?: string;
    modifiedAt?: string;
}

export enum GenderNames {
    Male = "male",
    Female = "female",
    Other = "other",
}