import { ExecutionEnvironment } from "@/app/types/executor";
import { DeliverViaWebhook } from "../task/DeliverViaWebhook";

export async function DeliverViaWebhookExecutor(environment: ExecutionEnvironment<typeof DeliverViaWebhook>): Promise<boolean> {
    try {

        const targetUrl = environment.getInput("Target URL");
        if (!targetUrl) {
            environment.log.error("input->target URL not defined");
            return false;
        }

        const body = environment.getInput("Body");
        if (!body) {
            environment.log.error("input->body not defined");
            return false;
        }

        const response = await fetch(targetUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })

        const status = response.status;
        if (status !== 200) {
            environment.log.error(`Error occured with status code : ${status}`)
            return false;
        }

        const responseBody = await response.json();
        environment.log.info(JSON.stringify(responseBody,null,4))

        return true;
    } catch (err: any) {
        environment.log.error(err.message)
        return false;

    }
}