import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

class MealPlanManager {
  async getMealPlansForUser(userId: number) {
    try {
      const mealPlans = await prisma.mealPlan.findMany({
        where: { userId },
        include: {
          morningMeal: {
            include: {
              nutrition: true, 
            },
          },
          afternoonMeal: {
            include: {
              nutrition: true, 
            },
          },
          eveningMeal: {
            include: {
              nutrition: true, 
            },
          },
        },
      });
      return mealPlans;
    } catch (error) {
      console.error(`Error fetching meal plans for user with id ${userId}:`, error);
      throw new Error("Failed to fetch meal plans for user.");
    }
  }
  


  async bulkCreateMealPlans(data: any) {
    try {
      const { userId, mealplans } = data;

      console.log(data)
      const createdMealPlans = await prisma.$transaction(async (prisma) => {
        const mealPlansToCreate = [];

        for (const mealplan of mealplans) {
          const { date, meals } = mealplan;

          const existingMealPlan = await prisma.mealPlan.findUnique({
            where: {
              userId_day: {
                userId: userId,
                day: new Date(date),
              },
            },
          });
          if (existingMealPlan) {
            throw new Error(
              `A meal plan already exists for user ${userId} on ${date}`
            );
          }
          const morningMeal = await this.createMeal(prisma, meals.morning);
          const afternoonMeal = await this.createMeal(prisma, meals.afternoon);
          const eveningMeal = await this.createMeal(prisma, meals.evening);

          mealPlansToCreate.push({
            userId,
            day: new Date(date),
            morningMealId: morningMeal.id,
            afternoonMealId: afternoonMeal.id,
            eveningMealId: eveningMeal.id,
          });
        }
        return await prisma.mealPlan.createMany({
          data: mealPlansToCreate,
        });
      });
      return createdMealPlans;
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new Error(
          `Duplicate meal plan: A meal plan already exists for this user and day.`
        );
      } else if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Failed to bulk create meal plans.");
      }
    }
  }



  private async createMeal(prisma: any, mealData: any) {
    const { foodname, ingredients, nutrition, recipe } = mealData;

    // Filter out any undefined steps
    const validSteps = recipe
      .map((step: any) => step.instruction)
      .filter((step: string | undefined) => step !== undefined);

    // First, create the Meal without linking Nutrition
    const createdMeal = await prisma.meal.create({
      data: {
        name: foodname,
        ingredients,
        steps: validSteps,
      },
    });

    // Now, create the Nutrition record and link it to the Meal
    const createdNutrition = await prisma.nutrition.create({
      data: {
        calories: parseInt(nutrition.calories),
        protein: nutrition.protein,
        carbohydrates: nutrition.carbohydrates,
        fat: nutrition.fat,
        meal: {
          connect: { id: createdMeal.id },
        },
      },
    });

    // Update the Meal with the linked nutritionId
    const updatedMeal = await prisma.meal.update({
      where: { id: createdMeal.id },
      data: {
        nutritionId: createdNutrition.id,
      },
      include: {
        nutrition: true,
      },
    });

    return updatedMeal;
  }

  async getDefaultMealPlans() {
    try {
      const defaultMealPlans = await prisma.mealPlan.findMany({
        where: { userId: null },
        include: {
          morningMeal: {
            include: {
              nutrition: true,
            },
          },
          afternoonMeal: {
            include: {
              nutrition: true,
            },
          },
          eveningMeal: {
            include: {
              nutrition: true,
            },
          },
        },
      });
      return defaultMealPlans;
    } catch (error) {
      console.error("Error fetching default meal plans:", error);
      throw new Error("Failed to fetch default meal plans.");
    }
  }
  
 
  

  async replaceMealPlans(userId: number, mealplans: any[]) {
    const results = [];

    for (const plan of mealplans) {
      const { date, meals } = plan;
      const mealPlanDate = new Date(date);

      if (isNaN(mealPlanDate.getTime())) {
        throw new Error(`Invalid date format: ${date}`);
      }

      try {
        const existingMealPlan = await prisma.mealPlan.findUnique({
          where: {
            userId_day: {
              userId: userId,
              day: mealPlanDate,
            },
          },
        });

        if (existingMealPlan) {
          await prisma.mealPlan.delete({
            where: {
              id: existingMealPlan.id,
            },
          });
        }

        const morningMeal = await this.createMeal(prisma, meals.morning);
        const afternoonMeal = await this.createMeal(prisma, meals.afternoon);
        const eveningMeal = await this.createMeal(prisma, meals.evening);

        const newMealPlan = await prisma.mealPlan.create({
          data: {
            userId,
            day: mealPlanDate,
            morningMealId: morningMeal.id,
            afternoonMealId: afternoonMeal.id,
            eveningMealId: eveningMeal.id,
          },
          include: {
            morningMeal: true,
            afternoonMeal: true,
            eveningMeal: true,
          },
        });

        results.push(newMealPlan);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(
            `Error replacing meal plan for user ${userId} on ${date}:`,
            error
          );
          throw new Error(`Error replacing meal plan: ${error.message}`);
        } else {
          console.error("Unknown error occurred while replacing the meal plan");
          throw new Error(
            "Failed to replace meal plan due to an unknown error."
          );
        }
      }
    }

    return results;
  }

  async getMealPlanById(id: number) {
    try {
      const mealPlan = await prisma.mealPlan.findUnique({
        where: { id },
        include: {
          morningMeal: {
            include: {
              nutrition: true, 
            },
          },
          afternoonMeal: {
            include: {
              nutrition: true, 
            },
          },
          eveningMeal: {
            include: {
              nutrition: true,
            },
          },
        },
      });
  
      if (!mealPlan) {
        throw new Error("Meal plan not found.");
      }
  
      return mealPlan;
    } catch (error) {
      console.error(`Error fetching meal plan with id ${id}:`, error);
      throw new Error("Failed to fetch meal plan.");
    }
  }
  

  async deleteMealPlan(userId: number, date: string) {
    const mealPlanDate = new Date(date);
    if (isNaN(mealPlanDate.getTime())) {
      throw new Error(`Invalid date format: ${date}`);
    }
    try {
      const existingMealPlan = await prisma.mealPlan.findUnique({
        where: {
          userId_day: {
            userId: userId,
            day: mealPlanDate,
          },
        },
      });
      if (!existingMealPlan) {
        throw new Error(`No meal plan found for user ${userId} on ${date}`);
      }
      await prisma.mealPlan.delete({
        where: {
          id: existingMealPlan.id,
        },
      });
      return { message: `Meal plan for ${date} successfully deleted.` };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Error deleting meal plan for user ${userId} on ${date}:`,
          error
        );
        throw new Error(`Error deleting meal plan: ${error.message}`);
      } else {
        throw new Error("Failed to delete meal plan due to an unknown error.");
      }
    }
  }

  async deleteAllMealPlansForUser(userId: number) {
    try {
      await prisma.mealPlan.deleteMany({
        where: {
          userId: userId,
        },
      });
      return {
        message: `All meal plans for user ${userId} successfully deleted.`,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          `Error deleting all meal plans for user ${userId}:`,
          error
        );
        throw new Error(`Error deleting all meal plans: ${error.message}`);
      } else {
        throw new Error("Failed to delete meal plans due to an unknown error.");
      }
    }
  }
}

export default MealPlanManager;
