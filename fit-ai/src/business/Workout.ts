import OpenAI from "openai";
import { encode } from "gpt-3-encoder";
import { jsonrepair } from "jsonrepair";
import { query } from '../utils/ai';
import logger from '../utils/logger';
import workoutFormat from "../data/workoutFormat";

class WorkoutManager {
  generateWorkoutPrompt(
    userData: any,
    responseFormat: {},
    startDate: string,
    endDate: string
  ): string {
    return `Generate a detailed daily workout plan in JSON format for someone with the following data ${JSON.stringify(
      userData
    )}, including each day from ${startDate} to ${endDate}. Each workout should include the name, description, duration, intensity, and exercises. Each exercise must include the body part, name, description, and reps. The plan should be tailored to their fitness goals, fitness level, equipment available, and any health considerations such as ${userData.healthConsiderations.join(
      ", "
    )}. The response should be structured for easy exploration and calendar integration, in JSON format and in French, adhering to this schema: ${JSON.stringify(
      responseFormat
    )}, with specific dates for each day.`;
  }

  async generateWorkoutPlanForWeek(
    userData: any,
    startDate: string,
    endDate: string
  ): Promise<any> {
    console.log(
      `Generating workout plan for the week from ${startDate} to ${endDate}...`
    );
    logger.info(
      `Generating workout plan for the week from ${startDate} to ${endDate}.`
    );

    const messages = [
      {
        role: "system",
        content:
          "You are a helpful assistant that provides structured JSON responses.",
      },
      {
        role: "user",
        content: this.generateWorkoutPrompt(
          userData,
          workoutFormat,
          startDate,
          endDate
        ),
      },
    ];

    try {
      const response = await query(messages);

      if (response) {
        console.log("Received response from OpenAI API.");
        logger.info("Response received from OpenAI API.");
        logger.debug(`Raw API response: ${response}`);

        console.log("Raw API response type:", typeof response);
        if (typeof response === "string") {
          console.log("Raw API response (string):", response);
        } else {
          console.log("Raw API response (object):", JSON.stringify(response, null, 2));
        }

        const cleanResponse = typeof response === "string" ? this.cleanJSON(response) : JSON.stringify(response);

        console.log("Cleaned JSON response:", cleanResponse);

        try {
          const parsedPlan = JSON.parse(cleanResponse);
          logger.info("Parsed workout plan.", { parsedPlan });

          console.log("Parsed workout plan structure:", parsedPlan);

          if (
            parsedPlan &&
            parsedPlan.workoutPlan &&
            Array.isArray(parsedPlan.workoutPlan)
          ) {
            return parsedPlan;
          } else {
            console.log(
              "Parsed plan is empty or not properly structured:",
              parsedPlan
            );
            logger.warn("Parsed plan is empty or not properly structured.", {
              parsedPlan,
            });
            return null;
          }
        } catch (error) {
          console.log("Error parsing JSON response:", error);
          logger.error("Error parsing JSON response:", error);
          return null;
        }
      } else {
        console.log("No response received or response is empty.");
        logger.warn("No response received or response is empty.");
        return null;
      }
    } catch (error) {
      console.log(
        "Error with OpenAI API while generating workout plan:",
        error
      );
      logger.error(
        "Error with OpenAI API while generating workout plan:",
        error
      );
      return null;
    }
  }

  async generateWorkoutPlan(
    userData: any,
    startDate: string,
    endDate: string
  ): Promise<any> {
    console.log(
      `Generating full workout plan from ${startDate} to ${endDate}...`
    );
    logger.info(`Generating full workout plan from ${startDate} to ${endDate}.`);
    const finalPlan: any[] = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);
    let provisionalWeight: number = userData.weight ?? 0;
    const maxRetries = 3;

    while (currentDate <= end) {
      const weekStartDate = this.formatDate(currentDate);
      currentDate.setDate(currentDate.getDate() + 6);
      let weekEndDate = this.formatDate(currentDate);
      if (new Date(weekEndDate) > end) {
        weekEndDate = endDate;
      }
      currentDate.setDate(currentDate.getDate() + 1);

      console.log(
        `Generating plan for week starting on ${weekStartDate} and ending on ${weekEndDate}...`
      );
      logger.info(
        `Generating plan for week starting on ${weekStartDate} and ending on ${weekEndDate}.`
      );

      let weeklyWorkoutPlan = null;
      let retries = 0;

      while (!weeklyWorkoutPlan && retries < maxRetries) {
        weeklyWorkoutPlan = await this.generateWorkoutPlanForWeek(
          userData,
          weekStartDate,
          weekEndDate
        );

        if (!weeklyWorkoutPlan) {
          retries += 1;
          console.log(`Retrying... (${retries}/${maxRetries}) for week ${weekStartDate} to ${weekEndDate}`);
          logger.warn(`Retrying... (${retries}/${maxRetries}) for week ${weekStartDate} to ${weekEndDate}`);
        }
      }

      if (weeklyWorkoutPlan) {
        try {
          weeklyWorkoutPlan.workoutPlan.forEach((dayPlan: any) => {
            finalPlan.push({
              date: dayPlan.day || "",
              workouts: Array.isArray(dayPlan.workouts)
                ? dayPlan.workouts.map((workout: any) => ({
                    name: workout.name || "",
                    description: workout.description || "",
                    duration: workout.duration || "",
                    intensity: workout.intensity || "",
                    exercises: Array.isArray(workout.exercises)
                      ? workout.exercises.map((exercise: any) => ({
                          name: exercise.name || "",
                          reps: exercise.reps || "",
                          bodyPart: exercise.bodyPart || "", // Add body part to the exercise
                          description: exercise.description || "",
                        }))
                      : [],
                  }))
                : [],
            });
          });
        } catch (error) {
          console.log(
            "Error processing weekly workout plan:",
            error,
            "Raw response:",
            weeklyWorkoutPlan
          );
          logger.error(
            "Error processing weekly workout plan:",
            error,
            "Raw response:",
            weeklyWorkoutPlan
          );
        }
      } else {
        console.log(
          `Failed to generate weekly workout plan for dates: ${weekStartDate} to ${weekEndDate} after ${maxRetries} retries.`
        );
        logger.error(
          `Failed to generate weekly workout plan for dates: ${weekStartDate} to ${weekEndDate} after ${maxRetries} retries.`
        );
      }

      if (userData.goals.includes("weight_loss")) {
        provisionalWeight -= 0.5;
      } else if (userData.goals.includes("muscle_gain")) {
        provisionalWeight += 0.25;
      }
    }

    console.log("Final generated workout plan:", finalPlan);
    logger.info("Final generated workout plan.", { finalPlan });
    return finalPlan;
  }

  cleanJSON(response: any): string {
    try {
      console.log("Cleaning JSON response...");
      logger.info("Cleaning JSON response.");

      if (typeof response === "string") {
        return jsonrepair(response);
      } else {
        return JSON.stringify(response);
      }
    } catch (error) {
      console.log("Error repairing JSON:", error);
      logger.error("Error repairing JSON:", error);
      throw new Error("Failed to repair JSON");
    }
  }

  formatDate(date: Date): string {
    const formattedDate = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    console.log(`Formatted date: ${formattedDate}`);
    logger.info(`Formatted date: ${formattedDate}`);
    return formattedDate;
  }
}

export default WorkoutManager;
