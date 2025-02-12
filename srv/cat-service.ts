import cds, { Request } from "@sap/cds";
import { getDestination } from "@sap-cloud-sdk/connectivity";
import axios from "axios";
import { AnalyzeTextResponse, CustomError } from "./lib/types/global.types";

export default cds.service.impl(async function () {

    this.on("analyzeText", async (req: Request) => {

        const text: string = req.data.text;

        const destinationService = await getDestination({
            destinationName: "HuggingFaceAPI",
        });

        const { URL, HuggingFaceAPIKey } =
            destinationService?.originalProperties || {};

        try {
            const response = await axios.post<AnalyzeTextResponse[]>(
                URL as string,
                { inputs: text },
                {
                    headers: {
                        Authorization: HuggingFaceAPIKey,
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
