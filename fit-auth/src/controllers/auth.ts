import express from "express";
import bcrypt from "bcryptjs";
import passport from "passport";
import axios from "axios";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  const { email, password, name, surname } = req.body;

  if (!name || !surname || !email || !password) {
    return res
      .status(400)
      .send("Name, surname, email, and password are required.");
  }
  try {
    let userExists = false;
    try {
      const userResponse = await axios.get(
        `${process.env.BACKEND_BASE_URL}/bdd/user`,
        {
          params: { email },
        }
      );
      if (userResponse.data) {
        userExists = true;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 404) {
          userExists = false; 
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }
    if (userExists) {
      return res.status(409).send("You already have an account please login!");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = { email, password: hashedPassword, name, surname };

    const response = await axios.post(
      `${process.env.BACKEND_BASE_URL}/bdd/user`,
      userData
    );
    if (response.status === 201) {
      return res.status(201).send("User registered successfully.");
    }
    return res.status(response.status).send(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error registering user:", error.message);
    } else {
      console.error("Unexpected error registering user:", error);
    }
    return res.status(500).send("Error registering user.");
  }
});


router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const response = await axios.get(`${process.env.BACKEND_BASE_URL}/bdd/user`, {
      params: { email }
    });
    if (response.status === 200 && response.data) {
      const user = response.data;

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "5h" }
      );
      return res.status(200).json({ token });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error logging in:", error);

    if (axios.isAxiosError(error) && error.response) {
      return res.status(error.response.status).json({
        message: error.response.data || "Error logging in"
      });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});


router.post("/request-password-reset", async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }
  try {
    const userResponse = await axios.get(`${process.env.BACKEND_BASE_URL}/bdd/user`, {
      params: { email }
    });
    const user = userResponse.data;
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const resetToken = uuidv4();
    const resetTokenExpiry = new Date(Date.now() + 3600000); 
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await axios.put(`${process.env.BACKEND_BASE_URL}/bdd/user/${user.id}`, user);
    const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}&email=${email}`;
    await axios.post(`${process.env.BACKEND_BASE_URL}/mailer/mail/send-password-reset-email`, {
      email: user.email,
      name: user.name,
      resetUrl,
    });
    return res.status(200).json({ message: "Password reset link sent to your email." });
  } catch (error) {
    console.error("Error requesting password reset:", error);

    if (axios.isAxiosError(error)) {
      return res.status(error.response?.status || 500).json({
        message: error.response?.data || "Internal server error.",
      });
    }
    return res.status(500).json({ message: "Internal server error." });
  }
});


router.post("/reset-password", async (req: Request, res: Response) => {
  const { email, token, password } = req.body;
  try {
    const user: any = (
      await axios.get(`${process.env.BACKEND_BASE_URL}/bdd/user/?email=${email}`)
    ).data;
    if (
      !user ||
      user.resetToken !== token ||
      user.resetTokenExpiry < new Date()
    ) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await axios.put(`${process.env.BACKEND_BASE_URL}/bdd/user/${user.id}`, user);

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["openid", "profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  async (req: Request, res: Response) => {
    try {
      const userData = req.user as any;
      const id = userData.id;
      const { familyName, givenName } = userData.name;
      const email = userData.emails[0].value;
      let user;
      try {
        const response = await axios.get(
          `${process.env.BACKEND_BASE_URL}/bdd/user/?email=${email}`
        );

        if (response.status === 200 && response.data) {
          user = response.data;

          if (!user.googleId) {
            return res.status(401).json({
              message:
                "Your account is registered with email and password. Please log in using those credentials.",
            });
          }
        } else {
          console.log("No user found, proceeding to create a new one...");
          throw new Error("User not found, proceeding to creation.");
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response && err.response.status === 404) {
            const newUserResponse = await axios.post(
              `${process.env.BACKEND_BASE_URL}/bdd/user`,
              {
                email: email,
                name: givenName,
                surname: familyName,
                googleId: id,
              }
            );
            user = newUserResponse.data;
          } else {
            throw err;
          }
        } else {
          console.error("An error occurred:", err);
          throw err;
        }
      }
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
      }
      const token = jwt.sign({ userId: user.id, email: user.email }, secret);
      res.redirect(`${process.env.APP_URL}/google-callback?token=${token}`);
    } catch (error) {
      console.error("Error with OAuth process:", error);
      res.status(500).send("Error with OAuth process");
    }
  }
);

export default router;
