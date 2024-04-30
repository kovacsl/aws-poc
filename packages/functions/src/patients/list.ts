import handler from "@patients/core/handler";
import database from "@patients/core/database";
import { APIGatewayProxyEvent } from "aws-lambda";

export const main = handler(async (event: APIGatewayProxyEvent) => {

  const result = await database.list(
    event.requestContext?.authorizer?.lambda?.databaseProvider,
    event.requestContext?.authorizer?.lambda?.databaseUrl,
    event.queryStringParameters?.limit,
    event.queryStringParameters?.offset
  );

  // Return the matching list of items in response body
  return JSON.stringify(result);
});