import { Table } from "sst/node/table";
import handler from "@patients/core/handler";
import dynamoDb from "@patients/core/dynamodb";

export const main = handler(async (event) => {
  const data = JSON.parse(event.body || "{}");

  const params = {
    TableName: Table.Patients.tableName,
    Key: {
      // The attributes of the item to be created
      patientId: event?.pathParameters?.id, // The id of the client
    },
    // 'UpdateExpression' defines the attributes to be updated
    // 'ExpressionAttributeValues' defines the value in the update expression
    UpdateExpression: "SET firstName = :firstName, lastName = :lastName, email = :email, gender = :gender, birthDate = :birthDate,modifiedAt = :modifiedAt",
    ExpressionAttributeValues: {
      ":firstName": data.firstName || null,
      ":lastName": data.lastName || null,
      ":email": data.email || null,
      ":gender": data.gender || null,
      ":birthDate": Date.parse(data.birthDate) || null,
      ":modifiedAt": Date.now(),
    },
    // 'ReturnValues' specifies if and how to return the item's attributes,
    // where ALL_NEW returns all attributes of the item after the update; you
    // can inspect 'result' below to see how it works with different settings
    ReturnValues: "ALL_NEW",
  };

  await dynamoDb.update(params);

  return JSON.stringify({ status: true });
});