import { v4 as uuidv4 } from 'uuid';
import handler from "@patients/core/handler";
import { APIGatewayProxyEvent } from "aws-lambda";
import { Table } from "sst/node/table";
import dynamoDb from "@patients/core/dynamodb";

export const main = handler(async (event: APIGatewayProxyEvent) => {
  let data = {
    clientName: "",
    scopes: "",
    databaseProvider: "",
    databaseUrl: "",
  };

  if (event.body) {
    data = JSON.parse(event.body);
  }

  const params = {
    TableName: Table.Clients.tableName,
    Item: {
      // The attributes of the item to be created
      clientId: btoa(uuidv4()), // The id of the author
      clientSecret: uuidv4(), // A unique uuid
      clientName: data.clientName,
      scopes: data.scopes,
      databaseProvider: data.databaseProvider,
      databaseUrl: data.databaseUrl,
      createdAt: Date.now(), // Current Unix timestamp
      modifiedAt: Date.now(), // Current Unix timestamp
    },
  };

  await dynamoDb.put(params);

  return JSON.stringify(params.Item);
});