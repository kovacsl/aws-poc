import { Table } from "sst/node/table";
import handler from "@patients/core/handler";
import dynamoDb from "@patients/core/dynamodb";
import { APIGatewayProxyEvent } from "aws-lambda";

export const main = handler(async (event: APIGatewayProxyEvent) => {
  const params = {
    TableName: Table.Patients.tableName,
  };

  const result = await dynamoDb.scan(params);

  // Return the matching list of items in response body
  return JSON.stringify(result.Items);
});