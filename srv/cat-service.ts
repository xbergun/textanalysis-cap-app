import cds from "@sap/cds";
import axios from "axios";

export default cds.service.impl(async function () {
    this.on("analyzeText", async (req) => {
        const text: string = req.data.text;
        const HF_API_KEY: string | undefined = process.env.HF_API_KEY;
        const API_URL: string = "https://api-inference.huggingface.co/models/openai-community/gpt2";

        if (!HF_API_KEY) {
            return req.error(500, "Hugging Face API Key is missing");
        }

        try {
            const response = await axios.post<{ generated_text: string }[]>(
                API_URL,
                { inputs: text },
                {
                    headers: {
                        Authorization: `Bearer ${HF_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.data || response.data.length === 0) {
                return req.error(500, "API returned an empty response");
            }

            return { generated_text: response.data[0].generated_text };
        } catch (error) {
            console.error("Hugging Face API Error:", error);
            return req.error(500, "Failed to analyze text");
        }
    });
});
