import handler from "@patients/core/handler";
import { APIGatewayProxyEvent } from "aws-lambda";
import { Table } from "sst/node/table";
import dynamoDb from "@patients/core/dynamodb";
import base64url from "base64url";
import { Config } from "sst/node/config";
import { sign } from "jsonwebtoken";

interface ClientType {
  clientId?: string;
  clientSecret?: string;
  clientName?: string;
  scopes?: string;
  databaseProvider?: string;
  databaseUrl?: string;
  createdAt?: string;
  modifiedAt?: string;
}

export const main = handler(async (event: APIGatewayProxyEvent) => {
  const requestObject = JSON.parse(event.body ?? "");

  const scope = requestObject?.scope?.split(',') ?? [];

  const params = {
    TableName: Table.Clients.tableName,
    // 'Key' defines the partition key and sort key of
    // the item to be retrieved
    Key: {
      clientId: requestObject?.client_id, // The id of the client
    },
  };

  const result = await dynamoDb.get(params);

  if (!result.Item) {
    throw new Error("Client not found.");
  }

  const client: ClientType = JSON.parse(JSON.stringify(result.Item));

  if (client.clientSecret != requestObject.client_secret) {
    throw new Error("Invalid credentials.");
  }
  if (!scope.every((s: string) => client.scopes?.split(",").includes(s))) {
    throw new Error("Invalid scopes.");
  }

  function getJsonWebToken(clientId: string, scope: string[], event: APIGatewayProxyEvent): string {
    const jwt_exp_in_sec: number = parseInt(process.env.JWT_EXP_IN_SEC ?? "3600", 10);

    const payload = {
      exp: Math.floor(Date.now() / 1000) + jwt_exp_in_sec,
      iat: Math.floor(Date.now() / 1000),
      iss: `${event.requestContext.domainName}`,
      client_id: clientId,
      scope: scope
    }

    return sign(payload, Config.JWT_SECRET_KEY_PEM, { algorithm: 'HS256' });
  }

  const jwt = getJsonWebToken(requestObject.client_id ?? "", scope, event);

  return JSON.stringify({ access_token: jwt });
});