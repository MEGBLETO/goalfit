import { jsonrepair } from "jsonrepair";
import logger from "../utils/logger";
import { query } from "../utils/ai";
import defaultmeal from "../data/defaultMealsdata";

const conciseFormat = {
  meals: {
    morning: {
      name: "string",
      foodname: "string",
      ingredients: ["string"],
      nutrition: {
        calories: "number",
        protein: "string",
        carbohydrates: "string",
        fat: "string",
      },
      recipe: [
        {
          instruction: "string",
          duration: "string",
        },
      ],
    },
    afternoon: {
      name: "string",
      foodname: "string",
      ingredients: ["string"],
      nutrition: {
        calories: "number",
        protein: "string",
        carbohydrates: "string",
        fat: "string",
      },
      recipe: [
        {
          instruction: "string",
          duration: "string",
        },
      ],
    },
    evening: {
      name: "string",
      foodname: "string",
      ingredients: ["string"],
      nutrition: {
        calories: "number",
        protein: "string",
        carbohydrates: "string",
        fat: "string",
      },
      recipe: [
        {
          instruction: "string",
          duration: "string",
        },
      ],
    },
  },
};

class MealPlanManager {
  generatePrompt(
    userData: {},
    mealTime: "morning" | "afternoon" | "evening",
    date: string
  ): string {
    logger.info(`Generating prompt for ${mealTime} on ${date}.`);
    return `Generate a detailed and diverse meal plan for ${mealTime} on ${date} in JSON format for someone with the following data ${JSON.stringify(
      userData
    )}. The meal should be varied from previous days and include essential nutritional information such as calories, protein, carbohydrates, and fat. Ensure that the breakfast meal is not based on eggs more than once in the weekly plan. Include a recipe for cooking, presented as an array of instructions with their durations. The response must be structured in strictly valid JSON format, adhering to this schema: ${JSON.stringify(
      conciseFormat.meals[mealTime]
    )}. Ensure all JSON keys are in English, but the values should be in French.`;
  }

  async generateMealForDay(
    userData: {},
    date: string,
    mealTime: "morning" | "afternoon" | "evening"
  ): Promise<any> {
    logger.info(`Generating ${mealTime} meal for ${date}.`);
    const messages = [
      {
        role: "system",
        content:
          "You are a helpful assistant that provides structured JSON responses.",
      },
      {
        role: "user",
        content: this.generatePrompt(userData, mealTime, date),
      },
    ];

    let retries = 1; // Retry just once
    while (retries >= 0) {
      try {
        const response = await query(messages, "gpt-4-turbo");

        if (response) {
          const cleanResponse = this.cleanJSON(response);
          const meal = JSON.parse(cleanResponse);

          if (this.validateMeal(meal, mealTime)) {
            logger.info(`Successfully generated ${mealTime} meal for ${date}.`);
            return meal;
          } else {
            logger.warn(
              `Invalid meal structure for ${mealTime} on ${date}. Retrying...`
            );
          }
        }
      } catch (error) {
        logger.error(
          `Error with OpenAI API while generating ${mealTime} meal:`,
          { error }
        );
      }

      retries--;
    }

    logger.error(
      `Failed to generate a valid ${mealTime} meal for ${date} after retry. Falling back to default meal.`
    );
    return this.getRandomDefaultMeal(mealTime);
  }

  async generateDayPlan(userData: {}, date: string): Promise<any> {
    logger.info(`Generating day plan for ${date}.`);
    const dayPlan: any = {
      day: this.getDayOfWeek(date),
      date: date,
      meals: {},
      total_nutrition: {
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0,
      },
    };

    for (const mealTime of ["morning", "afternoon", "evening"] as const) {
      const meal = await this.generateMealForDay(userData, date, mealTime);
      if (meal) {
        dayPlan.meals[mealTime] = meal;
        dayPlan.total_nutrition.calories += meal.nutrition.calories;
        dayPlan.total_nutrition.protein += parseInt(meal.nutrition.protein, 10);
        dayPlan.total_nutrition.carbohydrates += parseInt(
          meal.nutrition.carbohydrates,
          10
        );
        dayPlan.total_nutrition.fat += parseInt(meal.nutrition.fat, 10);
      }
    }

    logger.info(`Completed generation of day plan for ${date}.`);
    return dayPlan;
  }

  async generatePlan(
    userData: {},
    startDate: string,
    endDate: string
  ): Promise<any> {
    logger.info(`Generating full plan from ${startDate} to ${endDate}.`);
    const finalPlan: any[] = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      const dateStr = this.formatDate(currentDate);
      const dayPlan = await this.generateDayPlan(userData, dateStr);

      if (dayPlan) {
        finalPlan.push(dayPlan);
        logger.info(`Added day plan for ${dateStr} to final plan.`);
      } else {
        logger.error(`Failed to generate day plan for date: ${dateStr}`);
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    logger.info("Final plan generation complete.");
    return finalPlan;
  }

  cleanJSON(response: string): string {
    try {
      logger.info("Cleaning JSON response.");
      return jsonrepair(response);
    } catch (error) {
      logger.error("Error repairing JSON:", { error });
      throw new Error("Failed to repair JSON");
    }
  }

  validateMeal(meal: any, mealTime: string): boolean {
    type MealType = {
      name: string;
      foodname: string;
      ingredients: string[];
      nutrition: {
        calories: number;
        protein: string;
        carbohydrates: string;
        fat: string;
      };
      recipe: {
        instruction: string;
        duration: string;
      }[];
    };

    const expectedSchema = conciseFormat.meals[
      mealTime as "morning" | "afternoon" | "evening"
    ] as unknown as MealType;
    const mealTyped = meal as Partial<MealType>;

    const isValid =
      mealTyped &&
      typeof mealTyped === "object" &&
      Object.keys(expectedSchema).every((key) => {
        return (
          key in mealTyped &&
          typeof (mealTyped as any)[key as keyof MealType] ===
            typeof expectedSchema[key as keyof MealType]
        );
      });

    logger.info(`Meal validation for ${mealTime} returned: ${isValid}`);
    return isValid;
  }

  getRandomDefaultMeal(mealTime: "morning" | "afternoon" | "evening"): any {
    logger.info(`Returning random default meal for ${mealTime}.`);
    const defaultMeals = defaultmeal[mealTime];
    const randomIndex = Math.floor(Math.random() * defaultMeals.length);
    return defaultMeals[randomIndex];
  }

  formatDate(date: Date): string {
    const formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    logger.info(`Formatted date: ${formattedDate}`);
    return formattedDate;
  }

  getDayOfWeek(dateString: string): string {
    const days = [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ];
    const date = new Date(dateString);
    const dayOfWeek = days[date.getUTCDay()];
    logger.info(`Day of week for ${dateString}: ${dayOfWeek}`);
    return dayOfWeek;
  }
}

export default MealPlanManager;
