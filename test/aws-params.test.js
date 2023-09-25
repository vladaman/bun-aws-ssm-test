import {SSMClient, GetParametersCommand} from '@aws-sdk/client-ssm'
import {test} from "bun:test";

const client = new SSMClient({
    region: "eu-west-1"
})

client.middlewareStack.add(next => async (args) => {
    const response = await next(args);
    console.log(response);
    return response
}, {step: 'build'})

async function getParameters(names) {
    const params = {
        Names: names,
    };
    try {
        const command = new GetParametersCommand(params);
        const response = await client.send(command);
        console.log('parameter', response);
        return response.Parameters?.map((p) => {
            return p.Value;
        });
    } catch (e) {
        console.log(e);
        return [];
    }
}

test("ssm", async () => {
    await getParameters(["foo"])
});
