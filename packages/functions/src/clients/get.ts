import { Table } from "sst/node/table";
import handler from "@patients/core/handler";
import dynamoDb from "@patients/core/dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";


export const main = handler(async (event: APIGatewayProxyEvent) => {
  const params = {
    TableName: Table.Clients.tableName,
    // 'Key' defines the partition key and sort key of
    // the item to be retrieved
    Key: {
      clientId: event?.pathParameters?.id, // The id of the client
    },
  };

  const result = await dynamoDb.get(params);
  if (!result.Item) {
    throw new Error("Item not found.");
  }

  // Return the retrieved item
  return JSON.stringify(result.Item);
});