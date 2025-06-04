import { Router } from "express";
import MealPlanManager from "../business/mealplan";
import isAuthenticated from "../middlewares/isAuth";

const router = Router();
const mealPlanManager = new MealPlanManager();


// Get all meal plans for a user
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID not found" });
    }
    const mealPlans = await mealPlanManager.getMealPlansForUser(
      parseInt(userId)
    );
    res.status(200).send(mealPlans);
  } catch (error) {
    console.error("Error fetching meal plans for user:", error);
    res.status(500).json({ error: "Failed to fetch meal plans for user" });
  }
});

router.get("/", isAuthenticated, async (req, res) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID not found" });
    }
    const mealPlans = await mealPlanManager.getMealPlansForUser(
      parseInt(userId)
    );
    res.status(200).send(mealPlans);
  } catch (error) {
    console.error("Error fetching meal plans for user:", error);
    res.status(500).json({ error: "Failed to fetch meal plans for user" });
  }
});


//add multiples mealplans or a singleone
router.post("/mealplans", isAuthenticated, async (req, res) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(400).send({ message: "User ID not found in the request" });
    }
    const { mealplans, isDefault = false } = req.body;  
    if (!mealplans || mealplans.length === 0) {
      return res.status(400).send({ message: "Mealplans data is required" });
    }
    const mealPlanData = { userId, mealplans, isDefault };
    const result = await mealPlanManager.bulkCreateMealPlans(mealPlanData);
    res.status(200).send(result);
  } catch (error) {
    console.log(error, "Error occurred while creating meal plans");
    res.status(500).send(error);
  }
});




// Update a meal plan
router.put("/mealplans", isAuthenticated, async (req, res) => {
  try {
    const userId = (req as any).userId;
    const { mealplans } = req.body;
    if (!mealplans) {
      return res.status(400).json({ message: "Meal plans data is required" });
    }
    console.log(mealplans);
    const updatedMealPlan = await mealPlanManager.replaceMealPlans(
      userId,
      mealplans
    );
    res.status(200).send(updatedMealPlan);
  } catch (error) {
    console.error("Error updating meal plan:", error);
    res.status(500).json({ error: "Failed to update meal plan" });
  }
});


// Delete a meal plan
router.delete("/", isAuthenticated, async (req, res) => {
  const { date } = req.body;
  const userId = (req as any).userId; 
  try {
    const result = await mealPlanManager.deleteMealPlan(userId, date);
    res.status(200).send(result);
  } catch (error) {
    console.error("Error deleting meal plan:", error);
    res.status(500).json({ error: "Failed to delete meal plan." });
  }
});


router.delete("/mealplans", async (req, res) => {
  const { userId } = req.body;

  try {
    const result = await mealPlanManager.deleteAllMealPlansForUser(userId);
    res.status(200).send(result);
  } catch (error) {
    console.error("Error deleting meal plans:", error);
    res.status(500).json({ error: "Failed to delete meal plans." });
  }
});

router.get("/default", async (req, res) => {
  try {
    const defaultMealPlans = await mealPlanManager.getDefaultMealPlans();
    res.status(200).send(defaultMealPlans);
  } catch (error) {
    console.error("Error fetching default meal plans:", error);
    res.status(500).json({ error: "Failed to fetch default meal plans." });
  }
});


router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const userId = (req as any).userId; 
    const mealPlanId = parseInt(req.params.id, 10); 
    if (!userId) {
      return res.status(400).json({ message: "User ID not found" });
    }
    if (isNaN(mealPlanId)) {
      return res.status(400).json({ message: "Invalid meal plan ID" });
    }
    const mealPlan = await mealPlanManager.getMealPlanById(mealPlanId);
    
    if (mealPlan.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized to view this meal plan" });
    }
    res.status(200).send(mealPlan);
  } catch (error) {
    console.error("Error fetching meal plan:", error);
    res.status(500).json({ error: "Failed to fetch meal plan" });
  }
});


export default router;
