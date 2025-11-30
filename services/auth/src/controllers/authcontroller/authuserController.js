import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import { createUserTokens } from "../../utils/createUserToken.js";
import { setAuthCookie } from "../../utils/setCookie.js";
import loginSchema from "../../validationSchema/loginSchema.js";
import registerSchema from "../../validationSchema/registerSchema.js";



/********************  User registration Controller here ***********************/
const registerUser = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      success: false,
      message: "Body is required.",
    });
  }
  const { error, value } = registerSchema.validate(req.body, { abortEarly: false });

  // If validation fails, return 400 with all validation errors
  if (error) {
    const validationErrors = error.details.map((err) => err.message);
    return res.status(400).json({
      success: false,
      message: "Invalid user data.",
      errors: validationErrors,
    });
  }
  try {
    const { name, email, password } = value;

    const userExists = await User.findOne({ email });

    if (userExists) return res.status(400).json({ message: "User already exists" });


    // Hash the password
    const salt = await bcrypt.genSalt(10); // 10 = number of salt rounds
    const hashedPassword = await bcrypt.hash(password, salt);



    // Create user with hashed password
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });


    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/******************** Login User Controller here ***********************/

const loginUser = async (req, res) => {

  if (!req.body) {
    return res.status(400).json({
      success: false,
      message: "Body is required.",
    });
  }

  const { error, value } = loginSchema.validate(req.body, { abortEarly: false });


  // If validation fails, return 400 with all validation errors
  if (error) {
    const validationErrors = error.details.map((err) => err.message);
    return res.status(400).json({
      success: false,
      message: "Invalid user data.",
      errors: validationErrors,
    });
  }

  try {
    const { email, password } = value;

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const tokenInfo = createUserTokens(user);
    setAuthCookie(res, tokenInfo);
    // If valid → return user data and token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: tokenInfo,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const googleCallbackController = async (req, res, next) => {
  try {
    let redirectTo = req.query.state ? (req.query.state) : "";

    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }

    const user = req.user;

    const tokenInfo = createUserTokens(user);
    setAuthCookie(res, tokenInfo);
    res.redirect(`${process.env.CORS_ORIGIN}/${redirectTo}`);
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

export { googleCallbackController, loginUser, registerUser };

