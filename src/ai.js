const open = require("openai");

const openai = new open.OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY
})

async function main() {
  const completion = await openai.chat.completions.create({
    model: "deepseek/deepseek-r1:free",
    messages: [
        {
          role: "user",
          content: `Generate a JSON object with the following structure:
              {
                  "subject": "A subject line that creates urgency using real company names.",
                  "sender": "A sender name and email address using real company names.",
                  "htmlcode": "A professional HTML email with urgency, inline CSS, a CTA linking to 'https://example.com'.",
                  "htmlreport": "A standalone HTML document explaining how to spot scam emails with a link to 'https://example.com'."
              }
              Provide only the JSON output.`,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "email_phish_schema",
          schema: {
            type: "object",
            properties: {
              subject: {
                type: "string",
                description: "Urgent subject line from a real company.",
              },
              sender: {
                type: "string",
                description: "Legitimate-looking sender name and email.",
              },
              htmlcode: {
                type: "string",
                description: "Full HTML email with urgency and CTA.",
              },
              htmlreport: {
                type: "string",
                description: "Standalone HTML document on spotting scam emails.",
              },
            },
            required: ["subject", "sender", "htmlcode", "htmlreport"],
            additionalProperties: false,
          },
        },
      },
    });
    console.log(completion.choices[0].message.content)
    var contentS = JSON.parse(completion.choices[0].message.content.replace('```json', '').replace('```', ''));
    console.log(contentS);
  }

    main();
