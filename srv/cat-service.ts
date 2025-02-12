import cds, { Request } from "@sap/cds";
import axios from "axios";
import { AnalyzeTextResponse, CustomError } from "./lib/types/global.types";

export default cds.service.impl(async function () {

    const destinationService2 = await cds.connect.to("HuggingFaceAPI");

    console.log("DESTINATION SERVICE", destinationService2);


    this.on("analyzeText", async (req: Request) => {
        //const destinationService = await cds.connect.to("destination");
        const destinationService2 = await cds.connect.to("HuggingFaceAPI");


        console.log("DESTINATION SERVICE", destinationService2);
        const destination = await destinationService2.get("HuggingFaceAPI");

        const text: string = req.data.text;


        if (!destination || !destination.URL || !destination.HuggingFaceAPIKey) {
            return req.error(500, "Failed to retrieve API credentials from destination");
        }


        const HF_API_KEY: string | undefined = process.env.HF_API_KEY;
        const API_URL: string | undefined = process.env.API_URL;

        if (!HF_API_KEY) {
            return new CustomError("HF_API_KEY is not set", 400);
        }

        try {
            const response = await axios.post<AnalyzeTextResponse[]>(
                destination.URL as string,
                { inputs: text },
                {
                    headers: {
                        Authorization: destination.HuggingFaceAPIKey,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.data || response.data.length === 0) {
                return new CustomError("Failed to analyze text", 500);
            }
            return response.data[0] as AnalyzeTextResponse;
        } catch (error) {
            return new CustomError("Failed to analyze text", 500);
        }
    });
});