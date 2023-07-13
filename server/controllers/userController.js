const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { resetPassword } = require("../utils/emailTemplates");
const { sendEmail } = require("../utils/sendEmail");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    // console.log(user);
    //create token
    const token = createToken(user._id);
    res.status(200).json({ email, token });
  }
  catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }

};

//signup user
const signupUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.signup(email, password);
    // console.log(user);
    //create token
    const token = createToken(user._id);
    res.status(200).json({ email, token });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};

const forgotpassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.forgot(email);
    console.log(user,'in the forgot password user controller');
    const newToken = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_RESET_PW_KEY,
      {
        expiresIn: "20m",
      }
    );
    console.log(newToken);
    const emailTemplate = resetPassword(email, newToken);
    console.log(emailTemplate,"email template in user controller")
    sendEmail(emailTemplate);
    res.status(200).json({
      status: true,
      message: "Email for reset password has been sent",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const resetpassword = async (req, res) => {
  const newToken = req.params.newToken;
  const { newpassword, confirmpassword } = req.body;
  try {
    const decoded = jwt.verify(newToken, process.env.JWT_RESET_PW_KEY);
    console.log(decoded, "inside resetpassoword in usercontroller");

    const user = await User.reset(decoded._id, newpassword, confirmpassword);
    res.status(200).json({
      status: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {
  loginUser,
  signupUser,
  forgotpassword,
  resetpassword
};
