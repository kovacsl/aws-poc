import { StackContext, Table } from "sst/constructs";

export function StorageStack({ stack }: StackContext) {
  // Create the DynamoDB table
  const clientTable = new Table(stack, "Clients", {
    fields: {
      clientId: "string",
      clientSecret: "string",
    },
    primaryIndex: { partitionKey: "clientId", sortKey: "clientSecret" },
  });

  const patientTable = new Table(stack, "Patients", {
    fields: {
      patientId: "string",
    },
    primaryIndex: { partitionKey: "patientId" },
  });


  return {
    clientTable,
    patientTable
  };
}