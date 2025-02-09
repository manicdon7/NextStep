function registrationEmailTemplate(name) {
  return `
      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to NextStep</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    
    .email-container {
      max-width: 600px;
      background: #ffffff;
      margin: 30px auto;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .logo {
      max-width: 120px;
      margin-bottom: 20px;
    }

    h2 {
      color: #0056b3;
      font-size: 24px;
      margin-bottom: 10px;
    }

    p {
      font-size: 16px;
      color: #444;
      line-height: 1.6;
    }

    .highlight {
      color: #007bff;
      font-weight: bold;
    }

.cta-button {
  display: inline-block;
  background: linear-gradient(135deg, #0056b3, #003d80);
  color: #ffffff; 
  font-size: 16px;
  padding: 12px 24px;
  border-radius: 5px;
  font-weight: bold;
  margin: 20px 0;
  transition: all 0.3s ease-in-out;
}

.cta-button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 15px rgba(0, 91, 187, 0.4);
  color: #ffffff ;
}



    hr {
      border: none;
      height: 1px;
      background: #ddd;
      margin: 25px 0;
    }

    .footer {
      font-size: 14px;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <img src="https://res.cloudinary.com/dvgpzftnf/image/upload/v1739110203/NextStep-temp_logo_fcks7d.jpg" alt="NextStep Logo" class="logo">
    <h2>Welcome to <span class="highlight">NextStep!</span></h2>
    <p>Hello <strong>${name}</strong>,</p>
    <p>We’re thrilled to have you as part of the <span class="highlight">NextStep</span> community! Our AI-driven platform is designed to help you explore career opportunities, enhance your skills, and take confident steps toward a brighter future.</p>
    <p>Start your journey today with AI-powered career guidance, expert recommendations, and personalized growth plans tailored just for you.</p>
    
    <a href="https://nextstep-frontend-ai.vercel.app/" class="cta-button">Get Started</a>

    <p>If you need any assistance, feel free to reach out to our support team.</p>
    
    <p>Best regards,</p>
    <p><strong>The NextStep Team</strong></p>
    <hr />
    
    <p class="footer">If you didn’t sign up for this account, please ignore this email. For support, contact us at <a href="mailto:nextstep.guide.org@gmail.com">nextstep.guide.org@gmail.com</a>.</p>
  </div>
</body>
</html>


    `;
}

function eventCreationEmailTemplate(name, eventName) {
  return `
      <h2>Your Career Event Has Been Created!</h2>
      <p>Hello ${name},</p>
      <p>Thank you for creating the event "<strong>${eventName}</strong>" on NextStep.</p>
      <p>Your event is now live! Aspiring professionals can now register and engage with career experts, mentors, and industry leaders.</p>
      <p>Stay connected and help shape the future careers of many!</p>
      <p>Best regards,</p>
      <p>The NextStep Team</p>
      <hr />
      <p>If you have any questions or need help, contact us at support@nextstep.ai</p>
    `;
}

module.exports = {
  registrationEmailTemplate,
  eventCreationEmailTemplate,
};
