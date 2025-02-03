require("dotenv").config();
const fs = require("fs");
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
              subject:    { type: "string", description: "Urgent subject line from a real company." },
              sender:     { type: "string", description: "Legitimate-looking sender name and email." },
              htmlcode:   { type: "string", description: "Full HTML email with urgency and CTA." },
              htmlreport: { type: "string", description: "Standalone HTML document on spotting scam emails." },
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

async function sendEmails() {
  let emailList;
  try {
    const fileContent = fs.readFileSync("emails.txt", "utf-8");
    emailList = fileContent.split("\n").map(email => email.trim()).filter(email => email);
  } catch (error) {
    console.error("Error reading emails.txt:", error);
    return;
  }

  if (emailList.length === 0) {
    console.error("No valid email addresses found.");
    return;
  }

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

  for (const recipient of emailList) {
    const mailOptions = {
      from: data.sender,
      to: recipient,
      subject: data.subject,
      html: updatedHtmlCode,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${recipient}:`, info.response);
    } catch (error) {
      console.error(`Error sending to ${recipient}:`, error);
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

sendEmails();
