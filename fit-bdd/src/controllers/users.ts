import { Router } from "express";
import UserManager from "../business/users";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const router = Router();
const MAILER_URL =
  process.env.MAILER_BASE_URL;

const userManager = new UserManager();

router.get("/", async (req, res) => {
  try {
    const { email } = req.query;
    let users;
    if (email && typeof email === "string") {
      users = await userManager.getUserByEmail(email);
    } else {
      console.log("Fetching all users");
      users = await userManager.getAllUsers();
    }
    if (!users || (Array.isArray(users) && users.length === 0)) {
      return res.status(404).send({ message: "No users found" });
    }
    res.status(200).send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Route to verify user email
router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;
    if (!token || typeof token !== "string") {
      console.error("Invalid or missing verification token.");
      return res.status(400).send("Invalid or missing verification token.");
    }
    const user = await userManager.findUserByVerificationToken(token);
    if (!user) {
      console.error("User not found with the provided verification token.");
      return res.status(400).send("Invalid or expired verification token.");
    }
    user.isEmailVerified = true;
    user.verificationToken = null;
    await userManager.updateUser(user.id, user);
    res.status(200).send("Email verified successfully.");
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).send("Internal server error.");
  }
});

router.post("/", async (req, res) => {
  try {
    const { email, name, surname, password, googleId, xId } = req.body;

    if (!name || !surname) {
      return res.status(400).send("Name and surname are required.");
    }
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
        message:
          "Registration successful! Please check your email to verify your account.",
        user,
      });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send({ error: "Failed to create user" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;

    const updatedUser = await userManager.updateUser(parseInt(id), userData);

    res.status(200).send({
      message: `User with id ${id} updated successfully.`,
      updatedUser,
    });
  } catch (error) {
    console.error("Failed to update user:", error);
    res.status(500).send({ error: "Failed to update user" });
  }
});


router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body; 

    const updatedUser = await userManager.updateUserProfile(parseInt(id), userData);

    res.status(200).send({
      message: `User with id ${id} updated successfully.`,
      updatedUser,
    });
  } catch (error) {
    console.error("Failed to update user:", error);
    res.status(500).send({ error: "Failed to update user" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).send({ error: "Invalid user ID" });
    }
    const user = await userManager.getUserById(parseInt(id));

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }
    res.status(200).send(user);
  } catch (error) {
    console.error("Failed to retrieve user:", error);
    res.status(500).send({ error: "Failed to retrieve user" });
  }
});

// Delete a user
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await userManager.deleteUser(parseInt(id));

    res
      .status(200)
      .send({ message: `User with id ${id} deleted successfully.` });
  } catch (error) {
    console.error("Failed to delete user:", error);
    res.status(500).send({ error: "Failed to delete user" });
  }
});

router.get("/stripeCustomer/:id", async (req, res) =>{
  try{
    const { id } = req.params;
    const result = await userManager.getUserByStripeCustomerId(id);

    res.status(200).send({data: result});
  } catch (error) {
    console.error("Failed to get user by Id:", error);
    res.status(500).json({ error: "Failed to retreive user by id" });
  }
});

export default router;
