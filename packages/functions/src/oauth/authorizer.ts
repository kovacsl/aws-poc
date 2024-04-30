import { APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult } from "aws-lambda";
import { Config } from "sst/node/config";
import { verify, JwtPayload } from "jsonwebtoken";
import dynamoDb from "@patients/core/dynamodb";
import { Table } from "sst/node/table";


interface CustomJwtPayload extends JwtPayload {
    client_id?: string;
    scopes?: string;
}

export const main = async function (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> {
    const authentication = await authenticate(event);

    const result: APIGatewayAuthorizerResult = {
        principalId: authentication.value?.clientId || "unkown",
        policyDocument: buildPolicy(authentication.success ? "Allow" : "Deny", event.methodArn),
    };

    if (authentication.success && authentication.value?.scopes) {
        result.context = {
            permissions: authentication.value?.scopes.split(",").join(" "),
            databaseProvider: authentication.value?.databaseProvider,
            databaseUrl: authentication.value?.databaseUrl,
        };
    }

    return result;
};

async function authenticate(event: any): Promise<any> {
    try {
        const token = getTokenOrThrow(event);
        const info = await getUserInfo(token);
        return { success: true, value: info };
    } catch (error: any) {
        console.log(error);
        return { success: false }
    }
}

function buildPolicy(effect: string, methodArn: string) {
    const getResource = (methodArn: string) => {
        const parts = methodArn.split('/');

        return `${parts.shift()}/*/*`;
    }

    return {
        Version: "2012-10-17",
        Statement: [
            {
                Action: "execute-api:Invoke",
                Effect: effect,
                Resource: getResource(methodArn),
            },
        ],
    };
}

const getTokenOrThrow = (event: any) => {
    const auth = (event.authorizationToken || "");
    const [schema, token] = auth.split(" ", 2);
    if ((schema || "").toLowerCase() !== "bearer") {
        throw new Error("Authorization header value did not start with 'Bearer'.");
    }
    if (!token?.length) {
        throw new Error("Authorization header did not contain a Bearer token.");
    }
    return token;
};

const getUserInfo = async (token: string) => {
    const decoded = verify(token, Config.JWT_SECRET_KEY_PEM)

    const payload = decoded as CustomJwtPayload;

    const params = {
        TableName: Table.Clients.tableName,
        // 'Key' defines the partition key and sort key of
        // the item to be retrieved
        Key: {
            clientId: payload?.client_id, // The id of the client
        },
    };

    const result = await dynamoDb.get(params);

    if (!result.Item) {
        throw new Error("Client not found.");
    }

    return JSON.parse(JSON.stringify(result.Item));
}