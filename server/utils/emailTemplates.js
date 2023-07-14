let resetPassword = (email, token) => {
    const emailTemplate = {
      from: "noreply@gmail.com",
      to: email,
      subject: "Password reset for " + email,
      // text:
      //   "Password Reset Link: " + "localhost:3000/" + "resetPassword/" + token,
      html: `<p>Password Reset Link: <a href="http://localhost:3000/resetPassword/${token}" style="color: blue;">Click here</a></p>`,
    };
    return emailTemplate;
  };
  
  module.exports = { resetPassword };
  