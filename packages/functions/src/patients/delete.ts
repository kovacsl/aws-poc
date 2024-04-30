import handler from "@patients/core/handler";
import database from "@patients/core/database";

export const main = handler(async (event) => {
  const result = await database.delete(
    event.requestContext?.authorizer?.lambda?.databaseProvider, 
    event.requestContext?.authorizer?.lambda?.databaseUrl, 
    event?.pathParameters?.id);

  return JSON.stringify({ status: result });
});