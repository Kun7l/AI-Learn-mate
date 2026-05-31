import { User } from "../models/user.js";

/**
 * @description Checks if the current request has an active session.
 * Returns the user data if authenticated, or 401 if not.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
export function checkSession(req, res) {
  if (req.session.user) {
    res.status(200).json({ user: req.session.user });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
}

/**
 * @description Authenticates a user with email and password.
 * Creates a session on successful login.
 *
 * @param {import('express').Request} req - Express request with `userEmail` and `userPassword` in body
 * @param {import('express').Response} res - Express response object
 */
export async function login(req, res) {
  const { userEmail: email, userPassword: password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Email not registered" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "wrong password" });
    }

    // Credentials valid — create session
    req.session.user = user;
    return res.status(200).json({ user });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * @description Destroys the current session and logs the user out.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 */
export function logout(req, res) {
  req.session.destroy(() => {});
  res.status(200).json("success");
}

/**
 * @description Registers a new user with the provided profile data.
 *
 * @param {import('express').Request} req - Express request with user data in body
 *   (userName, userEmail, userPassword, userAge, userEducation, userBoard)
 * @param {import('express').Response} res - Express response object
 */
export async function signup(req, res) {
  const user = {
    name: req.body.userName,
    email: req.body.userEmail,
    password: req.body.userPassword,
    age: req.body.userAge,
    education: req.body.userEducation,
    board: req.body.userBoard,
  };

  try {
    const userData = new User(user);
    await userData.save();
    res.status(200).json({ message: "successfully data entered" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(400).json({ message: "error" });
  }
}
