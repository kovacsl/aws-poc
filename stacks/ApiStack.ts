import { Api, Config, StackContext, use, Function } from "sst/constructs";
import { StorageStack } from "./StorageStack";

export function ApiStack({ stack }: StackContext) {
  const { clientTable } = use(StorageStack);

  const JWT_SECRET_KEY_PEM = new Config.Secret(stack, "JWT_SECRET_KEY_PEM");


  // Create the API
  const api = new Api(stack, "Api", {
    // Enabled by default
    cors: true,
    authorizers: {
      lambdaAuthorizer: {
        type: "lambda",
        function: new Function(stack, "AuthorizerFunction", {
          handler: "packages/functions/src/oauth/authorizer.main",
          bind: [clientTable, JWT_SECRET_KEY_PEM],
        }),
        resultsCacheTtl: "30 seconds",
      },
    },
    defaults: {
      authorizer: "iam",
      function: {
        bind: [clientTable, JWT_SECRET_KEY_PEM],
      },
    },
    routes: {
      "POST /oauth/token": {
        function: {
          handler: "packages/functions/src/oauth/token.main",
          timeout: 20,
        },
      },

      "POST /clients": "packages/functions/src/clients/create.main",
      "GET /clients/{id}": "packages/functions/src/clients/get.main",
      "GET /clients": "packages/functions/src/clients/list.main",
      "PUT /clients/{id}": "packages/functions/src/clients/update.main",
      "PUT /clients/{id}/lua": "packages/functions/src/clients/lua.main",
      "DELETE /clients/{id}": "packages/functions/src/clients/delete.main",
    },
  });

  api.addRoutes(stack, {
    "POST /patients": {
      authorizer: "lambdaAuthorizer",
      function: "packages/functions/src/patients/create.main",
    },
    "GET /patients/{id}": {
      authorizer: "lambdaAuthorizer",
      function: "packages/functions/src/patients/get.main"
    },
    "GET /patients": {
      authorizer: "lambdaAuthorizer",
      function: "packages/functions/src/patients/list.main"
    },
    "PUT /patients/{id}": {
      authorizer: "lambdaAuthorizer",
      function: "packages/functions/src/patients/update.main"
    },
    "DELETE /patients/{id}": {
      authorizer: "lambdaAuthorizer",
      function: "packages/functions/src/patients/delete.main"
    },
    "POST /channel/{id}": {
      authorizer: "lambdaAuthorizer",
      function: "packages/functions/src/lua/execute.main",
    },
  })
  // Show the API endpoint in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
  });

  // Return the API resource
  return {
    api,
  };
}