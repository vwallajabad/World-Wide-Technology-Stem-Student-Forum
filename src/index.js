require("dotenv").config();
const open = require("openai");
const nodemailer = require("nodemailer");


const openai = new open.OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

async function generateEmailContent() {
  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1:free",
      messages: [
        {
          role: "user",
          content: `Generate a JSON object with the following structure:
              {
                  "subject": "A subject line that creates urgency.",
                  "sender": "A sender name and email address.",
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
              subject:    {   type: "string",   description: "Urgent subject line from a real company.",            },
              sender:     {   type: "string",   description: "Legitimate-looking sender name and email.",           },
              htmlcode:   {   type: "string",   description: "Full HTML email with urgency and CTA.",               },
              htmlreport: {   type: "string",   description: "Standalone HTML document on spotting scam emails.",   },
            },
            required: ["subject", "sender", "htmlcode", "htmlreport"],
            additionalProperties: false,
          },
        },
      },
    });

    
    if (!completion || !completion.choices || completion.choices.length === 0) {
      throw new Error("Invalid response from OpenRouter");
    }

    const jsonMatch = completion.choices[0].message.content.match(/```json\n([\s\S]+?)\n```/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1]);
    } else {
      throw new Error("Failed to extract JSON from AI response.");
    }
  } catch (error) {
    console.error("Error generating email content:", error);
    return null;
  }
}

async function sendEmail() {
  const data = await generateEmailContent();
  if (!data) return;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.APP_PASSWORD,
    },
  });


  const encodedHtmlReport = encodeURIComponent(data.htmlreport);

  const updatedHtmlCode = data.htmlcode.replace(
    "'https://example.com'",
    `https://wwt-stem-student-forum.web.app/?text=${encodedHtmlReport}`
  );

  const mailOptions = {
    from: data.sender,
    to: process.env.EMAIL_RECEIVER,
    subject: data.subject,
    html: updatedHtmlCode,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent successfully:", info.response);
    }
  });
}

sendEmail();
