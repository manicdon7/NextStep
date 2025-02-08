const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: false,
  auth: {
    user: "nextstep.guide.org@gmail.com",
    pass: "wixl vpix zyuw vbhq",
  },
});
async function sendEmail(to, subject, html, cc) {
  const mailOptions = {
    from: "nextstep.guide.org@gmail.com",
    to: to,
    cc: cc,
    subject: subject,
    html: html,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Failed to send email", error);
  }
}

module.exports = sendEmail;