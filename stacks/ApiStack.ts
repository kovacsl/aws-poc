import { Api, StackContext, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";

export function ApiStack({ stack }: StackContext) {
  const { clientTable, patientTable } = use(StorageStack);

  // Create the API
  const api = new Api(stack, "Api", {
    // Enabled by default
    cors: true,
    defaults: {
      authorizer: "iam",
      function: {
        bind: [clientTable, patientTable],
      },
    },
    routes: {
      "POST /patients": "packages/functions/src/patients/create.main",
      "GET /patients/{id}": "packages/functions/src/patients/get.main",
      "GET /patients": "packages/functions/src/patients/list.main",
      "PUT /patients/{id}": "packages/functions/src/patients/update.main",
      "DELETE /patients/{id}": "packages/functions/src/patients/delete.main",
    },
  });

  // Show the API endpoint in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  // Return the API resource
  return {
    api,
  };
}