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
      model: "google/gemini-2.0-pro-exp-02-05:free",
      messages: [
        {
          role: "user",
          content: `"Generate a JavaScript data object in JSON format with the following structure and content (make sure you use one company dont have paypal for on part and amazon or a different company for the HTML code of something):
1. Subject: A subject line that creates urgency, e.g., 'Immediate Action Required: Unusual Login Activity Detected'. USE SOMETHING BUT THE EXAMPLE (I would like you to use real company names)
2. Sender: A sender name and email address, e.g., 'Google Security Team <security@example.com>’. USE SOMETHING BUT THE EXAMPLE (I would like you to use real company names)
3. HTML Code: A professional-looking HTML email template with:
    * Use any website images or any assets on the internet (use favicons or any other images from companies) make it look realistic
    * A header, content section, and footer.
    * A sense of urgency in the message.
    * A call-to-action button with a link to https://example.com (use double quotes to wrap the link for href) LIKE THIS: href = "https://example.com"
    * for links USE ONLY example.com no other link even if its for a / page. I will use a replace on the json string to put my link
    * Styling using inline CSS.
4. HTML Report: A standalone HTML document that explains how to spot scam emails, including:
    * Make it friendly and and something like "Uh no" and add like a conversation things. Say stuff like "You fell for a phishing attack but cyber buddy is here to help!" stuff like that
    * Also let them know about our chatbot named CyberBuddy by clicking the button on the bottom right.
    * A list of common scam email characteristics and also specific ones to the one generated.
    * DONT HAVE ANY LINKS
    * Styling using inline CSS.

I want you to give me just the  json format of the following "subject":
"sender":
"htmlcode":
"htmlreport":
`,
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
    console.log(completion);
    if (!completion || !completion.choices || completion.choices.length === 0) {
      throw new Error("Invalid response from OpenRouter");
    }
    console.log(completion.choices[0].message.content)
    const jsonMatch = completion.choices[0].message.content;
    if (jsonMatch) {
      return JSON.parse(jsonMatch);
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
    '"https://example.com"',
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
