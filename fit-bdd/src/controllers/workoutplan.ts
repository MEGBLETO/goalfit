import { Router } from "express";
import WorkoutManager from "../business/workoutplan";
import isAuthenticated from "../middlewares/isAuth";

const router = Router();
const workoutManager = new WorkoutManager();

// Get all workout plans for the authenticated user
router.get("/", isAuthenticated, async (req, res) => {
  const userId = (req as any).userId;

  try {
    const workoutPlans = await workoutManager.getWorkoutPlansForUser(userId);
    res.status(200).json(workoutPlans);
  } catch (error) {
    console.error("Error fetching workout plans for user:", error);
    res.status(500).json({ error: "Failed to fetch workout plans for user" });
  }
});

// Get default workout plans (not user-specific)
router.get("/default", async (req, res) => {
  try {
    const defaultWorkoutPlans = await workoutManager.getDefaultWorkoutPlans();
    res.status(200).json(defaultWorkoutPlans);
  } catch (error) {
    console.error("Error fetching default workout plans:", error);
    res.status(500).json({ error: "Failed to fetch default workout plans." });
  }
});


// Create a new workout plan
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { day, workouts } = req.body;

    if (!userId || !day || !workouts || !Array.isArray(workouts)) {
      return res.status(400).json({
        error: "Invalid input data. Ensure all required fields are provided.",
      });
    }

    const workoutPlan = await workoutManager.createWorkoutPlan({
      userId,
      day,
      workouts,
    });
    res.status(201).json(workoutPlan);
  } catch (error) {
    console.error("Error creating workout plan:", error);
    res.status(500).json({ error: "Failed to create workout plan" });
  }
});

// create workout plans
router.post("/bulk", isAuthenticated, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { workoutPlans, isDefault = false } = req.body;
    if (!Array.isArray(workoutPlans) || workoutPlans.length === 0) {
      return res.status(400).json({
        error: "Invalid input data. Ensure all required fields are provided.",
      });
    }
    const result = await workoutManager.bulkCreateWorkoutPlans({
      userId: isDefault ? null : userId,
      workoutPlans,
      isDefault, 
    });
    res.status(201).json(result);
  } catch (error) {
    console.error("Error bulk creating workout plans:", error);
    res.status(500).json({ error: "Failed to bulk create workout plans." });
  }
});

// Get a workout plan by ID
router.get("/:id", isAuthenticated, async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid workout plan ID" });
  }

  try {
    const workoutPlan = await workoutManager.getWorkoutPlanById(id);
    if (!workoutPlan) {
      return res.status(404).json({ error: "Workout plan not found" });
    }
    res.status(200).json(workoutPlan);
  } catch (error) {
    console.error("Error fetching workout plan:", error);
    res.status(500).json({ error: "Failed to fetch workout plan" });
  }
});


// Replace an existing workout plan by deleting and recreating it
router.put("/workoutplans", isAuthenticated, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { workoutPlans } = req.body;

    if (!workoutPlans || !Array.isArray(workoutPlans)) {
      return res.status(400).json({ message: "Workout plans data is required" });
    }

    const updatedWorkoutPlans = await workoutManager.replaceWorkoutPlans(userId, workoutPlans);
    res.status(200).send(updatedWorkoutPlans);
  } catch (error) {
    console.error("Error updating workout plans:", error);
    res.status(500).json({ error: "Failed to update workout plans" });
  }
});


// Update an existing workout plan
router.put("/:id", isAuthenticated, async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid workout plan ID" });
  }

  try {
    const updatedWorkoutPlan = await workoutManager.updateWorkoutPlan(
      id,
      req.body
    );
    res.status(200).json(updatedWorkoutPlan);
  } catch (error) {
    console.error("Error updating workout plan:", error);
    res.status(500).json({ error: "Failed to update workout plan" });
  }
});


// Delete a workout plan for a specific date
router.delete("/date", isAuthenticated, async (req, res) => {
  const userId = (req as any).userId;
  const { date } = req.body;

  if (!date) {
    return res.status(400).send({ error: "Date is required." });
  }

  try {
    const result = await workoutManager.deleteWorkoutPlanByDate(userId, date);
    res
      .status(200)
      .send({ message: `Workout plan for date ${date} deleted successfully.` });
  } catch (error) {
    console.error("Error deleting workout plan by date:", error);
    res
      .status(500)
      .send({ error: "Failed to delete workout plan for the specified date." });
  }
});

// Delete all workout plans for the authenticated user
router.delete("/all", isAuthenticated, async (req, res) => {
  const userId = (req as any).userId;

  try {
    await workoutManager.deleteAllWorkoutPlansForUser(userId);
    res
      .status(200)
      .send({ message: "All workout plans deleted successfully." });
  } catch (error) {
    console.error("Error deleting all workout plans:", error);
    res
      .status(500)
      .send({ error: "Failed to delete all workout plans for the user." });
  }
});

// Delete a workout plan by ID
router.delete("/:id", isAuthenticated, async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid workout plan ID" });
  }

  try {
    await workoutManager.deleteWorkoutPlan(id);
    res.status(200).json({ message: "Workout plan deleted successfully." });
  } catch (error) {
    console.error("Error deleting workout plan:", error);
    res.status(500).json({ error: "Failed to delete workout plan." });
  }
});


export default router;
