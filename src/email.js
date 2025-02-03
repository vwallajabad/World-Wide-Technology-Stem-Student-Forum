require("dotenv").config();
const nodemailer = require("nodemailer");

const data = {
  subject: 'example',
  sender: 'example <example@example.com>',
  htmlcode: "example",
  htmlreport: "example"
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
