import { v4 as uuidv4 } from 'uuid';
import handler from "@patients/core/handler";
import { APIGatewayProxyEvent } from "aws-lambda";
import { Table } from "sst/node/table";
import dynamoDb from "@patients/core/dynamodb";

export const main = handler(async (event: APIGatewayProxyEvent) => {
  let data = {
    patientId: "",
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    gender: undefined,
  };

  if (event.body) {
    data = JSON.parse(event.body);
  }

  const params = {
    TableName: Table.Patients.tableName,
    Item: {
      // The attributes of the item to be created
      patientId: uuidv4(), // The id of the author
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      gender: data.gender,
      birthDate: Date.parse(data.birthDate),
      createdAt: Date.now(), // Current Unix timestamp
      modifiedAt: Date.now(), // Current Unix timestamp
    },
  };

  await dynamoDb.put(params);

  return JSON.stringify(params.Item);
});