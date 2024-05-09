const User = require('../Models/user.js');
const { hashString, CompareString, createJwt } = require('../Utils/index.js');
const { sendVerificationEmail } = require('../Utils/sendEmail.js');

const register = async (req, res, next) => {
  const { firstName, lastName, email, password ,profession,role} = req.body;

  if (!firstName || !lastName || !email || !password || !profession) {
    next("Provide Required Fields");
    return;
  }

  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      next("Email Already exists");
      return;
    }

    const passwordHash = await hashString(password);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: passwordHash,
      profession,
      role
    });

  sendVerificationEmail(newUser, res);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Validation
    if (!email || !password) {
      next("Please Provide User Credentials");
      return;
    }

    // Find user by email
    const passwordHash = await hashString(password);
    console.log("passwordHash",passwordHash);
    const user = await User.findOne({ email, password : passwordHash },{ password: 0}).populate({
      path: "friends",
      //select: "firstName lastName location profileUrl -password",
    });
    console.log(user , "user")
    if (!user) {
      next("Invalid email or password");
      return;
    }

    if (!user.verified) {
      next(
        "User email is not verified. Check your email account and verify your email"
      );
      return;
    }

    // Compare password
    // const isMatch = await CompareString(password, user.password);

    // if (!isMatch) {
    //   next("Invalid email or password");
    //   return;
    // }

    // user.password = undefined;

    const token = createJwt(user._id);

    res.status(201).json({
      success: true,
      message: "Login successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

module.exports = { register, login };