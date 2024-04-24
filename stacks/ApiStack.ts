import { Api, StackContext, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";

export function ApiStack({ stack }: StackContext) {
  const { table } = use(StorageStack);

  // Create the API
  const api = new Api(stack, "Api", {
    // Enabled by default
    cors: true,
    defaults: {
      authorizer: "iam",
      function: {
        bind: [table],
      },
    },
    routes: {
      "POST /clients": "packages/functions/src/clients/create.main",
      "GET /clients/{id}": "packages/functions/src/clients/get.main",
      "GET /clients": "packages/functions/src/clients/list.main",
      "PUT /clients/{id}": "packages/functions/src/clients/update.main",
      "DELETE /clients/{id}": "packages/functions/src/clients/delete.main",
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