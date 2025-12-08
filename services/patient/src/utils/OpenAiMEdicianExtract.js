import openai from "../config/openai.js";

const OpenAiMEdicianExtract = async (medications) => {


    // Call OpenAI GPT-4
    const response = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
            {
                role: "system",
                content: "You are an assistant that outputs ONLY valid JSON. No explanation. No extra text."
            },
            {
                role: "user",
                content: `${medications}. Extract all medication names and dosages. Return ONLY a JSON array like this: [{
                    "medicine": {
                        "name": "Morphine",
                        "strength": "130 mg",
                        "instructions": "1 cap daily"
                    },
                    "schedule": {
                        "times": ["08:00"],
                        "start_date": "2025-02-01",
                        "frequency_type": "daily",
                        "dosage_per_intake": "1 capsule"
                    }
                    }
                ]`
            }
        ],
        temperature: 0
    });


    let aiOutput = response.choices[0].message.content;
    // Convert the string to a real JS array
    let medicationsArray = JSON.parse(aiOutput);


    return medicationsArray;
}

export default OpenAiMEdicianExtract;