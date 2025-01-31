require("dotenv").config();
const nodemailer = require("nodemailer");

const data = {
  subject: "Urgent: Suspicious Activity Detected on Your Microsoft Account",
  sender: "Microsoft Security Team <security@microsoft.com>",
  htmlcode:
    "<!DOCTYPE html><html><head><style>body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; } .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); } .header { text-align: center; padding: 10px 0; border-bottom: 1px solid #ddd; } .content { padding: 20px 0; } .footer { text-align: center; padding: 10px 0; border-top: 1px solid #ddd; font-size: 12px; color: #777; } .button { display: inline-block; padding: 10px 20px; background-color: #0078d4; color: #ffffff; text-decoration: none; border-radius: 5px; }</style></head><body><div class='container'><div class='header'><img src='https://www.microsoft.com/favicon.ico' alt='Microsoft Logo'><h2>Security Alert</h2></div><div class='content'><p>We detected unusual activity on your Microsoft account. Please verify your account to ensure it's secure.</p><p><a href='https://example.com' class='button'>Verify Your Account Now</a></p></div><div class='footer'><p>If you did not initiate this request, contact us at <a href='mailto:security@microsoft.com'>security@microsoft.com</a>.</p></div></div></body></html>",
  htmlreport:
    "<!DOCTYPE html><html><head><style>body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; } .container { max-width: 800px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); } h1 { color: #333; } ul { list-style-type: disc; padding-left: 20px; } a { color: #0078d4; text-decoration: none; }</style></head><body><div class='container'><h1>How to Spot Scam Emails</h1><p>Scam emails often have the following characteristics:</p><ul><li>Urgent or threatening language</li><li>Requests for personal information</li><li>Generic greetings like 'Dear Customer'</li><li>Misspelled words or poor grammar</li><li>Suspicious sender email addresses</li></ul><p>For more information, visit <a href='https://example.com'>our security page</a>.</p></div></body></html>",
};

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
    console.log(error);
  } else {
    console.log("Email sent: " + info.response);
  }
});
