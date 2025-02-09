import cds, { Request } from "@sap/cds";
import axios from "axios";
import { AnalyzeTextResponse, CustomError } from "./lib/types/global.types";

export default cds.service.impl(async function () {
    this.on("analyzeText", async (req: Request) => {
        const text: string = req.data.text;
        const HF_API_KEY: string | undefined = process.env.HF_API_KEY;
        const API_URL: string | undefined = process.env.API_URL;

        if (!HF_API_KEY) {
            return new CustomError("HF_API_KEY is not set", 400);
        }

        try {
            const response = await axios.post<AnalyzeTextResponse[]>(
                API_URL as string,
                { inputs: text },
                {
                    headers: {
                        Authorization: `Bearer ${HF_API_KEY}`,
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