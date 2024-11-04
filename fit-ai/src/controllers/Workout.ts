import { Router } from "express";
import WorkoutManager from "../business/Workout";

const workoutManager = new WorkoutManager();

const router = Router();

router.post("/", async (req, res, next) => {
  try {
    const { userData, startDate, endDate } = req.body;

    if (!userData || !startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Missing userData, startDate, or endDate in request body." });
    }

    const plan = await workoutManager.generateWorkoutPlan(userData, startDate, endDate);

    res.status(200).send(plan);
  } catch (error) {
    console.error("Failed to generate workout plan:", error);
    res.status(500).send(error);
  }
});

export default router;
