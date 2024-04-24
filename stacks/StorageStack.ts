import { StackContext, Table } from "sst/constructs";

export function StorageStack({ stack }: StackContext) {
  // Create the DynamoDB table
  const table = new Table(stack, "Clients", {
    fields: {
      clientId: "string",
      clientSecret: "string",
    },
    primaryIndex: { partitionKey: "clientId", sortKey: "clientSecret" },
  });

  return {
    table,
  };
}