import handler from "@patients/core/handler";
import database from "@patients/core/database";

export const main = handler(async (event) => {
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

  const patient = await database.update(
    event.requestContext?.authorizer?.lambda?.databaseProvider,
    event.requestContext?.authorizer?.lambda?.databaseUrl,
    event?.pathParameters?.id, {
    // The attributes of the item to be created
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    gender: data.gender,
    birthDate: data.birthDate,
  })

  return JSON.stringify(patient);
});