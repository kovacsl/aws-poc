import { Table } from "sst/node/table";
import handler from "@patients/core/handler";
import dynamoDb from "@patients/core/dynamodb";

export const main = handler(async (event) => {
  
  const params = {
    TableName: Table.Patients.tableName,
    Key: {
      // The attributes of the item to be created
      patientId: event?.pathParameters?.id, // The id of the client
    },
  };

  await dynamoDb.delete(params);

  return JSON.stringify({ status: true });
});