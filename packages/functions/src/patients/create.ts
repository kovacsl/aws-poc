import handler from "@patients/core/handler";
import { APIGatewayProxyEvent } from "aws-lambda";
import database from "@patients/core/database";

export const main = handler(async (event: APIGatewayProxyEvent) => {
  let data = {
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    gender: undefined,
  };

  if (event.body) {
    data = JSON.parse(event.body);
  }

  const patient = await database.create(event.requestContext?.authorizer?.lambda?.databaseProvider, event.requestContext?.authorizer?.lambda?.databaseUrl, {
    // The attributes of the item to be created
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    gender: data.gender,
    birthDate: data.birthDate,
  })

  return JSON.stringify(patient);
});