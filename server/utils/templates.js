function registrationEmailTemplate(name) {
    return `
      <h2>Welcome to NextStep!</h2>
      <p>Hello ${name},</p>
      <p>Thank you for joining NextStep, your AI-driven career guidance platform.</p>
      <p>We are excited to have you on board! Start exploring personalized career paths, upskill with AI-driven recommendations, and take the next step towards your future.</p>
      <p>Best regards,</p>
      <p>The NextStep Team</p>
      <hr />
      <p>If you didn’t sign up for this account, please ignore this email.</p>
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
