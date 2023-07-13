const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
});

//similar to user.create we create our own function on model for signup user.signup

userSchema.statics.signup = async function (email, password) {
  //validate email
  if (!email || !password) {
    throw Error("Email and password are required");
  }

  if (!validator.isEmail(email)) {
    throw Error("Email is invalid");
  }
  //validate password
  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough");
  }

  const exists = await this.findOne({ email });
  if (exists) {
    throw Error("Email already exists");
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = await this.create({ email, password: hash });
  return user;
};

userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("Email and password are required");
  }

  if (!validator.isEmail(email)) {
    throw Error("Email is invalid");
  }
  //validate password
  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough");
  }
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Email does not exist");
  }
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Credentials do not match");
  }
  return user;
};

userSchema.statics.forgot = async function (email) {
  if (!validator.isEmail(email)) {
    throw Error("Email not valid");
  }
  if (!email) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Email not found");
  }
  return user;
};

userSchema.statics.reset = async function (_id, newpassword, confirmpassword) {
  console.log("inside reset usermodel");

  if (!validator.isStrongPassword(newpassword)) {
    throw Error("Password not strong enough");
  }

  if (!newpassword || !confirmpassword) {
    throw Error("All fields must be filled");
  }
  if (newpassword !== confirmpassword) {
    throw Error("Password mismatch");
  }

  const user = await this.findOne({ _id });
  if (!user) {
    throw Error("invalid token");
  }
  console.log(newpassword, "new password");
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newpassword, salt);

  try {
    
    const newuser= await this.findByIdAndUpdate(
      {_id},
      { password: hash },
    );
    console.log(newuser,"newuser in usermodel")
  } catch (error) {
    console.log(error)
  }
  
  console.log(newuser,"newuser");

  // this.findByIdAndUpdate(_id, {password:newpassword}, { new: true });
  // console.log(user, "user in usermodel");

  //  user.password
  return user;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
