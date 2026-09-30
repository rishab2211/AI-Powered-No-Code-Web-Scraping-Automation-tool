import { ExecutionEnvironment } from "@/app/types/executor";
import { ExtractDataWithAiTask } from "../task/ExtractDataWithAI";
import prisma from "@/lib/prisma";
import { symmetricDecrypt } from "@/lib/encryption";
import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai"

export async function ExtractDataWithAiExecutor(environment: ExecutionEnvironment<typeof ExtractDataWithAiTask>): Promise<boolean> {
    try {

        const credentials = environment.getInput("Credentials");
        if (!credentials) {
            environment.log.error("input->credentials not found");
            return false;
        }

        const prompt = environment.getInput("Prompt");
        if (!prompt) {
            environment.log.error("input->prompt not found");
            return false;
        }

        const content = environment.getInput("Content");
        if (!content) {
            environment.log.error("input->content not found");
            return false;
        }

        const propertyName = environment.getInput("Property name");
        if (!propertyName) {
            environment.log.info("input->property name not provided");
        }

        // Get credentials from DB
        const credential = await prisma.credential.findUnique({
            where: { id: credentials }
        });

        if (!credential) {
            environment.log.error("credential not found");
            return false;
        }

        const plainCredentialValue = symmetricDecrypt(credential.value);
        if (!plainCredentialValue) {
            environment.log.error("cannot decrypt credential");
            return false;
        }

        // --- AI Client Initialization & Model Interaction ---

        // Correct constructor usage: Pass API key directly
        const ai = new GoogleGenerativeAI(plainCredentialValue);

        // Define the system instruction clearly
        const systemInstruction = `You are a webscraper helper that extracts data from HTML or text. You will be given a piece of text or HTML content as input and also the prompt with the data that you have to extract from that content. Your response should be only the extracted data as a single JSON object (not an array of objects), without any additional words, explanations, or Markdown formatting.Analyze the input carefully and extract data precisely based on the prompt. If no data is found, return an empty JSON object {}. Work only with the provided content and ensure the output is always a valid JSON object without any surrounding text or Markdown code block markers.For example, instead of returning:[{"usernameSelector": "#username"}, {"passwordSelector": "#password"}, {"buttonSelector": "input[type='submit']"}]Return only:{"usernameSelector": "#username", "passwordSelector": "#password", "buttonSelector": "input[type='submit']"}Do not use arrays at all in your response. Combine all extracted data into a single flat JSON object.`



        // generative model instance
        const model = ai.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: systemInstruction
        });

        // Combine the user's extraction prompt and the content into the user message
        const combinedUserInput = `Prompt: ${prompt}\n\nContent:\n${content}`;

        //generate content
        const contents = [
            {
                role: "user",
                parts: [{ text: combinedUserInput }]
            }
        ];

        environment.log.info(`Sending request to Gemini model '${model.model}'`);

        // Call generateContent on the model instance
        const result = await model.generateContent({ contents });

        // Correctly access the response text
        const response = result.response;

        const aiResponseText = response.text();

        const propertyValue = propertyName ? await findProperty(aiResponseText, propertyName, model) : "";

        environment.log.info("Received response from AI.");
        environment.log.info(`Tokens sent : ${response.usageMetadata?.promptTokenCount}`);
        environment.log.info(`Response tokens : ${response.usageMetadata?.candidatesTokenCount}`);


        // Output the raw text response from the AI (which should be JSON)

        environment.setOutput("Extracted data", aiResponseText);
        environment.log.info("Successfully set 'Extracted data' output");
        environment.setOutput("Property value", propertyValue);
        environment.log.info("Successfully set 'Property value' output")
       





        return true;
    } catch (err: any) {
        environment.log.error(err.message)
        return false;

    }
}



async function findProperty(data: string, propertyName: string, model: GenerativeModel) {

    //generate content
    const contents = [
        {
            role: "user",
            parts: [{ text: `find the property with property name '${propertyName}' or something related if exist in ${data} and give only its value in return without any formatting` }]
        }
    ];


    // Call generateContent on the model instance
    const result = await model.generateContent({ contents });

    // Correctly access the response text
    const response = result.response;

    const aiResponseText = response.text();

    return aiResponseText;

}