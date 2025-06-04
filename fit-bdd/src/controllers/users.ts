import { Router, Request, Response, NextFunction } from "express";
import UserManager from "../business/users";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import {
  userSchema,
  idSchema,
  emailSchema,
  tokenSchema,
} from "../validations/index";

const router = Router();
const MAILER_URL = process.env.MAILER_BASE_URL;
const userManager = new UserManager();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("hellloooooooo")
    const { email } = req.query;
    let users;
    if (email && typeof email === "string") {
      const { error } = emailSchema.validate({ email });
      if (error) throw new Error(error.details[0].message);
      users = await userManager.getUserByEmail(email);
    } else {
      users = await userManager.getAllUsers();
    }
    if (!users || (Array.isArray(users) && users.length === 0)) {
      return res.status(404).send({ message: "No users found" });
    }
    res.status(200).send(users);
  } catch (error) {
    console.log(error, "jdsjdnjkndsjdn")
    next(error);
  }
});

// Route to verify user email
router.get("/verify-email", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.query;
    const { error } = tokenSchema.validate({ token });
    if (error) throw new Error(error.details[0].message);

    const user = await userManager.findUserByVerificationToken(token as string);
    if (!user) {
      throw new Error("Invalid or expired verification token.");
    }

    // Check if the user is already verified
    if (user.isEmailVerified) {
      return res.status(200).json({ message: "Email is already verified." });
    }

    user.isEmailVerified = true;
    user.verificationToken = null;
    await userManager.updateUser(user.id, user);
    res.status(200).send("Email verified successfully.");
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = userSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    const { email, name, surname, password, googleId, xId } = req.body;
    let verificationToken = password ? uuidv4() : null;
    const user = await userManager.createUser({
      email,
      name,
      surname,
      password,
      googleId,
      xId,
      verificationToken,
      isEmailVerified: googleId ? true : false,
    });

    if (googleId) {
      const profileCompletionUrl = `${process.env.APP_URL}/complete-profile`;
      const welcomeUrl = `${process.env.BACKEND_URL}/mailer/mail/send-welcome-email`;

      await axios.post(welcomeUrl, {
        email,
        name,
        url: profileCompletionUrl,
      });
      res.status(201).send(user);
    } else {
      const verificationUrl = `${process.env.APP_URL}/verify-email?token=${verificationToken}`;
      await axios.post(
        `${process.env.BACKEND_URL}/mailer/mail/send-verification-email`,
        {
          email,
          name,
          verificationUrl,
        }
      );
      res.status(201).send({
        message: "Registration successful! Please check your email to verify your account.",
        user,
      });
    }
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { error: idError } = idSchema.validate(id);
    if (idError) throw new Error(idError.details[0].message);

    const { error: userError } = userSchema.validate(req.body);
    if (userError) throw new Error(userError.details[0].message);

    const updatedUser = await userManager.updateUser(parseInt(id), req.body);
    res.status(200).send({
      message: `User with id ${id} updated successfully.`,
      updatedUser,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { error: idError } = idSchema.validate(id);
    if (idError) throw new Error(idError.details[0].message);

    const { error: userError } = userSchema.validate(req.body);
    if (userError) throw new Error(userError.details[0].message);

    const updatedUser = await userManager.updateUserProfile(parseInt(id), req.body);
    res.status(200).send({
      message: `User with id ${id} updated successfully.`,
      updatedUser,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { error } = idSchema.validate(id);
    if (error) throw new Error(error.details[0].message);

    const user = await userManager.getUserById(parseInt(id));
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
});

// Delete a user
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { error } = idSchema.validate(id);
    if (error) throw new Error(error.details[0].message);

    await userManager.deleteUser(parseInt(id));
    res.status(200).send({ message: `User with id ${id} deleted successfully.` });
  } catch (error) {
    next(error);
  }
});

router.get("/stripeCustomer/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { error } = idSchema.validate(id);
    if (error) throw new Error(error.details[0].message);

    const result = await userManager.getUserByStripeCustomerId(id);
    res.status(200).send({ data: result });
  } catch (error) {
    next(error);
  }
});

export default router;
